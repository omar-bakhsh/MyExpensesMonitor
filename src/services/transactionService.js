import { useExpensesStore } from '../store';

/**
 * Transaction Service for complex filtering and analysis
 * Designed for scalability
 */

export const filterTransactions = (transactions = [], filters = {}) => {
    let results = [...(transactions || [])];

    if (filters.category && filters.category !== 'all') {
        results = results.filter(t => t.category === filters.category);
    }

    if (filters.bank && filters.bank !== 'all') {
        results = results.filter(t => t.bankName === filters.bank);
    }

    if (filters.minAmount) {
        results = results.filter(t => t.amount >= parseFloat(filters.minAmount));
    }

    if (filters.maxAmount) {
        results = results.filter(t => t.amount <= parseFloat(filters.maxAmount));
    }

    if (filters.startDate) {
        const start = new Date(filters.startDate);
        results = results.filter(t => new Date(t.date) >= start);
    }

    if (filters.endDate) {
        const end = new Date(filters.endDate);
        results = results.filter(t => new Date(t.date) <= end);
    }

    return results;
};

export const calculateMerchantStats = (transactions = []) => {
    const stats = {};
    const safeTransactions = transactions || [];

    safeTransactions.forEach(tx => {
        if (!tx) return;
        const merchant = tx.merchant || 'Unknown';
        const amount = parseFloat(tx.amount) || 0;

        if (!stats[merchant]) {
            stats[merchant] = {
                name: merchant,
                total: 0,
                count: 0,
                lastDate: tx.date || new Date().toISOString()
            };
        }

        stats[merchant].total += amount;
        stats[merchant].count += 1;

        if (tx.date && (!stats[merchant].lastDate || new Date(tx.date) > new Date(stats[merchant].lastDate))) {
            stats[merchant].lastDate = tx.date;
        }
    });

    return Object.values(stats).sort((a, b) => b.total - a.total);
};

export default {
    filterTransactions,
    calculateMerchantStats
};
