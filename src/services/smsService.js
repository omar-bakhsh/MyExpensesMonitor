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
    'purchase', 'spent', 'debit', 'withdraw', 'transfer', 'paid',
    'شراء', 'دفع', 'سحب', 'تحويل', 'صرف', 'مشتريات'
];

// Bank Sender IDs (add more as needed)
const BANK_SENDERS = [
    'AlRajhiBank', 'SNB', 'NCB', 'RiyadBank', 'SABB', 'ANB',
    'Alinma', 'AlJazira', 'AlBilad', 'SAIB', 'BSF', 'GIB',
    'stcpay', 'Urpay', 'Loop', 'Tweeq'
];

// Parse transaction from SMS text
export const parseTransactionFromSMS = (smsText, sender) => {
    // Basic amount regex - looks for currency + amount or amount + currency
    // Supports: SAR 10.50, SR 100, 50.00 SAR, ر.س 500
    const amountRegex = /(?:SAR|SR|RAS|SAU|ر\.س|ريال)\s*(\d+(?:,\d+)*(?:\.\d{2})?)|\s*(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:SAR|SR|RAS|SAU|ر\.س|ريال)/i;

    // Merchant regex - attempts to find "at [Merchant]" or "from [Merchant]"
    const merchantRegex = /(?:at|@|to|from|لدى|من)\s+([A-Za-z0-9\s\-_&]+?)(?:\s+on|\s+dated|\s+time|\s+date|\.|$)/i;

    // Attempt extract amount
    const amountMatch = smsText.match(amountRegex);
    let amount = null;

    if (amountMatch) {
        // amountMatch[1] or amountMatch[2] will contain the number
        const amountStr = amountMatch[1] || amountMatch[2];
        if (amountStr) {
            amount = parseFloat(amountStr.replace(/,/g, ''));
        }
    }

    // Extract Card Last 4 digits
    // Supports formats like: ...1234, *1234, card ending 1234, بطاقة تنتهي بـ 1234
    const cardRegex = /(?:\.|\*|ending in|ending|بطاقة|تنتهي بـ)\s*(\d{4})/i;
    const cardMatch = smsText.match(cardRegex);
    let cardLast4 = null;
    if (cardMatch) {
        cardLast4 = cardMatch[1];
    }

    // If no amount found, it's probably not a transaction we care about
    if (!amount) return null;

    // Attempt extract merchant
    let merchant = 'Unknown';
    if (sender && !sender.match(/^\d+$/)) {
        // Use sender name as fallback/prefix if it looks like a bank name
        merchant = sender;
    }

    const merchantMatch = smsText.match(merchantRegex);
    if (merchantMatch) {
        // Clean up merchant name
        merchant = merchantMatch[1].trim();

        // Remove common trailing words if accidentally captured
        const stopWords = ['on', 'completed', 'successfully', 'using', 'card', 'ending', 'dev'];
        stopWords.forEach(word => {
            if (merchant.toLowerCase().endsWith(` ${word}`)) {
                merchant = merchant.substring(0, merchant.length - word.length - 1);
            }
        });
    }

    // Determine category based on merchant name keywords (simple heuristic)
    let category = 'Uncategorized';
    const lowerMerchant = merchant.toLowerCase();

    if (lowerMerchant.includes('uber') || lowerMerchant.includes('careem') || lowerMerchant.includes('gas') || lowerMerchant.includes('station')) category = 'transport';
    else if (lowerMerchant.includes('market') || lowerMerchant.includes('grocery') || lowerMerchant.includes('food') || lowerMerchant.includes('panda') || lowerMerchant.includes('othaim')) category = 'groceries';
    else if (lowerMerchant.includes('restaurant') || lowerMerchant.includes('cafe') || lowerMerchant.includes('coffee') || lowerMerchant.includes('burger') || lowerMerchant.includes('pizza')) category = 'dining';
    else if (lowerMerchant.includes('stc') || lowerMerchant.includes('mobily') || lowerMerchant.includes('zain') || lowerMerchant.includes('net')) category = 'utilities';
    else if (lowerMerchant.includes('hospital') || lowerMerchant.includes('pharmacy') || lowerMerchant.includes('dr') || lowerMerchant.includes('clinic')) category = 'health';
    else if (lowerMerchant.includes('pay') || lowerMerchant.includes('transfer')) category = 'transfer';

    return {
        amount,
        merchant: merchant.trim(),
        date: new Date().toISOString(), // We'll overwrite this with actual SMS date
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
