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
    'purchase', 'spent', 'debit', 'withdraw', 'transfer', 'paid', 'pos', 'atm', 'online', 'declined',
    'شراء', 'دفع', 'سحب', 'تحويل', 'صرف', 'مشتريات', 'نقاط بيع', 'مدى', 'عملية', 'مخصوم'
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
    const amountRegex = /(?:SAR|SR|RAS|SAU|ر\.س|ريال|د\.إ|دينار|درهم)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)|\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:SAR|SR|RAS|SAU|ر\.س|ريال|د\.إ|دينار|درهم)/i;

    // Merchant regex - attempts to find "at [Merchant]" or "from [Merchant]" or "لدى [المتجر]"
    // Improved to handle common bank message boundaries and Arabic merchants
    const merchantRegex = /(?:at|@|to|from|لدى|من|في|شراء من)\s+([A-Za-z0-9\s\-_&أ-ي]+?)(?:\s+on|\s+dated|\s+time|\s+date|\s+using|بـ|في|$|\.)/i;

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
    const smsLower = smsText.toLowerCase();

    // Mapping patterns to categories
    const categoryPatterns = {
        transport: /uber|careem|gas|station|محطة|بنزين|taxi|qrreem|kayan|bolt|jeeny|freenow/,
        groceries: /market|grocery|food|panda|othaim|بندة|عثيم|تموينات|lulu|carrefour|danube|tamaz|farm|supermarket|مزرعة|سوبر ماركت|دانوب|لولو|كارفور/,
        dining: /restaurant|cafe|coffee|burger|pizza|مطعم|مقهى|قهوة|starbucks|dunkin|barn|kudu|hardees|maestro|albaik|بيك|كودو|ستار بكس|هرفي|برجر|بيتزا/,
        utilities: /stc|mobily|zain|net|fatura|electricity|كهرباء|فاتورة|enaya|water|tamara|tabby|مياه|اتصالات|تمارا|تابي/,
        health: /hospital|pharmacy|dr|clinic|مستشفى|صيدلية|طبيب|nahdi|daawa|نهدي|دواء|مجمع طبي/,
        transfer: /pay|transfer|tahweel|تحويل|fawri|stcpay|urpay|enjaz|إنجاز|فوري/,
        shopping: /mall|shop|store|amazon|noon|clothing|ملابس|سوق|jarir|eXtra|ikea|centerpoint|h&m|zara|namshi|نمشي|أمازون|نون|جرير|اكسترا|إيكيا/,
        entertainment: /netflix|osn|shahid|cinema|movies|games|playstation|xbox|ترفيه|سينما|شاهد|نتفليكس/,
        travel: /fly|air|hotel|booking|saudia|flynas|سياحة|فندق|طيران|سفر/
    };

    for (const [cat, pattern] of Object.entries(categoryPatterns)) {
        if (lowerMerchant.match(pattern) || (cat === 'utilities' && smsLower.match(pattern))) {
            category = cat;
            break;
        }
    }

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
                maxCount: 500, // Increased limit to find older bank messages
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

    // Build list of valid sender IDs ONLY from user's selected banks
    let validSenders = [];

    // If user has defined banks, add their SMS Sender IDs to the whitelist
    if (userBanks && userBanks.length > 0) {
        userBanks.forEach(bank => {
            if (bank.smsSenderIds && Array.isArray(bank.smsSenderIds)) {
                validSenders.push(...bank.smsSenderIds);
            }
        });
        // Remove duplicates and normalize to lowercase
        validSenders = [...new Set(validSenders.map(s => s.toLowerCase()))];
    }

    // If no banks are selected, don't scan anything to protect privacy
    if (validSenders.length === 0) {
        console.log('No banks selected for SMS scanning.');
        return [];
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

                // 1. Is it from a known bank sender? (Strict check)
                const isBankSender = validSenders.some(senderId => 
                    address.toLowerCase().includes(senderId) || 
                    senderId.includes(address.toLowerCase())
                );

                // 2. Does it have transaction keywords?
                const hasKeywords = TRANSACTION_KEYWORDS.some(kw => body.toLowerCase().includes(kw));

                // Process ONLY if it is a verified bank sender AND has transaction text
                if (isBankSender && hasKeywords) {
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
