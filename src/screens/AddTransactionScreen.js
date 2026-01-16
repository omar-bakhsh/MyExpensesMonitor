import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { useExpensesStore, useTranslation } from '../store';
import { COLORS, FONTS, SPACING, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import CATEGORIES from '../utils/categories';

const AddTransactionScreen = ({ navigation }) => {
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [category, setCategory] = useState('Uncategorized');

    const addTransaction = useExpensesStore((state) => state.addTransaction);
    const { t, isRTL, language } = useTranslation();

    const handleSave = () => {
        if (!amount || !merchant) return;

        const newTransaction = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            merchant,
            date: new Date().toISOString(),
            category,
        };

        addTransaction(newTransaction);
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('addTransactionTitle')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>{t('amount')}</Text>
                    <View style={[styles.amountInputRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={styles.currency}>{t('sar')}</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            autoFocus
                        />
                    </View>
                </View>

                <View style={styles.inputCard}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('merchant')}</Text>
                        <TextInput
                            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                            placeholder={isRTL ? 'أين أنفقت أموالك؟' : 'Where did you spend?'}
                            placeholderTextColor={COLORS.textMuted}
                            value={merchant}
                            onChangeText={setMerchant}
                        />
                    </View>

                    <View style={[styles.divider, { marginVertical: SPACING.l }]} />

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left', marginBottom: SPACING.m }]}>{t('category')}</Text>
                        <View style={styles.categoryGrid}>
                            {CATEGORIES.map((cat) => {
                                const isSelected = category === cat.id;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryItem,
                                            isSelected && { backgroundColor: cat.color + '15', borderColor: cat.color }
                                        ]}
                                        onPress={() => setCategory(cat.id)}
                                    >
                                        <View style={[styles.catIconWrapper, { backgroundColor: isSelected ? cat.color : COLORS.surfaceVariant }]}>
                                            <Ionicons
                                                name={cat.icon}
                                                size={18}
                                                color={isSelected ? COLORS.white : COLORS.textSecondary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.categoryName,
                                            isSelected && { color: cat.color, fontWeight: '700' }
                                        ]}>
                                            {isRTL ? cat.nameAr : cat.nameEn}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.saveBtn, (!amount || !merchant) && styles.saveBtnDisabled]} 
                    onPress={handleSave}
                    disabled={!amount || !merchant}
                >
                    <Text style={styles.saveBtnText}>{t('save')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceVariant,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    form: {
        padding: SPACING.m,
    },
    amountContainer: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    amountLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
    },
    amountInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    currency: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.text,
        minWidth: 100,
    },
    inputCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.l,
        ...SHADOWS.soft,
    },
    inputGroup: {
        gap: SPACING.s,
    },
    label: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        fontSize: 18,
        color: COLORS.text,
        paddingVertical: SPACING.s,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryItem: {
        width: '30%',
        alignItems: 'center',
        padding: SPACING.s,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
        backgroundColor: COLORS.white,
    },
    catIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 11,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: SPACING.xl,
        ...SHADOWS.light,
    },
    saveBtnDisabled: {
        backgroundColor: COLORS.textMuted,
        shadowOpacity: 0,
        elevation: 0,
    },
    saveBtnText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddTransactionScreen;
