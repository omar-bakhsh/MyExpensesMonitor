import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS } from '../utils/translations';
import { I18nManager } from 'react-native';

export const useExpensesStore = create(
    persist(
        (set, get) => ({
            transactions: [],
            uncategorized: [],
            budget: 5000,
            banks: [],
            cards: [],
            budgetAlerts: {
                general: {
                    enabled: true,
                    limit: 5000,
                    thresholds: [50, 75, 90, 100],
                    currentSpent: 0
                },
                categories: {}
            },
            savingsGoals: [],

            addTransaction: (transaction) => set((state) => {
                const newTransactions = [transaction, ...state.transactions];
                // Update budget alert current spent
                const totalSpent = newTransactions.reduce((acc, t) => acc + t.amount, 0);
                return {
                    transactions: newTransactions,
                    budgetAlerts: {
                        ...state.budgetAlerts,
                        general: {
                            ...state.budgetAlerts.general,
                            currentSpent: totalSpent
                        }
                    }
                };
            }),

            setBudget: (amount) => set((state) => ({
                budget: amount,
                budgetAlerts: {
                    ...state.budgetAlerts,
                    general: {
                        ...state.budgetAlerts.general,
                        limit: amount
                    }
                }
            })),

            categorizeTransaction: (id, category) => set((state) => ({
                transactions: state.transactions.map(t => t.id === id ? { ...t, category } : t)
            })),

            // Bank Management
            addBank: (bank) => set((state) => ({
                banks: [...state.banks, { ...bank, id: Date.now().toString(), smsSenderIds: bank.smsSenderIds || [] }]
            })),

            updateBank: (id, updates) => set((state) => ({
                banks: state.banks.map(b => b.id === id ? { ...b, ...updates } : b)
            })),

            deleteBank: (id) => set((state) => ({
                banks: state.banks.filter(b => b.id !== id)
            })),

            // Card Management
            addCard: (card) => set((state) => ({
                cards: [...state.cards, { ...card, id: Date.now().toString() }]
            })),

            updateCard: (id, updates) => set((state) => ({
                cards: state.cards.map(c => c.id === id ? { ...c, ...updates } : c)
            })),

            deleteCard: (id) => set((state) => ({
                cards: state.cards.filter(c => c.id !== id)
            })),

            // Budget Alerts
            updateBudgetAlert: (type, categoryId, settings) => set((state) => {
                if (type === 'general') {
                    return {
                        budgetAlerts: {
                            ...state.budgetAlerts,
                            general: { ...state.budgetAlerts.general, ...settings }
                        }
                    };
                } else {
                    return {
                        budgetAlerts: {
                            ...state.budgetAlerts,
                            categories: {
                                ...state.budgetAlerts.categories,
                                [categoryId]: settings
                            }
                        }
                    };
                }
            }),

            // Savings Goals
            addGoal: (goal) => set((state) => ({
                savingsGoals: [...state.savingsGoals, { ...goal, id: Date.now().toString(), currentAmount: 0, isCompleted: false }]
            })),

            updateGoal: (id, updates) => set((state) => ({
                savingsGoals: state.savingsGoals.map(g => g.id === id ? { ...g, ...updates } : g)
            })),

            deleteGoal: (id) => set((state) => ({
                savingsGoals: state.savingsGoals.filter(g => g.id !== id)
            })),

            // Search & Filter
            searchTransactions: (query) => {
                const state = get();
                const lowerQuery = query.toLowerCase();
                return state.transactions.filter(t =>
                    t.merchant.toLowerCase().includes(lowerQuery) ||
                    t.amount.toString().includes(query) ||
                    (t.category && t.category.toLowerCase().includes(lowerQuery))
                );
            },

            filterTransactions: (filters) => {
                const state = get();
                let filtered = [...state.transactions];

                if (filters.category) {
                    filtered = filtered.filter(t => t.category === filters.category);
                }
                if (filters.cardId) {
                    filtered = filtered.filter(t => t.cardId === filters.cardId);
                }
                if (filters.bankId) {
                    filtered = filtered.filter(t => t.bankId === filters.bankId);
                }
                if (filters.dateFrom) {
                    filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
                }
                if (filters.dateTo) {
                    filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo));
                }
                if (filters.minAmount !== undefined) {
                    filtered = filtered.filter(t => t.amount >= filters.minAmount);
                }
                if (filters.maxAmount !== undefined) {
                    filtered = filtered.filter(t => t.amount <= filters.maxAmount);
                }

                return filtered;
            },

            resetData: () => set({
                transactions: [],
                budget: 5000,
                budgetAlerts: {
                    general: {
                        enabled: true,
                        limit: 5000,
                        thresholds: [50, 75, 90, 100],
                        currentSpent: 0
                    },
                    categories: {}
                }
            }),
        }),
        {
            name: 'expenses-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: { name: 'User' },
            settings: {
                currency: 'SAR',
                language: 'ar', // Default Arabic
                smsPermissionGranted: false,
                pushNotificationsEnabled: true,
                chartRange: '7D', // 7D, 1M, 3M, 6M
                dashboardLayout: {
                    showChart: true,
                    showGoals: true,
                    showAlerts: true,
                    transactionLimit: 50
                },
                filterPresets: [] // Saved filter configurations
            },
            setUser: (user) => set({ user }),
            updateSettings: (newSettings) => {
                set((state) => ({ settings: { ...state.settings, ...newSettings } }));
                // Handle RTL toggle if language changes (requires reload usually)
                if (newSettings.language) {
                    const isRTL = newSettings.language === 'ar';
                    if (I18nManager.isRTL !== isRTL) {
                        I18nManager.allowRTL(isRTL);
                        I18nManager.forceRTL(isRTL);
                        // Note: Updates.reloadAsync() would be ideal here if in managed workflow
                    }
                }
            },

            // Filter Presets
            saveFilterPreset: (name, filters) => set((state) => ({
                settings: {
                    ...state.settings,
                    filterPresets: [
                        ...state.settings.filterPresets,
                        { id: Date.now().toString(), name, filters, createdAt: new Date().toISOString() }
                    ]
                }
            })),

            deleteFilterPreset: (id) => set((state) => ({
                settings: {
                    ...state.settings,
                    filterPresets: state.settings.filterPresets.filter(p => p.id !== id)
                }
            })),

            updateFilterPreset: (id, updates) => set((state) => ({
                settings: {
                    ...state.settings,
                    filterPresets: state.settings.filterPresets.map(p =>
                        p.id === id ? { ...p, ...updates } : p
                    )
                }
            })),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Helper Hook for Translations
export const useTranslation = () => {
    const language = useUserStore(state => state.settings.language);

    const t = (key) => {
        const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
        return dict[key] || key;
    };

    const isRTL = language === 'ar';

    return { t, language, isRTL };
};
