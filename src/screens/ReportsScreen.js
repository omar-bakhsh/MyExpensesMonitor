import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { formatCurrency } from '../utils/helpers';
import { LineChart } from 'react-native-chart-kit';
import { exportToPDF, exportToExcel } from '../services/dataService';
import { Alert } from 'react-native';

const ReportsScreen = ({ navigation }) => {
    const { t, isRTL, language } = useTranslation();
    const rawTransactions = useExpensesStore(state => state.transactions) || [];
    const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const screenWidth = Dimensions.get('window').width;

    // Calculate monthly data for the past year
    const monthlyData = React.useMemo(() => {
        const months = [];
        const data = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' });

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
    }, [transactions, language]);

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

    const handleExportPDF = async () => {
        const result = await exportToPDF(transactions, t('annualSummary'), t('sar'), isRTL);
        if (result.success) {
            Alert.alert(t('success'), result.message);
        } else {
            Alert.alert(t('error'), result.message);
        }
    };

    const handleExportExcel = async () => {
        const result = await exportToExcel(transactions);
        if (result.success) {
            Alert.alert(t('success'), result.message);
        } else {
            Alert.alert(t('error'), result.message);
        }
    };

    // Chart configuration
    const chartConfig = {
        backgroundColor: COLORS.white,
        backgroundGradientFrom: COLORS.white,
        backgroundGradientTo: COLORS.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
        propsForLabels: {
            fontSize: 10,
        }
    };

    const chartData = {
        labels: monthlyData.months.filter((_, i) => i % 2 === 0),
        datasets: [{ data: monthlyData.data.map(m => m.total || 0) }]
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('reports')}</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleExportPDF} style={styles.iconButton}>
                        <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleExportExcel} style={styles.iconButton}>
                        <Ionicons name="grid-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Period Selector */}
                <View style={[styles.periodSelector, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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

                {/* Main Summary Stats */}
                <Card style={styles.mainStatsCard} variant="elevated">
                    <Text style={styles.mainStatsLabel}>{t('totalSpent')}</Text>
                    <Text style={styles.mainStatsValue}>{formatCurrency(stats.totalSpent)}</Text>
                    <View style={styles.mainStatsDivider} />
                    <View style={[styles.statsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('avgMonthly')}</Text>
                            <Text style={styles.statValue}>{formatCurrency(stats.avgMonthly)}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('totalTransactions')}</Text>
                            <Text style={styles.statValue}>{stats.totalTransactions}</Text>
                        </View>
                    </View>
                </Card>

                {/* Monthly Trend Chart */}
                <Card style={styles.chartCard} variant="elevated">
                    <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {t('monthlyTrend')}
                    </Text>
                    {transactions.length > 0 ? (
                        <LineChart
                            data={chartData}
                            width={screenWidth - SPACING.m * 4}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                            withInnerLines={false}
                            withOuterLines={false}
                        />
                    ) : (
                        <View style={styles.noDataChart}>
                            <Ionicons name="analytics-outline" size={48} color={COLORS.textMuted} />
                            <Text style={styles.noDataText}>{t('noDataForChart')}</Text>
                        </View>
                    )}
                </Card>

                {/* Highlights */}
                <View style={[styles.highlightRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Card style={[styles.highlightCard, { borderLeftColor: COLORS.error, borderLeftWidth: 4 }]} variant="outlined">
                        <Ionicons name="trending-up" size={24} color={COLORS.error} />
                        <Text style={styles.highlightLabel}>{t('highestMonth')}</Text>
                        <Text style={styles.highlightMonth}>{stats.highestMonth.month}</Text>
                        <Text style={[styles.highlightValue, { color: COLORS.error }]}>
                            {formatCurrency(stats.highestMonth.total)}
                        </Text>
                    </Card>
                    <Card style={[styles.highlightCard, { borderLeftColor: COLORS.success, borderLeftWidth: 4 }]} variant="outlined">
                        <Ionicons name="trending-down" size={24} color={COLORS.success} />
                        <Text style={styles.highlightLabel}>{t('lowestMonth')}</Text>
                        <Text style={styles.highlightMonth}>{stats.lowestMonth.month}</Text>
                        <Text style={[styles.highlightValue, { color: COLORS.success }]}>
                            {formatCurrency(stats.lowestMonth.total)}
                        </Text>
                    </Card>
                </View>

                {/* Monthly Breakdown List */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginTop: SPACING.l }]}>
                    {t('monthlyBreakdown')}
                </Text>
                {monthlyData.data.slice().reverse().map((month, index) => (
                    month.total > 0 && (
                        <Card key={month.monthKey} style={styles.monthCard} variant="outlined">
                            <View style={[styles.monthRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <View style={[styles.monthAvatar, { backgroundColor: COLORS.primary + '10' }]}>
                                    <Text style={styles.monthAvatarText}>{month.month.substring(0, 3)}</Text>
                                </View>
                                <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
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
                    )
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
        ...SHADOWS.soft,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 22,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    headerActions: {
        flexDirection: 'row',
        gap: SPACING.s,
    },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary + '10',
        borderRadius: 12,
    },
    content: {
        padding: SPACING.m,
    },
    periodSelector: {
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    periodBtn: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        minWidth: 80,
        alignItems: 'center',
    },
    periodBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    periodTextActive: {
        color: COLORS.white,
    },
    mainStatsCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        alignItems: 'center',
    },
    mainStatsLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mainStatsValue: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: SPACING.s,
    },
    mainStatsDivider: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: SPACING.m,
    },
    statsGrid: {
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    verticalDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    chartCard: {
        marginTop: SPACING.m,
        paddingHorizontal: SPACING.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    chart: {
        borderRadius: 16,
        marginVertical: 8,
        marginLeft: -16,
    },
    noDataChart: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noDataText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: SPACING.s,
    },
    highlightRow: {
        gap: SPACING.m,
        marginTop: SPACING.m,
    },
    highlightCard: {
        flex: 1,
        padding: SPACING.m,
        alignItems: 'flex-start',
    },
    highlightLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
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
        fontWeight: 'bold',
        marginTop: 4,
    },
    monthCard: {
        marginBottom: SPACING.s,
        padding: SPACING.m,
    },
    monthAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthAvatarText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    monthRow: {
        alignItems: 'center',
    },
    monthName: {
        fontSize: 16,
        fontWeight: 'bold',
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
        color: COLORS.text,
    },
});

export default ReportsScreen;
