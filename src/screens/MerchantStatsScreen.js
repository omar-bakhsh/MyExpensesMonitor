import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { formatCurrency } from '../utils/helpers';

const MerchantStatsScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const { transactions } = useExpensesStore();

    // Calculate merchant statistics
    const merchantStats = React.useMemo(() => {
        const stats = {};

        transactions.forEach(tx => {
            const merchant = tx.merchant || 'Unknown';
            if (!stats[merchant]) {
                stats[merchant] = {
                    name: merchant,
                    totalAmount: 0,
                    count: 0,
                    lastTransaction: tx.date,
                    category: tx.category || 'Uncategorized'
                };
            }
            stats[merchant].totalAmount += tx.amount;
            stats[merchant].count += 1;
            if (new Date(tx.date) > new Date(stats[merchant].lastTransaction)) {
                stats[merchant].lastTransaction = tx.date;
            }
        });

        return Object.values(stats).sort((a, b) => b.totalAmount - a.totalAmount);
    }, [transactions]);

    const totalSpending = merchantStats.reduce((sum, m) => sum + m.totalAmount, 0);

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left', flex: 1 }]}>
                    {t('merchantStats')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Summary Card */}
                <Card style={styles.summaryCard}>
                    <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{merchantStats.length}</Text>
                            <Text style={styles.summaryLabel}>{t('totalMerchants')}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{transactions.length}</Text>
                            <Text style={styles.summaryLabel}>{t('totalTransactions')}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{formatCurrency(totalSpending)}</Text>
                            <Text style={styles.summaryLabel}>{t('totalSpent')}</Text>
                        </View>
                    </View>
                </Card>

                {/* Top Merchants */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('topMerchants')}
                </Text>

                {merchantStats.length === 0 ? (
                    <Card style={styles.emptyState}>
                        <Ionicons name="storefront-outline" size={48} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>{t('noMerchants')}</Text>
                    </Card>
                ) : (
                    merchantStats.slice(0, 10).map((merchant, index) => {
                        const percentage = ((merchant.totalAmount / totalSpending) * 100).toFixed(1);

                        return (
                            <Card key={merchant.name} style={styles.merchantCard}>
                                <View style={[styles.merchantHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <View style={styles.rankBadge}>
                                        <Text style={styles.rankText}>#{index + 1}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.merchantName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                            {merchant.name}
                                        </Text>
                                        <Text style={[styles.merchantInfo, { textAlign: isRTL ? 'right' : 'left' }]}>
                                            {merchant.count} {t('transactions')} • {t(merchant.category)}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                                        <Text style={styles.merchantAmount}>
                                            {formatCurrency(merchant.totalAmount)}
                                        </Text>
                                        <Text style={styles.merchantPercentage}>{percentage}%</Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View style={styles.progressContainer}>
                                    <View
                                        style={[
                                            styles.progressBar,
                                            { width: `${percentage}%` }
                                        ]}
                                    />
                                </View>
                            </Card>
                        );
                    })
                )}

                {/* Frequent Merchants */}
                {merchantStats.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginTop: SPACING.l }]}>
                            {t('frequentMerchants')}
                        </Text>
                        {[...merchantStats]
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 5)
                            .map((merchant, index) => (
                                <Card key={`freq-${merchant.name}`} style={styles.frequentCard}>
                                    <View style={[styles.frequentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <Ionicons name="repeat" size={20} color={COLORS.primary} />
                                        <Text style={[styles.frequentName, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}>
                                            {merchant.name}
                                        </Text>
                                        <Text style={styles.frequentCount}>
                                            {merchant.count} {t('times')}
                                        </Text>
                                    </View>
                                </Card>
                            ))
                        }
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.s,
    },
    title: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.m,
        paddingBottom: SPACING.xl,
    },
    summaryCard: {
        backgroundColor: COLORS.primary,
        marginBottom: SPACING.l,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.surface,
    },
    summaryLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
    },
    merchantCard: {
        marginBottom: SPACING.s,
    },
    merchantHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    merchantName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    merchantInfo: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    merchantAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    merchantPercentage: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginTop: SPACING.m,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    frequentCard: {
        marginBottom: SPACING.s,
    },
    frequentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    frequentName: {
        fontSize: 16,
        color: COLORS.text,
    },
    frequentCount: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default MerchantStatsScreen;
