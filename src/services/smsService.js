import { Platform, PermissionsAndroid, Alert } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

/**
 * SMS Service for scanning and parsing bank transaction messages
 */

// Request SMS permissions (Android only)
export const requestSMSPermission = async () => {
    if (Platform.OS !== 'android') {
        return false; // iOS doesn't support SMS reading
    }

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
                title: 'SMS Permission',
                message: 'MyExpensesMonitor needs access to your SMS to scan bank transaction messages.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn('SMS permission error:', err);
        return false;
    }
};

// Common keywords for transaction messages
const TRANSACTION_KEYWORDS = [
    'purchase', 'spent', 'debit', 'withdraw', 'transfer', 'paid', 'pos', 'atm',
    'شراء', 'دفع', 'سحب', 'تحويل', 'صرف', 'مشتريات', 'نقاط بيع', 'مدى'
];

// Bank Sender IDs (add more as needed)
const BANK_SENDERS = [
    'AlRajhiBank', 'SNB', 'NCB', 'RiyadBank', 'SABB', 'ANB',
    'Alinma', 'AlJazira', 'AlBilad', 'SAIB', 'BSF', 'GIB',
    'stcpay', 'Urpay', 'Loop', 'Tweeq', 'MobilyPay', 'Tiqmo'
];

// Parse transaction from SMS text
export const parseTransactionFromSMS = (smsText, sender) => {
    // Basic amount regex - looks for currency + amount or amount + currency
    // Supports: SAR 10.50, SR 100, 50.00 SAR, ر.س 500, ريال 50
    const amountRegex = /(?:SAR|SR|RAS|SAU|ر\.س|ريال)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)|\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:SAR|SR|RAS|SAU|ر\.س|ريال)/i;

    // Merchant regex - attempts to find "at [Merchant]" or "from [Merchant]" or "لدى [المتجر]"
    // Improved to handle common bank message boundaries
    const merchantRegex = /(?:at|@|to|from|لدى|من|في)\s+([A-Za-z0-9\s\-_&أ-ي]+?)(?:\s+on|\s+dated|\s+time|\s+date|\.|\s+using|$)/i;

    // Attempt extract amount
    const amountMatch = smsText.match(amountRegex);
    let amount = null;

    if (amountMatch) {
        const amountStr = amountMatch[1] || amountMatch[2];
        if (amountStr) {
            amount = parseFloat(amountStr.replace(/,/g, ''));
        }
    }

    // Extract Card Last 4 digits
    const cardRegex = /(?:\.|\*|ending in|ending|بطاقة|تنتهي بـ|بطاقة رقم)\s*(\d{4})/i;
    const cardMatch = smsText.match(cardRegex);
    let cardLast4 = null;
    if (cardMatch) {
        cardLast4 = cardMatch[1];
    }

    if (!amount) return null;

    // Attempt extract merchant
    let merchant = 'Unknown';
    if (sender && !sender.match(/^\d+$/)) {
        merchant = sender;
    }

    const merchantMatch = smsText.match(merchantRegex);
    if (merchantMatch) {
        merchant = merchantMatch[1].trim();

        // Remove common trailing noise
        const stopWords = ['on', 'completed', 'successfully', 'using', 'card', 'ending', 'at', 'with'];
        stopWords.forEach(word => {
            const pattern = new RegExp(`\\s+${word}$`, 'i');
            merchant = merchant.replace(pattern, '');
        });
    }

    // Determine category based on merchant name keywords
    let category = 'Uncategorized';
    const lowerMerchant = merchant.toLowerCase();

    if (lowerMerchant.match(/uber|careem|gas|station|محطة|بنزين|taxi/)) category = 'transport';
    else if (lowerMerchant.match(/market|grocery|food|panda|othaim|بندة|عثيم|تموينات/)) category = 'groceries';
    else if (lowerMerchant.match(/restaurant|cafe|coffee|burger|pizza|مطعم|مقهى|قهوة/)) category = 'dining';
    else if (lowerMerchant.match(/stc|mobily|zain|net|fatura|electricity|كهرباء|فاتورة/)) category = 'utilities';
    else if (lowerMerchant.match(/hospital|pharmacy|dr|clinic|مستشفى|صيدلية|طبيب/)) category = 'health';
    else if (lowerMerchant.match(/pay|transfer|tahweel|تحويل/)) category = 'transfer';
    else if (lowerMerchant.match(/mall|shop|store|amazon|noon|clothing|ملابس|سوق/)) category = 'shopping';

    return {
        amount,
        merchant: merchant.trim(),
        date: new Date().toISOString(),
        category,
        cardLast4,
        bankName: sender,
        originalText: smsText
    };
};

const fetchSMS = (filter = {}) => {
    return new Promise((resolve, reject) => {
        SmsAndroid.list(
            JSON.stringify({
                box: 'inbox',
                maxCount: 100, // Limit to last 100 messages for performance
                ...filter,
            }),
            (fail) => {
                reject(fail);
            },
            (count, smsList) => {
                const arr = JSON.parse(smsList);
                resolve(arr);
            }
        );
    });
};

// Main function to scan SMS messages
export const scanSMSForTransactions = async (userBanks = []) => {
    if (Platform.OS !== 'android') {
        Alert.alert(
            'Not Available',
            'SMS scanning is only available on Android devices.',
            [{ text: 'OK' }]
        );
        return [];
    }

    // Check if the native module is available
    if (!SmsAndroid || !SmsAndroid.list) {
        Alert.alert(
            'Development Build Required',
            'SMS scanning requires a custom Development Build because it uses native SMS APIs. It will not work in the standard Expo Go app.\n\nPlease run "npx expo run:android" to install the dev build.',
            [{ text: 'OK' }]
        );
        console.warn('SmsAndroid native module is not available. Are you running in Expo Go?');
        // Return mock data for testing in Expo Go if needed, or just empty
        return [];
    }

    // Build list of valid sender IDs from user's selected banks + default hardcoded list as fallback
    let validSenders = [...BANK_SENDERS];

    // If user has defined banks, add their SMS Sender IDs to the whitelist
    if (userBanks && userBanks.length > 0) {
        userBanks.forEach(bank => {
            if (bank.smsSenderIds && Array.isArray(bank.smsSenderIds)) {
                validSenders.push(...bank.smsSenderIds);
            }
        });
        // Remove duplicates
        validSenders = [...new Set(validSenders)];
    }

    try {
        const hasPermission = await requestSMSPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Unable to access SMS messages.');
            return [];
        }

        // Fetch messages
        const messages = await fetchSMS();

        const transactions = [];

        if (Array.isArray(messages)) {
            messages.forEach(msg => {
                if (!msg) return;
                // Check if message is relevant
                const body = msg.body;
                const address = msg.address || ''; // Sender can be null sometimes

                // 1. Is it from a known bank sender?
                const isBankSender = validSenders.some(sender => address.toLowerCase().includes(sender.toLowerCase()));

                // 2. Does it have transaction keywords?
                const hasKeywords = TRANSACTION_KEYWORDS.some(kw => body.toLowerCase().includes(kw));

                if (isBankSender || hasKeywords) {
                    const parsed = parseTransactionFromSMS(body, address);

                    if (parsed && parsed.amount) {
                        transactions.push({
                            id: `sms-${msg._id}`,
                            ...parsed,
                            date: new Date(msg.date).toISOString(), // Use actual SMS date
                            source: 'SMS',
                        });
                    }
                }
            });
        }

        return transactions;
    } catch (error) {
        console.error('Error scanning SMS:', error);
        Alert.alert('Error', 'Failed to scan SMS messages');
        return [];
    }
};

export default {
    requestSMSPermission,
    parseTransactionFromSMS,
    scanSMSForTransactions,
};
