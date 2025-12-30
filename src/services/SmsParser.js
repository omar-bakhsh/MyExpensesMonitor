/**
 * SMS Parser Service
 * Parses raw SMS text to extract transaction details.
 */

const PATTERNS = [
    // Example Pattern 1: Al Rajhi Bank (Hypothetical)
    // "Purchase of SAR 100.00 at Starbucks with card ending 1234..."
    {
        bankName: 'Generic Bank',
        regex: /Purchase of\s([A-Z]{3})\s([\d.,]+)\sat\s(.+?)\swith card/i,
        extract: (match) => ({
            currency: match[1],
            amount: parseFloat(match[2].replace(/,/g, '')),
            merchant: match[3].trim(),
            type: 'expense'
        })
    },
    // Arabic Pattern Example
    // "تمت عملية شراء بقيمة 50.00 ريال من مطعم البيك ..."
    {
        bankName: 'Generic Bank AR',
        regex: /تمت عملية شراء بقيمة\s([\d.,]+)\s(ريال|SAR)\sمن\s(.+?)\s/i,
        extract: (match) => ({
            currency: 'SAR',
            amount: parseFloat(match[1].replace(/,/g, '')),
            merchant: match[3].trim(),
            type: 'expense'
        })
    }
];

export const parseSms = (sender, body) => {
    // Normalize body
    const text = body.replace(/\r?\n|\r/g, ' ');

    for (const pattern of PATTERNS) {
        const match = text.match(pattern.regex);
        if (match) {
            return {
                ...pattern.extract(match),
                rawText: body,
                sender: sender,
                date: new Date().toISOString(), // In real app, might parse date from SMS or use SMS timestamp
                id: Math.random().toString(36).substr(2, 9) // Temp ID
            };
        }
    }
    return null;
};
