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
            incomeSources: [
                { id: '1', type: 'salary', amount: 5000, note: '' }
            ],
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

            setIncomeSources: (sources) => set((state) => {
                const totalIncome = (sources || []).reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);
                const currentAlerts = state.budgetAlerts || { general: { enabled: true, limit: 5000, thresholds: [50, 75, 90, 100], currentSpent: 0 }, categories: {} };
                return {
                    incomeSources: sources,
                    budget: totalIncome,
                    budgetAlerts: {
                        ...currentAlerts,
                        general: {
                            ...(currentAlerts.general || {}),
                            limit: totalIncome,
                            currentSpent: state.transactions.reduce((acc, t) => acc + (t.amount || 0), 0)
                        }
                    }
                };
            }),

            addTransaction: (transaction) => set((state) => {
                // Prevent duplicates if transaction has an ID (like SMS transactions)
                if (transaction.id && state.transactions.some(t => t.id === transaction.id)) {
                    return state;
                }

                const newTransactions = [transaction, ...state.transactions];
                // Update budget alert current spent
                const totalSpent = newTransactions.reduce((acc, t) => acc + t.amount, 0);
                const currentAlerts = state.budgetAlerts || { general: { enabled: true, limit: state.budget || 5000, thresholds: [50, 75, 90, 100], currentSpent: 0 }, categories: {} };
                return {
                    transactions: newTransactions,
                    budgetAlerts: {
                        ...currentAlerts,
                        general: {
                            ...(currentAlerts.general || {}),
                            currentSpent: totalSpent
                        }
                    }
                };
            }),

            setBudget: (amount) => set((state) => {
                const currentAlerts = state.budgetAlerts || { general: { enabled: true, limit: 5000, thresholds: [50, 75, 90, 100], currentSpent: 0 }, categories: {} };
                return {
                    budget: amount,
                    budgetAlerts: {
                        ...currentAlerts,
                        general: {
                            ...(currentAlerts.general || {}),
                            limit: amount
                        }
                    }
                };
            }),

            categorizeTransaction: (id, category) => set((state) => ({
                transactions: state.transactions.map(t => t.id === id ? { ...t, category } : t)
            })),

            // Bank Management
            addBank: (bank) => set((state) => {
                // Check if bank already exists (by original ID or name)
                const exists = state.banks.some(b => b.id === bank.id || b.name === bank.name);
                if (exists) return state;
                
                return {
                    banks: [...state.banks, { 
                        ...bank, 
                        id: bank.id || Date.now().toString(), 
                        smsSenderIds: bank.smsSenderIds || [] 
                    }]
                };
            }),

            updateBank: (id, updates) => set((state) => ({
                banks: state.banks.map(b => b.id === id ? { ...b, ...updates } : b)
            })),

            deleteBank: (id) => set((state) => ({
                banks: state.banks.filter(b => b.id !== id)
            })),

            // Card Management
            addCard: (card) => set((state) => {
                const exists = state.cards.some(c => c.id === card.id || (c.number && c.number === card.number));
                if (exists) return state;
                return {
                    cards: [...state.cards, { ...card, id: card.id || Date.now().toString() }]
                };
            }),

            updateCard: (id, updates) => set((state) => ({
                cards: state.cards.map(c => c.id === id ? { ...c, ...updates } : c)
            })),

            deleteCard: (id) => set((state) => ({
                cards: state.cards.filter(c => c.id !== id)
            })),

            // Budget Alerts
            updateBudgetAlert: (type, categoryId, settings) => set((state) => {
                const currentAlerts = state.budgetAlerts || { general: { enabled: true, limit: 5000, thresholds: [50, 75, 90, 100], currentSpent: 0 }, categories: {} };
                if (type === 'general') {
                    return {
                        budgetAlerts: {
                            ...currentAlerts,
                            general: { ...(currentAlerts.general || {}), ...settings }
                        }
                    };
                } else {
                    return {
                        budgetAlerts: {
                            ...currentAlerts,
                            categories: {
                                ...(currentAlerts.categories || {}),
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
                uncategorized: [],
                budget: 5000,
                incomeSources: [
                    { id: '1', type: 'salary', amount: 5000, note: '' }
                ],
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
                savingsGoals: []
            }),
        }),
        {
            name: 'expenses-storage',
            storage: createJSONStorage(() => AsyncStorage),
            version: 1,
            migrate: (persistedState, version) => {
                if (!persistedState) return persistedState;
                if (version === 0) {
                    // Transition from version 0 to 1
                    return {
                        ...persistedState,
                        incomeSources: persistedState.incomeSources || [
                            { id: '1', type: 'salary', amount: persistedState.budget || 5000, note: '' }
                        ],
                        budgetAlerts: persistedState.budgetAlerts || {
                            general: {
                                enabled: true,
                                limit: persistedState.budget || 5000,
                                thresholds: [50, 75, 90, 100],
                                currentSpent: 0
                            },
                            categories: {}
                        }
                    };
                }
                return persistedState;
            },
        }
    )
);

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: { 
                name: 'المستخدم', 
                position: 'موظف', 
                company: 'الشركة' 
            },
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
                biometricsEnabled: false,
                pinEnabled: false,
                pinCode: '',
                hideBalance: false,
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
