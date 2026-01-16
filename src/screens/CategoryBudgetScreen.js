import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
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
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('categoryBudgets')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* General Budget Alert */}
                <Card style={styles.generalCard} variant="elevated">
                    <View style={[styles.generalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.generalIcon}>
                            <Ionicons name="sparkles" size={24} color={COLORS.white} />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                            <Text style={[styles.generalLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('generalBudget')}
                            </Text>
                            <Text style={[styles.generalLimit, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {formatCurrency(budgetAlerts?.general?.limit || 0)}
                            </Text>
                        </View>
                        <Switch
                            value={budgetAlerts?.general?.enabled || false}
                            onValueChange={(enabled) => updateBudgetAlert('general', null, { enabled })}
                            trackColor={{ false: COLORS.surfaceVariant, true: COLORS.white + '40' }}
                            thumbColor={COLORS.white}
                        />
                    </View>
                </Card>

                {/* Section Title */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('categoryBudgets')}
                </Text>

                {/* Category Budgets */}
                {CATEGORIES.map(category => {
                    const settings = budgetAlerts?.categories?.[category.id] || { enabled: false, limit: 0 };
                    const spent = categorySpending[category.id] || 0;
                    const percentage = settings.limit > 0 ? (spent / settings.limit) * 100 : 0;
                    const isEditing = editingCategory === category.id;

                    return (
                        <Card key={category.id} style={styles.categoryCard} variant="outlined">
                            <View style={[styles.categoryHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <View style={[styles.categoryIconWrapper, { backgroundColor: category.color + '15' }]}>
                                    <Ionicons name={category.icon} size={20} color={category.color} />
                                </View>
                                <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                    <Text style={[styles.categoryName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {t(category.id)}
                                    </Text>
                                    <Text style={[styles.categorySpent, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {formatCurrency(spent)} {t('spent')}
                                    </Text>
                                </View>
                                <Switch
                                    value={settings.enabled}
                                    onValueChange={(enabled) => toggleCategoryAlert(category.id, enabled)}
                                    trackColor={{ false: COLORS.surfaceVariant, true: category.color + '40' }}
                                    thumbColor={settings.enabled ? category.color : COLORS.white}
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
                                                placeholderTextColor={COLORS.textMuted}
                                                autoFocus
                                            />
                                            <TouchableOpacity
                                                style={[styles.saveIconBtn, { backgroundColor: category.color }]}
                                                onPress={() => handleSaveLimit(category.id)}
                                            >
                                                <Ionicons name="checkmark" size={20} color={COLORS.white} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.cancelIconBtn}
                                                onPress={() => { setEditingCategory(null); setTempLimit(''); }}
                                            >
                                                <Ionicons name="close" size={20} color={COLORS.error} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.budgetDisplay}>
                                            <View style={[styles.limitRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
                                                    <Text style={styles.limitLabel}>{t('budgetLimit')}:</Text>
                                                    <Text style={styles.limitValue}>
                                                        {settings.limit > 0 ? formatCurrency(settings.limit) : t('notSet')}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.editBtn}
                                                    onPress={() => { setEditingCategory(category.id); setTempLimit(settings.limit?.toString() || ''); }}
                                                >
                                                    <Ionicons name="pencil" size={14} color={COLORS.primary} />
                                                    <Text style={styles.editBtnText}>{t('edit')}</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {settings.limit > 0 && (
                                                <View style={styles.progressSection}>
                                                    <View style={styles.progressContainer}>
                                                        <View
                                                            style={[
                                                                styles.progressBar,
                                                                {
                                                                    width: `${Math.min(percentage, 100)}%`,
                                                                    backgroundColor: percentage >= 90 ? COLORS.error :
                                                                        percentage >= 75 ? COLORS.warning : category.color
                                                                }
                                                            ]}
                                                        />
                                                    </View>
                                                    <View style={[styles.progressLabels, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                        <Text style={[styles.percentageText, {
                                                            color: percentage >= 90 ? COLORS.error :
                                                                percentage >= 75 ? COLORS.warning : COLORS.primary,
                                                        }]}>
                                                            {percentage.toFixed(0)}% {t('used')}
                                                        </Text>
                                                        <Text style={styles.remainingText}>
                                                            {formatCurrency(Math.max(0, settings.limit - spent))} {isRTL ? 'متبقي' : 'left'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
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
    generalCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        marginBottom: SPACING.xl,
    },
    generalHeader: {
        alignItems: 'center',
    },
    generalIcon: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    generalLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    generalLimit: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    categoryCard: {
        padding: SPACING.m,
        marginBottom: SPACING.s,
    },
    categoryHeader: {
        alignItems: 'center',
    },
    categoryIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    categorySpent: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    budgetSection: {
        marginTop: SPACING.m,
        paddingTop: SPACING.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    budgetDisplay: {
        gap: SPACING.m,
    },
    limitRow: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    limitLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    limitValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    editBtnText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    editRow: {
        alignItems: 'center',
        gap: SPACING.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
    },
    saveIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.error + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressSection: {
        gap: 8,
    },
    progressContainer: {
        height: 8,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabels: {
        justifyContent: 'space-between',
    },
    percentageText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    remainingText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
});

export default CategoryBudgetScreen;
