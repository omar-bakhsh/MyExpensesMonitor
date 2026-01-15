import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useExpensesStore, useTranslation, useUserStore } from '../store';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/helpers';
import ExpenseChart from '../components/ExpenseChart';
import { scanSMSForTransactions, requestSMSPermission } from '../services/smsService';
import { getCategoryById } from '../utils/categories';
import SearchBar from '../components/SearchBar';
import CategoryStats from '../components/CategoryStats';
import FilterModal from '../components/FilterModal';

const HomeScreen = ({ navigation }) => {
    const { budget, transactions: rawTransactions, addTransaction, budgetAlerts, searchTransactions, filterTransactions } = useExpensesStore();
    const { settings, updateSettings } = useUserStore();
    const { t, isRTL } = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const transactions = rawTransactions || [];
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedAccountFilter, setSelectedAccountFilter] = useState(null);

    const totalSpent = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    const remaining = budget - totalSpent;

    // Check budget alert
    const budgetPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
    const shouldShowAlert = budgetAlerts?.general?.enabled && budgetPercentage >= 50;
    const alertLevel = budgetPercentage >= 90 ? 'danger' : budgetPercentage >= 75 ? 'warning' : 'info';

    // Auto-scan SMS on mount
    React.useEffect(() => {
        if (settings?.pushNotificationsEnabled) {
            handleScanSMS(false); // background scan
        }
    }, []);

    // Update filtered transactions when search or filters change
    React.useEffect(() => {
        let results = transactions;

        // Apply account filter (Bank/Card)
        if (selectedAccountFilter) {
            if (selectedAccountFilter.type === 'bank') {
                results = results.filter(t => t.bankName === selectedAccountFilter.value);
            } else if (selectedAccountFilter.type === 'card') {
                results = results.filter(t => t.cardLast4 === selectedAccountFilter.value);
            }
        }

        // Apply advanced filters first
        if (Object.keys(activeFilters).length > 0) {
            results = filterTransactions(activeFilters);
        }

        // Then apply search query
        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            results = results.filter(t =>
                t.merchant.toLowerCase().includes(lowerQuery) ||
                t.amount.toString().includes(searchQuery) ||
                (t.category && t.category.toLowerCase().includes(lowerQuery))
            );
        }

        setFilteredTransactions(results);
    }, [searchQuery, transactions, activeFilters]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
    };

    const handleScanSMS = async (isManual = true) => {
        if (isManual) setIsScanning(true);

        try {
            // Check if permission was already granted
            if (!settings?.smsPermissionGranted) {
                const granted = await requestSMSPermission();
                if (!granted) {
                    if (isManual) {
                        Alert.alert(
                            t('permissionRequired') || 'Permission Required',
                            t('smsPermissionMessage') || 'SMS permission is required to scan transaction messages.',
                            [{ text: 'OK' }]
                        );
                    }
                    if (isManual) setIsScanning(false);
                    return;
                }
                updateSettings({ smsPermissionGranted: true });
            }

            // Scan SMS for transactions
            // Pass the list of user's enabled banks to filter messages appropriately
            const { banks } = useExpensesStore.getState();
            const scannedTransactions = await scanSMSForTransactions(banks || []);

            if (scannedTransactions.length > 0) {
                // Add all scanned transactions
                scannedTransactions.forEach(tx => addTransaction(tx));

                if (isManual) {
                    Alert.alert(
                        t('success') || 'Success',
                        `${scannedTransactions.length} ${t('transactionsImported') || 'transactions imported from SMS'}`,
                        [{ text: 'OK' }]
                    );
                }
            } else if (isManual) {
                Alert.alert(
                    t('noTransactionsFound') || 'No Transactions Found',
                    t('noSmsTransactions') || 'No bank transaction messages were found in your SMS.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('SMS scan error:', error);
            if (isManual) {
                Alert.alert(
                    t('error') || 'Error',
                    t('smsScanError') || 'Failed to scan SMS messages. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } finally {
            if (isManual) setIsScanning(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View>
                        <Text style={[styles.greeting, { textAlign: isRTL ? 'right' : 'left' }]}>{t('welcome')}</Text>
                        <Text style={[styles.username, { textAlign: isRTL ? 'right' : 'left' }]}>User</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <Ionicons name="person" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Budget Summary Card */}
                <Card style={styles.budgetCard}>
                    <View style={[styles.summaryHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('totalBalance')}</Text>
                            <Text style={[styles.balance, { textAlign: isRTL ? 'right' : 'left' }]}>{formatCurrency(remaining)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editIncomeBtn}
                            onPress={() => navigation.navigate('Income')}
                        >
                            <Ionicons name="pencil-outline" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.summaryItem}>
                            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Ionicons name="arrow-down" size={16} color="#FFF" />
                            </View>
                            <View>
                                <Text style={[styles.subLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('totalIncome')}</Text>
                                <Text style={[styles.value, { textAlign: isRTL ? 'right' : 'left' }]}>{formatCurrency(budget)}</Text>
                            </View>
                        </View>
                        <View style={styles.summaryItem}>
                            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Ionicons name="arrow-up" size={16} color="#FFF" />
                            </View>
                            <View>
                                <Text style={[styles.subLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('spent')}</Text>
                                <Text style={[styles.valueWarning, { textAlign: isRTL ? 'right' : 'left' }]}>{formatCurrency(totalSpent)}</Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Actions Grid */}
                <View style={[styles.actionsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={handleScanSMS}
                        disabled={isScanning}
                    >
                        {isScanning ? (
                            <ActivityIndicator color={COLORS.surface} />
                        ) : (
                            <>
                                <Ionicons name="scan" size={24} color={COLORS.surface} />
                                <Text style={styles.actionText}>{t('scanSms')}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => navigation.navigate('AddTransaction')}>
                        <Ionicons name="add" size={24} color={COLORS.primary} />
                        <Text style={[styles.actionText, { color: COLORS.primary }]}>{t('addManual')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Budget Alert Banner */}
                {shouldShowAlert && (
                    <Card style={[styles.alertBanner, {
                        backgroundColor: alertLevel === 'danger' ? '#FEE2E2' : alertLevel === 'warning' ? '#FEF3C7' : '#DBEAFE'
                    }]}>
                        <View style={[styles.alertContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Ionicons
                                name={alertLevel === 'danger' ? 'warning' : 'information-circle'}
                                size={24}
                                color={alertLevel === 'danger' ? '#DC2626' : alertLevel === 'warning' ? '#D97706' : '#2563EB'}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.alertTitle, {
                                    color: alertLevel === 'danger' ? '#DC2626' : alertLevel === 'warning' ? '#D97706' : '#2563EB',
                                    textAlign: isRTL ? 'right' : 'left'
                                }]}>
                                    {t('budgetAlert')}
                                </Text>
                                <Text style={[styles.alertText, { textAlign: isRTL ? 'right' : 'left' }]}>
                                    {t('youveSpent')} {budgetPercentage.toFixed(0)}% {t('ofYourBudget')}
                                </Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Spending by Bank/Card Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginBottom: 0 }]}>
                        {t('walletsAndBanks')}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('BankSelection')}>
                        <Text style={styles.viewAllText}>{t('edit')}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.bankStatsList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                    {/* All Transactions Card */}
                    <TouchableOpacity
                        style={[styles.bankStatCard, !selectedAccountFilter && styles.activeStatCard]}
                        onPress={() => setSelectedAccountFilter(null)}
                    >
                        <View style={[styles.bankStatIcon, { backgroundColor: COLORS.primary + '20' }]}>
                            <Ionicons name="apps" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.bankStatName}>{isRTL ? 'الكل' : 'All'}</Text>
                        <Text style={styles.bankStatAmount}>{formatCurrency(totalSpent)}</Text>
                    </TouchableOpacity>

                    {/* Dynamic Bank Cards */}
                    {Object.entries(
                        (transactions || []).reduce((acc, tx) => {
                            const bank = tx.bankName || (isRTL ? 'غير معروف' : 'Unknown');
                            acc[bank] = (acc[bank] || 0) + (tx.amount || 0);
                            return acc;
                        }, {})
                    ).map(([bankName, amount]) => (
                        <TouchableOpacity
                            key={bankName}
                            style={[
                                styles.bankStatCard,
                                selectedAccountFilter?.type === 'bank' && selectedAccountFilter?.value === bankName && styles.activeStatCard
                            ]}
                            onPress={() => setSelectedAccountFilter({ type: 'bank', value: bankName })}
                        >
                            <View style={[styles.bankStatIcon, { backgroundColor: COLORS.border }]}>
                                <Ionicons name="card-outline" size={20} color={COLORS.textSecondary} />
                            </View>
                            <Text style={styles.bankStatName} numberOfLines={1}>{bankName}</Text>
                            <Text style={styles.bankStatAmount}>{formatCurrency(amount)}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Spending by Cards Section */}
                {transactions.some(tx => tx?.cardLast4) && (
                    <View style={{ marginTop: SPACING.m, marginBottom: SPACING.m }}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginBottom: 0 }]}>
                                {t('cardSpending')}
                            </Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[styles.bankStatsList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                        >
                            {Object.entries(
                                (transactions || []).reduce((acc, tx) => {
                                    if (tx?.cardLast4) {
                                        const card = tx.cardLast4;
                                        acc[card] = (acc[card] || 0) + (tx.amount || 0);
                                    }
                                    return acc;
                                }, {})
                            ).map(([cardNum, amount]) => (
                                <TouchableOpacity
                                    key={cardNum}
                                    style={[
                                        styles.bankStatCard,
                                        styles.cardStatCard,
                                        selectedAccountFilter?.type === 'card' && selectedAccountFilter?.value === cardNum && styles.activeStatCard
                                    ]}
                                    onPress={() => setSelectedAccountFilter({ type: 'card', value: cardNum })}
                                >
                                    <View style={[styles.bankStatIcon, { backgroundColor: '#1E293B' }]}>
                                        <Ionicons name="card" size={20} color="#FFF" />
                                    </View>
                                    <Text style={styles.bankStatName}>**** {cardNum}</Text>
                                    <Text style={styles.bankStatAmount}>{formatCurrency(amount)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} onFilterPress={() => setShowFilterModal(true)} />

                {/* Category Statistics */}
                {transactions.length > 0 && <CategoryStats transactions={transactions} />}

                {/* Quick Stats Access */}
                {transactions.length > 0 && (
                    <TouchableOpacity
                        style={styles.quickStatsBtn}
                        onPress={() => navigation.navigate('MerchantStats')}
                    >
                        <View style={styles.quickStatsBtnContent}>
                            <Ionicons name="storefront-outline" size={24} color={COLORS.primary} />
                            <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                <Text style={styles.quickStatsBtnTitle}>{t('merchantStats')}</Text>
                                <Text style={styles.quickStatsBtnSubtitle}>
                                    {isRTL ? 'عرض إحصائيات المتاجر' : 'View merchant spending'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                        </View>
                    </TouchableOpacity>
                )}

                {/* Expense Chart */}
                {transactions.length > 0 && (
                    <View>
                        <ExpenseChart transactions={transactions} />
                        <TouchableOpacity
                            style={[styles.quickStatsBtn, { marginTop: SPACING.s }]}
                            onPress={() => navigation.navigate('Reports')}
                        >
                            <View style={styles.quickStatsBtnContent}>
                                <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
                                <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                    <Text style={styles.quickStatsBtnTitle}>{t('reports')}</Text>
                                    <Text style={styles.quickStatsBtnSubtitle}>
                                        {isRTL ? 'عرض التقارير التفصيلية' : 'View detailed reports'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Recent Transactions */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('recentTransactions')}</Text>
                {filteredTransactions.length === 0 ? (
                    <Card style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {searchQuery ? t('noSearchResults') : t('noTransactions')}
                        </Text>
                    </Card>
                ) : (
                    filteredTransactions.slice(0, settings.dashboardLayout.transactionLimit).map((tx) => {
                        const category = getCategoryById(tx.category || 'Uncategorized');
                        return (
                            <Card key={tx.id} style={[styles.transactionCard, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <View style={[styles.txIcon, {
                                    backgroundColor: `${category.color}20`,
                                    marginRight: isRTL ? 0 : SPACING.m,
                                    marginLeft: isRTL ? SPACING.m : 0
                                }]}>
                                    <Ionicons name={category.icon} size={20} color={category.color} />
                                </View>
                                <View style={styles.txDetails}>
                                    <Text style={[styles.txMerchant, { textAlign: isRTL ? 'right' : 'left' }]}>{tx.merchant}</Text>
                                    <Text style={[styles.txDate, { textAlign: isRTL ? 'right' : 'left' }]}>{new Date(tx.date).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.txAmount}>-{formatCurrency(tx.amount)}</Text>
                            </Card>
                        );
                    })
                )}

            </ScrollView>

            <FilterModal
                visible={showFilterModal}
                currentFilters={activeFilters}
                onClose={() => setShowFilterModal(false)}
                onApply={handleApplyFilters}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        padding: SPACING.m,
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontFamily: FONTS.regular,
    },
    username: {
        fontSize: 24,
        color: COLORS.text,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    budgetCard: {
        backgroundColor: COLORS.primary,
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    balance: {
        color: COLORS.surface,
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: SPACING.s,
    },
    row: {
        justifyContent: 'space-between',
        marginTop: SPACING.m,
    },
    subLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    value: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '600',
    },
    valueWarning: {
        color: '#FCA5A5', // Light red
        fontSize: 16,
        fontWeight: '600',
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    editIncomeBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: SPACING.m,
    },
    summaryItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    summaryIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsGrid: {
        gap: SPACING.m,
        marginBottom: SPACING.l,
    },
    actionBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.s,
    },
    secondaryBtn: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    actionText: {
        color: COLORS.surface,
        fontWeight: '600',
    },
    alertBanner: {
        marginBottom: SPACING.m,
    },
    alertContent: {
        alignItems: 'center',
        gap: SPACING.m,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    alertText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.l,
    },
    emptyText: {
        color: COLORS.textSecondary,
    },
    transactionCard: {
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    txIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txDetails: {
        flex: 1,
    },
    txMerchant: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    txDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    txAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.error,
    },
    quickStatsBtn: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    quickStatsBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quickStatsBtnTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    quickStatsBtnSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    viewAllText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    bankStatsList: {
        gap: SPACING.m,
        paddingBottom: SPACING.s,
    },
    bankStatCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.m,
        width: 130,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    cardStatCard: {
        backgroundColor: '#F8FAFC',
    },
    bankStatIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.s,
    },
    bankStatName: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginBottom: 4,
    },
    bankStatAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    activeStatCard: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor: COLORS.primary + '05',
    },
});

export default HomeScreen;

