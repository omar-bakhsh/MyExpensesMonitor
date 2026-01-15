import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SPACING } from '../utils/theme';
import { useTranslation } from '../store';

const ExpenseChart = ({ transactions }) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState('7D'); // 7D, 1M, 3M, 6M

    const getChartData = () => {
        const safeTransactions = transactions || [];
        const now = new Date();
        let days = 7;
        let groupBy = 'day';

        switch (timeRange) {
            case '7D':
                days = 7;
                groupBy = 'day';
                break;
            case '1M':
                days = 30;
                groupBy = 'day';
                break;
            case '3M':
                days = 90;
                groupBy = 'week';
                break;
            case '6M':
                days = 180;
                groupBy = 'month';
                break;
        }

        if (groupBy === 'day') {
            const dateRange = Array.from({ length: days }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (days - 1 - i));
                return date.toISOString().split('T')[0];
            });

            const dailyTotals = dateRange.map(day => {
                const dayTransactions = safeTransactions.filter(t =>
                    t.date && t.date.split('T')[0] === day
                );
                return dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
            });

            const labels = dateRange.map(day => {
                const date = new Date(day);
                if (timeRange === '7D') {
                    return date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 3);
                }
                return `${date.getDate()}/${date.getMonth() + 1}`;
            });

            return {
                labels: timeRange === '1M' ? labels.filter((_, i) => i % 5 === 0) : labels,
                data: timeRange === '1M' ? dailyTotals.filter((_, i) => i % 5 === 0) : dailyTotals
            };
        } else if (groupBy === 'month') {
            const months = [];
            const monthlyTotals = [];

            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                months.push(date.toLocaleDateString('en', { month: 'short' }));

                const monthTransactions = safeTransactions.filter(t => {
                    const txDate = t.date ? new Date(t.date) : new Date();
                    return `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
                });
                monthlyTotals.push(monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0));
            }

            return { labels: months, data: monthlyTotals };
        }

        return { labels: [], data: [] };
    };

    const { labels, data } = getChartData();
    const chartData = {
        labels,
        datasets: [{
            data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0],
        }]
    };

    const screenWidth = Dimensions.get('window').width - (SPACING.m * 2);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('spendingTrend')}</Text>
                <View style={styles.rangeSelector}>
                    {['7D', '1M', '3M', '6M'].map((range) => (
                        <TouchableOpacity
                            key={range}
                            style={[styles.rangeBtn, timeRange === range && styles.rangeBtnActive]}
                            onPress={() => setTimeRange(range)}
                        >
                            <Text style={[styles.rangeText, timeRange === range && styles.rangeTextActive]}>
                                {range}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <LineChart
                data={chartData}
                width={screenWidth}
                height={200}
                chartConfig={{
                    backgroundColor: COLORS.surface,
                    backgroundGradientFrom: COLORS.surface,
                    backgroundGradientTo: COLORS.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: COLORS.primary,
                    },
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    rangeSelector: {
        flexDirection: 'row',
        gap: 4,
    },
    rangeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    rangeBtnActive: {
        backgroundColor: COLORS.primary,
    },
    rangeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    rangeTextActive: {
        color: COLORS.surface,
    },
    chart: {
        borderRadius: 16,
    },
});

export default ExpenseChart;
