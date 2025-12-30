import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { formatCurrency } from '../utils/helpers';
import { LineChart, BarChart } from 'react-native-chart-kit';

const ReportsScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const { transactions } = useExpensesStore();
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const screenWidth = Dimensions.get('window').width - (SPACING.m * 2);

    // Calculate monthly data for the past year
    const monthlyData = React.useMemo(() => {
        const months = [];
        const data = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en', { month: 'short' });

            const monthTransactions = transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
            });

            const total = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0);

            months.push(monthName);
            data.push({
                month: monthName,
                monthKey,
                total,
                count: monthTransactions.length
            });
        }

        return { months, data };
    }, [transactions]);

    // Calculate statistics
    const stats = React.useMemo(() => {
        const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const avgMonthly = totalSpent / 12;
        const avgTransaction = transactions.length > 0 ? totalSpent / transactions.length : 0;
        const highestMonth = monthlyData.data.reduce((max, m) => m.total > max.total ? m : max, { total: 0 });
        const lowestMonth = monthlyData.data.filter(m => m.total > 0).reduce((min, m) => m.total < min.total ? m : min, { total: Infinity });

        return {
            totalSpent,
            avgMonthly,
            avgTransaction,
            highestMonth,
            lowestMonth: lowestMonth.total === Infinity ? { total: 0, month: '-' } : lowestMonth,
            totalTransactions: transactions.length
        };
    }, [transactions, monthlyData]);

    // Chart configuration
    const chartConfig = {
        backgroundColor: COLORS.surface,
        backgroundGradientFrom: COLORS.surface,
        backgroundGradientTo: COLORS.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
    };

    const chartData = {
        labels: monthlyData.months.filter((_, i) => i % 2 === 0),
        datasets: [{ data: monthlyData.data.map(m => m.total || 0) }]
    };

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left', flex: 1 }]}>
                    {t('reports')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {['quarter', 'year'].map(period => (
                        <TouchableOpacity
                            key={period}
                            style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
                            onPress={() => setSelectedPeriod(period)}
                        >
                            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                                {t(period)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Summary Stats */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <Ionicons name="cash-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.statValue}>{formatCurrency(stats.totalSpent)}</Text>
                        <Text style={styles.statLabel}>{t('totalSpent')}</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="calendar-outline" size={24} color="#10B981" />
                        <Text style={styles.statValue}>{formatCurrency(stats.avgMonthly)}</Text>
                        <Text style={styles.statLabel}>{t('avgMonthly')}</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="receipt-outline" size={24} color="#F59E0B" />
                        <Text style={styles.statValue}>{stats.totalTransactions}</Text>
                        <Text style={styles.statLabel}>{t('totalTransactions')}</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="trending-up" size={24} color="#EF4444" />
                        <Text style={styles.statValue}>{formatCurrency(stats.avgTransaction)}</Text>
                        <Text style={styles.statLabel}>{t('avgTransaction')}</Text>
                    </Card>
                </View>

                {/* Monthly Trend Chart */}
                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {t('monthlyTrend')}
                    </Text>
                    {transactions.length > 0 ? (
                        <LineChart
                            data={chartData}
                            width={screenWidth - SPACING.m * 2}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    ) : (
                        <View style={styles.noDataChart}>
                            <Ionicons name="analytics-outline" size={48} color={COLORS.textSecondary} />
                            <Text style={styles.noDataText}>{t('noDataForChart')}</Text>
                        </View>
                    )}
                </Card>

                {/* Highest/Lowest Months */}
                <View style={[styles.highlightRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Card style={[styles.highlightCard, { backgroundColor: '#FEE2E2' }]}>
                        <Ionicons name="trending-up" size={24} color="#EF4444" />
                        <Text style={[styles.highlightLabel, { color: '#EF4444' }]}>{t('highestMonth')}</Text>
                        <Text style={styles.highlightMonth}>{stats.highestMonth.month}</Text>
                        <Text style={[styles.highlightValue, { color: '#EF4444' }]}>
                            {formatCurrency(stats.highestMonth.total)}
                        </Text>
                    </Card>
                    <Card style={[styles.highlightCard, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name="trending-down" size={24} color="#10B981" />
                        <Text style={[styles.highlightLabel, { color: '#10B981' }]}>{t('lowestMonth')}</Text>
                        <Text style={styles.highlightMonth}>{stats.lowestMonth.month}</Text>
                        <Text style={[styles.highlightValue, { color: '#10B981' }]}>
                            {formatCurrency(stats.lowestMonth.total)}
                        </Text>
                    </Card>
                </View>

                {/* Monthly Breakdown */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('monthlyBreakdown')}
                </Text>
                {monthlyData.data.slice().reverse().map((month, index) => (
                    <Card key={month.monthKey} style={styles.monthCard}>
                        <View style={[styles.monthRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={styles.monthInfo}>
                                <Text style={[styles.monthName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                    {month.month}
                                </Text>
                                <Text style={[styles.monthCount, { textAlign: isRTL ? 'right' : 'left' }]}>
                                    {month.count} {t('transactions')}
                                </Text>
                            </View>
                            <Text style={styles.monthTotal}>{formatCurrency(month.total)}</Text>
                        </View>
                    </Card>
                ))}
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
    periodSelector: {
        flexDirection: 'row',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    periodBtn: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    periodBtnActive: {
        backgroundColor: COLORS.primary,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    periodTextActive: {
        color: COLORS.surface,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    statCard: {
        width: '48%',
        alignItems: 'center',
        padding: SPACING.m,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.s,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    chartCard: {
        marginBottom: SPACING.l,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    chart: {
        borderRadius: 16,
        marginLeft: -SPACING.m,
    },
    noDataChart: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noDataText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
    },
    highlightRow: {
        flexDirection: 'row',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    highlightCard: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.m,
    },
    highlightLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: SPACING.s,
    },
    highlightMonth: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 4,
    },
    highlightValue: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    monthCard: {
        marginBottom: SPACING.s,
    },
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    monthInfo: {
        flex: 1,
    },
    monthName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    monthCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    monthTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default ReportsScreen;
