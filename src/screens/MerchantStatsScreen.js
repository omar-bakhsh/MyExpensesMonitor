import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { formatCurrency } from '../utils/helpers';
import { calculateMerchantStats } from '../services/transactionService';

const MerchantStatsScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const rawTransactions = useExpensesStore(state => state.transactions) || [];
    const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];

    // Calculate merchant statistics using service
    const merchantStats = React.useMemo(() => {
        const stats = calculateMerchantStats(transactions);
        return (stats || []).map(s => ({
            ...s,
            totalAmount: s.total || 0,
            category: transactions.find(t => t.merchant === s.name)?.category || 'Uncategorized'
        }));
    }, [transactions]);

    const totalSpending = merchantStats.reduce((sum, m) => sum + m.totalAmount, 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('merchantStats')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <Card style={styles.summaryCard} variant="elevated">
                    <Text style={[styles.summaryLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('totalSpentAtMerchants')}</Text>
                    <Text style={[styles.summaryAmount, { textAlign: isRTL ? 'right' : 'left' }]}>{formatCurrency(totalSpending)}</Text>
                    <View style={[styles.summaryInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.summaryBadge}>
                            <Ionicons name="storefront" size={14} color={COLORS.primary} />
                            <Text style={styles.badgeText}>{merchantStats.length} {t('merchants')}</Text>
                        </View>
                    </View>
                </Card>

                {/* Merchant List */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('mostVisited')}</Text>
                {merchantStats.length === 0 ? (
                    <Card style={styles.emptyState}>
                        <Text style={styles.emptyText}>{t('noTransactions')}</Text>
                    </Card>
                ) : (
                    merchantStats.map((merchant, index) => (
                        <Card key={index} style={styles.merchantCard} variant="outlined">
                            <View style={[styles.merchantRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <View style={styles.merchantIcon}>
                                    <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
                                </View>
                                <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                    <Text style={[styles.merchantName, { textAlign: isRTL ? 'right' : 'left' }]}>{merchant.name}</Text>
                                    <Text style={[styles.merchantCount, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {merchant.count} {t('transactions')}
                                    </Text>
                                </View>
                                <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                                    <Text style={styles.merchantAmount}>{formatCurrency(merchant.totalAmount)}</Text>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBar, { width: `${(merchant.totalAmount / totalSpending * 100)}%` }]} />
                                    </View>
                                </View>
                            </View>
                        </Card>
                    ))
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.m,
    },
    summaryCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        marginBottom: SPACING.xl,
    },
    summaryLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
        marginVertical: SPACING.s,
    },
    summaryInfo: {
        marginTop: SPACING.m,
    },
    summaryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    merchantCard: {
        padding: SPACING.m,
        marginBottom: SPACING.s,
    },
    merchantRow: {
        alignItems: 'center',
    },
    merchantIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    merchantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    merchantCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    merchantAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    progressBarBg: {
        width: 80,
        height: 4,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
});

export default MerchantStatsScreen;
