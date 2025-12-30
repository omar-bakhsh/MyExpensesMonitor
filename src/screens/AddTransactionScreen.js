import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useExpensesStore, useTranslation } from '../store';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import CATEGORIES from '../utils/categories';

const AddTransactionScreen = ({ navigation }) => {
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [category, setCategory] = useState('Uncategorized');

    const addTransaction = useExpensesStore((state) => state.addTransaction);
    const { t, isRTL } = useTranslation();

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
            <View style={styles.header}>
                <Text style={styles.title}>{t('addTransactionTitle')}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('amount')}</Text>
                    <TextInput
                        style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('merchant')}</Text>
                    <TextInput
                        style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('merchant')}
                        value={merchant}
                        onChangeText={setMerchant}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('category')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.categoryContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryChip,
                                    category === cat.id && { backgroundColor: cat.color }
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                <Ionicons
                                    name={cat.icon}
                                    size={18}
                                    color={category === cat.id ? COLORS.surface : cat.color}
                                />
                                <Text style={[
                                    styles.categoryText,
                                    category === cat.id && styles.categoryTextActive
                                ]}>
                                    {t(cat.id)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
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
        padding: SPACING.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    form: {
        gap: SPACING.l,
    },
    inputGroup: {
        gap: SPACING.s,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryContainer: {
        gap: SPACING.s,
        paddingVertical: SPACING.s,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: SPACING.s,
    },
    categoryText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    categoryTextActive: {
        color: COLORS.surface,
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    saveBtnText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddTransactionScreen;
