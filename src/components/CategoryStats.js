import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { COLORS, SPACING } from '../utils/theme';
import { getCategoryById } from '../utils/categories';
import { useTranslation } from '../store';

const CategoryStats = ({ transactions }) => {
    const { t } = useTranslation();

    // Group transactions by category
    const categoryTotals = (transactions || []).reduce((acc, tx) => {
        const category = tx.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + (tx.amount || 0);
        return acc;
    }, {});

    // Convert to array and sort by amount
    const categoryData = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            category,
            amount,
            ...getCategoryById(category)
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6); // Top 6 categories

    if (categoryData.length === 0) {
        return null;
    }

    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

    // Prepare data for pie chart
    const chartData = categoryData.map((item) => ({
        name: t(item.category),
        amount: item.amount,
        color: item.color,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
    }));

    const screenWidth = Dimensions.get('window').width - (SPACING.m * 2);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('categoryStatistics')}</Text>
            <PieChart
                data={chartData}
                width={screenWidth}
                height={200}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
            <View style={styles.statsContainer}>
                {categoryData.map((item, index) => {
                    const percentage = ((item.amount / total) * 100).toFixed(1);
                    return (
                        <View key={item.category} style={styles.statRow}>
                            <View style={styles.statLeft}>
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                <Text style={styles.statCategory}>{t(item.category)}</Text>
                            </View>
                            <Text style={styles.statPercentage}>{percentage}%</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.m,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    statsContainer: {
        marginTop: SPACING.m,
        gap: SPACING.s,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statCategory: {
        fontSize: 14,
        color: COLORS.text,
    },
    statPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default CategoryStats;
