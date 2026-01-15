import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import CATEGORIES from '../utils/categories';
import { formatCurrency } from '../utils/helpers';

const CategoryBudgetScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const { budgetAlerts, updateBudgetAlert, transactions } = useExpensesStore();
    const [editingCategory, setEditingCategory] = useState(null);
    const [tempLimit, setTempLimit] = useState('');

    // Calculate spending per category
    const categorySpending = React.useMemo(() => {
        const spending = {};
        const safeTransactions = transactions || [];
        safeTransactions.forEach(tx => {
            const cat = tx.category || 'Uncategorized';
            spending[cat] = (spending[cat] || 0) + (tx.amount || 0);
        });
        return spending;
    }, [transactions]);

    const handleSaveLimit = (categoryId) => {
        const limit = parseFloat(tempLimit);
        if (isNaN(limit) || limit <= 0) {
            Alert.alert(t('error'), t('enterValidAmount'));
            return;
        }

        updateBudgetAlert('category', categoryId, {
            enabled: true,
            limit: limit,
            thresholds: [50, 75, 90, 100]
        });
        setEditingCategory(null);
        setTempLimit('');
    };

    const toggleCategoryAlert = (categoryId, enabled) => {
        const currentSettings = budgetAlerts?.categories?.[categoryId] || { limit: 1000, thresholds: [50, 75, 90, 100] };
        updateBudgetAlert('category', categoryId, { ...currentSettings, enabled });
    };

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left', flex: 1 }]}>
                    {t('categoryBudgets')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* General Budget Alert */}
                <Card style={styles.generalCard}>
                    <View style={[styles.generalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.generalIcon}>
                            <Ionicons name="wallet" size={24} color={COLORS.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.generalTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('generalBudget')}
                            </Text>
                            <Text style={[styles.generalLimit, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {formatCurrency(budgetAlerts?.general?.limit || 0)}
                            </Text>
                        </View>
                        <Switch
                            value={budgetAlerts?.general?.enabled || false}
                            onValueChange={(enabled) => updateBudgetAlert('general', null, { enabled })}
                            trackColor={{ false: '#E5E7EB', true: COLORS.primary + '80' }}
                            thumbColor={budgetAlerts?.general?.enabled ? COLORS.primary : '#f4f3f4'}
                        />
                    </View>
                </Card>

                {/* Category Budgets */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('categoryBudgets')}
                </Text>

                {CATEGORIES.map(category => {
                    const settings = budgetAlerts?.categories?.[category.id] || { enabled: false, limit: 0 };
                    const spent = categorySpending[category.id] || 0;
                    const percentage = settings.limit > 0 ? (spent / settings.limit) * 100 : 0;
                    const isEditing = editingCategory === category.id;

                    return (
                        <Card key={category.id} style={styles.categoryCard}>
                            <View style={[styles.categoryHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                                    <Ionicons name={category.icon} size={20} color={category.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.categoryName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {t(category.id)}
                                    </Text>
                                    <Text style={[styles.categorySpent, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {t('spent')}: {formatCurrency(spent)}
                                    </Text>
                                </View>
                                <Switch
                                    value={settings.enabled}
                                    onValueChange={(enabled) => toggleCategoryAlert(category.id, enabled)}
                                    trackColor={{ false: '#E5E7EB', true: category.color + '80' }}
                                    thumbColor={settings.enabled ? category.color : '#f4f3f4'}
                                />
                            </View>

                            {settings.enabled && (
                                <View style={styles.budgetSection}>
                                    {isEditing ? (
                                        <View style={[styles.editRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TextInput
                                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                                value={tempLimit}
                                                onChangeText={setTempLimit}
                                                keyboardType="numeric"
                                                placeholder={t('enterLimit')}
                                                autoFocus
                                            />
                                            <TouchableOpacity
                                                style={[styles.saveBtn, { backgroundColor: category.color }]}
                                                onPress={() => handleSaveLimit(category.id)}
                                            >
                                                <Ionicons name="checkmark" size={20} color={COLORS.surface} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.cancelBtn}
                                                onPress={() => { setEditingCategory(null); setTempLimit(''); }}
                                            >
                                                <Ionicons name="close" size={20} color={COLORS.error} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={[styles.limitRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                <Text style={styles.limitLabel}>{t('budgetLimit')}:</Text>
                                                <Text style={styles.limitValue}>
                                                    {settings.limit > 0 ? formatCurrency(settings.limit) : t('notSet')}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => { setEditingCategory(category.id); setTempLimit(settings.limit?.toString() || ''); }}
                                                >
                                                    <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                                                </TouchableOpacity>
                                            </View>

                                            {settings.limit > 0 && (
                                                <>
                                                    <View style={styles.progressContainer}>
                                                        <View
                                                            style={[
                                                                styles.progressBar,
                                                                {
                                                                    width: `${Math.min(percentage, 100)}%`,
                                                                    backgroundColor: percentage >= 90 ? COLORS.error :
                                                                        percentage >= 75 ? '#F59E0B' : category.color
                                                                }
                                                            ]}
                                                        />
                                                    </View>
                                                    <Text style={[styles.percentageText, {
                                                        color: percentage >= 90 ? COLORS.error :
                                                            percentage >= 75 ? '#F59E0B' : COLORS.textSecondary,
                                                        textAlign: isRTL ? 'right' : 'left'
                                                    }]}>
                                                        {percentage.toFixed(0)}% {t('used')}
                                                    </Text>
                                                </>
                                            )}
                                        </>
                                    )}
                                </View>
                            )}
                        </Card>
                    );
                })}
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
    generalCard: {
        marginBottom: SPACING.l,
        backgroundColor: COLORS.primary + '10',
        borderWidth: 1,
        borderColor: COLORS.primary + '30',
    },
    generalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    generalIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    generalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    generalLimit: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    categoryCard: {
        marginBottom: SPACING.s,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    categorySpent: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    budgetSection: {
        marginTop: SPACING.m,
        paddingTop: SPACING.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    limitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    limitLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    limitValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: SPACING.s,
        borderRadius: 8,
        fontSize: 16,
    },
    saveBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginTop: SPACING.s,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    percentageText: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default CategoryBudgetScreen;
