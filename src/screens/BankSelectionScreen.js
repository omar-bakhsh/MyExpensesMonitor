import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useExpensesStore, useTranslation } from '../store';
import { SAUDI_BANKS, getBankName } from '../utils/banks';

const BankSelectionScreen = ({ navigation }) => {
    const { t, language } = useTranslation();
    const { banks, addBank, deleteBank } = useExpensesStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [customBankName, setCustomBankName] = useState('');
    const [customBankColor, setCustomBankColor] = useState('#4F46E5');

    const PRESET_COLORS = [
        '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
    ];

    const isBankSelected = (bankId) => {
        return banks.some(b => b.id === bankId);
    };

    const toggleBank = (bank) => {
        if (isBankSelected(bank.id)) {
            deleteBank(bank.id);
        } else {
            addBank(bank);
        }
    };

    const handleAddCustomBank = () => {
        if (!customBankName.trim()) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        const customBank = {
            id: `custom_${Date.now()}`,
            name: customBankName,
            nameAr: customBankName,
            color: customBankColor,
            type: 'bank',
            isCustom: true
        };

        addBank(customBank);
        setShowAddModal(false);
        setCustomBankName('');
        setCustomBankColor('#4F46E5');
        Alert.alert(t('success'), t('bankAdded'));
    };

    const renderBankItem = (bank) => {
        const isSelected = isBankSelected(bank.id);
        const bankName = language === 'ar' ? bank.nameAr : bank.name;

        // Get initials for bank logo
        const initials = bank.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();

        return (
            <TouchableOpacity
                key={bank.id}
                style={[styles.bankItem, isSelected && styles.bankItemSelected]}
                onPress={() => toggleBank(bank)}
            >
                <View style={styles.bankLeft}>
                    <View style={[styles.bankLogo, { backgroundColor: bank.color }]}>
                        <Text style={styles.bankLogoText}>{initials}</Text>
                    </View>
                    <View style={styles.bankInfo}>
                        <Text style={styles.bankName}>{bankName}</Text>
                        <Text style={styles.bankType}>
                            {bank.type === 'bank' ? 'Bank' : bank.type === 'wallet' ? 'Wallet' : 'Cash'}
                        </Text>
                    </View>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                )}
            </TouchableOpacity>
        );
    };

    const customBanks = banks.filter(b => b.isCustom);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('bankSelection')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* My Banks Section */}
                {banks.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('myBanks')}</Text>
                        <Text style={styles.sectionSubtitle}>
                            {banks.length} {language === 'ar' ? 'بنك محدد' : 'banks selected'}
                        </Text>
                    </View>
                )}

                {/* Available Banks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('availableBanks')}</Text>
                    <Text style={styles.sectionSubtitle}>{t('selectBanks')}</Text>
                </View>

                {SAUDI_BANKS.map(bank => renderBankItem(bank))}

                {/* Custom Banks */}
                {customBanks.length > 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('addCustomBank')}</Text>
                        </View>
                        {customBanks.map(bank => renderBankItem(bank))}
                    </>
                )}

                {/* Add Custom Bank Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddModal(true)}
                >
                    <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                    <Text style={styles.addButtonText}>{t('addCustomBank')}</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Add Custom Bank Modal */}
            <Modal
                visible={showAddModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('addCustomBank')}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t('customBankName')}
                            value={customBankName}
                            onChangeText={setCustomBankName}
                        />

                        <Text style={styles.colorLabel}>{t('customBankColor')}</Text>
                        <View style={styles.colorPicker}>
                            {PRESET_COLORS.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        customBankColor === color && styles.colorOptionSelected
                                    ]}
                                    onPress={() => setCustomBankColor(color)}
                                >
                                    {customBankColor === color && (
                                        <Ionicons name="checkmark" size={20} color="#FFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowAddModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddCustomBank}
                            >
                                <Text style={styles.saveButtonText}>{t('save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        justifyContent: 'space-between',
        padding: SPACING.m,
        paddingTop: 50,
        backgroundColor: COLORS.surface,
        ...SHADOWS.light,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        flex: 1,
        padding: SPACING.m,
    },
    section: {
        marginBottom: SPACING.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.s,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    bankItemSelected: {
        borderColor: COLORS.success,
        backgroundColor: '#F0FDF4',
    },
    bankLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bankLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    bankLogoText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bankInfo: {
        flex: 1,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    bankType: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        marginTop: SPACING.m,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: SPACING.s,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.l,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.l,
        textAlign: 'center',
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: SPACING.m,
        fontSize: 16,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    colorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    colorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: COLORS.text,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    modalButton: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.background,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BankSelectionScreen;
