/**
 * Saudi Banks Configuration
 */

export const SAUDI_BANKS = [
    {
        id: 'alrajhi',
        name: 'Al Rajhi Bank',
        nameAr: 'مصرف الراجحي',
        color: '#00A651',
        type: 'bank',
        smsSenderIds: ['AlRajhiBank', 'AlRajhi']
    },
    {
        id: 'snb',
        name: 'Saudi National Bank (SNB)',
        nameAr: 'البنك الأهلي السعودي',
        color: '#004B87',
        type: 'bank',
        smsSenderIds: ['SNB', 'NCB', 'AlAhli']
    },
    {
        id: 'riyad',
        name: 'Riyad Bank',
        nameAr: 'بنك الرياض',
        color: '#0052A5',
        type: 'bank',
        smsSenderIds: ['RiyadBank']
    },
    {
        id: 'sab',
        name: 'Saudi Awwal Bank (SAB)',
        nameAr: 'البنك السعودي الأول',
        color: '#0066B3',
        type: 'bank',
        smsSenderIds: ['SAB', 'SABB']
    },
    {
        id: 'anb',
        name: 'Arab National Bank (ANB)',
        nameAr: 'البنك العربي الوطني',
        color: '#E31E24',
        type: 'bank',
        smsSenderIds: ['ANB']
    },
    {
        id: 'saib',
        name: 'The Saudi Investment Bank (SAIB)',
        nameAr: 'البنك السعودي للاستثمار',
        color: '#1B4D89',
        type: 'bank',
        smsSenderIds: ['SAIB']
    },
    {
        id: 'alinma',
        name: 'Alinma Bank',
        nameAr: 'مصرف الإنماء',
        color: '#00A859',
        type: 'bank',
        smsSenderIds: ['Alinma', 'AlinmaBank']
    },
    {
        id: 'albilad',
        name: 'Bank Albilad',
        nameAr: 'بنك البلاد',
        color: '#D4AF37',
        type: 'bank',
        smsSenderIds: ['AlBilad', 'AlBiladBank']
    },
    {
        id: 'bsf',
        name: 'Banque Saudi Fransi (BSF)',
        nameAr: 'البنك السعودي الفرنسي',
        color: '#C8102E',
        type: 'bank',
        smsSenderIds: ['BSF']
    },
    {
        id: 'aljazira',
        name: 'Bank AlJazira',
        nameAr: 'بنك الجزيرة',
        color: '#0072BC',
        type: 'bank',
        smsSenderIds: ['AlJazira']
    },
    {
        id: 'gib',
        name: 'Gulf International Bank Saudi Arabia (GIB)',
        nameAr: 'بنك الخليج الدولي',
        color: '#003B5C',
        type: 'bank',
        smsSenderIds: ['GIB']
    },
    {
        id: 'emiratesnbd',
        name: 'Emirates NBD Saudi Arabia',
        nameAr: 'بنك الإمارات دبي الوطني',
        color: '#00923F',
        type: 'bank',
        smsSenderIds: ['EmiratesNBD']
    },
    {
        id: 'deutsche',
        name: 'Deutsche Bank (Saudi Arabia Branch)',
        nameAr: 'دويتشه بنك',
        color: '#0018A8',
        type: 'bank',
        smsSenderIds: ['Deutsche']
    },
    {
        id: 'jpmorgan',
        name: 'J.P. Morgan Saudi Arabia',
        nameAr: 'جي بي مورغان',
        color: '#0066B3',
        type: 'bank',
        smsSenderIds: ['JPMorgan']
    },
    {
        id: 'boc',
        name: 'Bank of China (Riyadh Branch)',
        nameAr: 'بنك الصين',
        color: '#C8102E',
        type: 'bank',
        smsSenderIds: ['BOC']
    },
    {
        id: 'stcpay',
        name: 'STC Pay',
        nameAr: 'STC Pay',
        color: '#5F259F',
        type: 'wallet',
        smsSenderIds: ['stcpay', 'stc pay']
    },
    {
        id: 'urpay',
        name: 'urpay',
        nameAr: 'يور باي',
        color: '#FF6B00',
        type: 'wallet',
        smsSenderIds: ['Urpay', 'urpay']
    },
    {
        id: 'cash',
        name: 'Cash',
        nameAr: 'نقدي',
        color: '#10B981',
        type: 'cash',
        smsSenderIds: []
    }
];

/**
 * Get bank by ID
 */
export const getBankById = (id) => {
    return SAUDI_BANKS.find(bank => bank.id === id) || SAUDI_BANKS[SAUDI_BANKS.length - 1];
};

/**
 * Get bank name by language
 */
export const getBankName = (id, language = 'ar') => {
    const bank = getBankById(id);
    return language === 'ar' ? bank.nameAr : bank.name;
};

export default SAUDI_BANKS;
