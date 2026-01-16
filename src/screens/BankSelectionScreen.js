import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useExpensesStore, useTranslation } from '../store';
import { SAUDI_BANKS } from '../utils/banks';
import Card from '../components/Card';

const BankSelectionScreen = ({ navigation }) => {
    const { t, language, isRTL } = useTranslation();
    const { banks, addBank, deleteBank, updateBank } = useExpensesStore();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBankId, setCurrentBankId] = useState(null);
    const [customBankName, setCustomBankName] = useState('');
    const [customBankColor, setCustomBankColor] = useState('#4F46E5');
    const [smsSenderIds, setSmsSenderIds] = useState('');

    const PRESET_COLORS = [
        '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
    ];

    const isBankSelected = (bankId) => banks.some(b => b.id === bankId);

    const toggleBank = (bank) => {
        if (isBankSelected(bank.id)) {
            confirmDelete(bank.id);
        } else {
            addBank(bank);
        }
    };

    const handleSaveBank = () => {
        if (!customBankName.trim()) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        const senderIdsArray = smsSenderIds.split(',').map(id => id.trim()).filter(id => id !== '');

        if (isEditing && currentBankId) {
            updateBank(currentBankId, {
                name: customBankName,
                nameAr: customBankName,
                color: customBankColor,
                smsSenderIds: senderIdsArray
            });
            Alert.alert(t('success'), language === 'ar' ? 'تم تحديث البنك بنجاح' : 'Bank updated successfully');
        } else {
            const newBank = {
                id: 'custom_' + Date.now(),
                name: customBankName,
                nameAr: customBankName,
                color: customBankColor,
                icon: 'business',
                smsSenderIds: senderIdsArray
            };
            addBank(newBank);
        }
        closeModal();
    };

    const confirmDelete = (bankId) => {
        Alert.alert(
            t('confirmDelete') || (language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'),
            t('confirmDeleteMessage') || (language === 'ar' ? 'هل أنت متأكد من حذف هذا البنك؟' : 'Are you sure you want to delete this bank?'),
            [
                { text: t('cancel'), style: 'cancel' },
                { text: t('delete'), onPress: () => deleteBank(bankId), style: 'destructive' }
            ]
        );
    };

    const openEditModal = (bank) => {
        setIsEditing(true);
        setCurrentBankId(bank.id);
        setCustomBankName(bank.nameAr || bank.name);
        setCustomBankColor(bank.color || '#4F46E5');
        setSmsSenderIds(bank.smsSenderIds ? bank.smsSenderIds.join(', ') : '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCustomBankName('');
        setCustomBankColor('#4F46E5');
        setSmsSenderIds('');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('walletsAndBanks')}</Text>
                <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
                    <Ionicons name="add" size={28} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myBanks')}</Text>
                {banks.length === 0 ? (
                    <Card style={styles.emptyCard} variant="outlined">
                        <Ionicons name="business-outline" size={48} color={COLORS.textMuted} />
                        <Text style={styles.emptyText}>{isRTL ? 'لم تضف أي بنوك بعد' : 'No banks added yet'}</Text>
                        <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setShowModal(true)}>
                            <Text style={styles.emptyAddText}>{t('addCustomBank')}</Text>
                        </TouchableOpacity>
                    </Card>
                ) : (
                    banks.map(bank => (
                        <Card key={bank.id} style={styles.bankCard} variant="elevated">
                            <View style={[styles.bankRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
                                    <Ionicons name="business" size={24} color={bank.color} />
                                </View>
                                <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                    <Text style={[styles.bankName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {language === 'ar' ? (bank.nameAr || bank.name) : bank.name}
                                    </Text>
                                    <Text style={[styles.bankInfo, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {bank.smsSenderIds && bank.smsSenderIds.length > 0 
                                            ? `${isRTL ? 'معرف الرسائل' : 'SMS ID'}: ${bank.smsSenderIds.join(', ')}` 
                                            : isRTL ? 'لا يوجد معرف للرسائل' : 'No SMS ID'}
                                    </Text>
                                </View>
                                <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(bank)}>
                                        <Ionicons name="pencil" size={20} color={COLORS.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(bank.id)}>
                                        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    ))
                )}

                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'بنوك مقترحة' : 'Suggested Banks'}</Text>
                <View style={styles.grid}>
                    {SAUDI_BANKS.filter(b => !isBankSelected(b.id)).map(bank => (
                        <TouchableOpacity 
                            key={bank.id} 
                            style={styles.gridItem}
                            onPress={() => toggleBank(bank)}
                        >
                            <View style={[styles.suggestedIcon, { backgroundColor: bank.color + '10' }]}>
                                <Ionicons name="business-outline" size={28} color={bank.color} />
                            </View>
                            <Text style={styles.suggestedName} numberOfLines={1}>
                                {language === 'ar' ? (bank.nameAr || bank.name) : bank.name}
                            </Text>
                            <View style={styles.suggestedAdd}>
                                <Ionicons name="add" size={16} color={COLORS.primary} />
                                <Text style={styles.suggestedAddText}>{isRTL ? 'إضافة' : 'Add'}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={styles.modalTitle}>{isEditing ? (isRTL ? 'تعديل البنك' : 'Edit Bank') : t('addCustomBank')}</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'اسم البنك' : 'Bank Name'}</Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={customBankName}
                                onChangeText={setCustomBankName}
                                placeholder={isRTL ? 'مثال: مصرف الراجحي' : 'e.g. Al Rajhi Bank'}
                            />

                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'معرفات الرسائل' : 'SMS Sender IDs'}</Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={smsSenderIds}
                                onChangeText={setSmsSenderIds}
                                placeholder="AlRajhi, SNB, ..."
                            />
                            <Text style={[styles.hint, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {isRTL ? 'افصل بين المعرفات بفاصلة (,)' : 'Separate with commas (,)'}
                            </Text>

                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'لون البنك' : 'Bank Color'}</Text>
                            <View style={[styles.colorGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                {PRESET_COLORS.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[styles.colorCircle, { backgroundColor: color }, customBankColor === color && styles.selectedColor]}
                                        onPress={() => setCustomBankColor(color)}
                                    >
                                        {customBankColor === color && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBank}>
                                <Text style={styles.saveBtnText}>{t('save')}</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
        justifyContent: 'space-between',
        alignItems: 'center',
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
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: SPACING.m,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
        marginBottom: SPACING.m,
    },
    emptyCard: {
        alignItems: 'center',
        padding: SPACING.xl,
        gap: SPACING.m,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    emptyAddBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    emptyAddText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    bankCard: {
        padding: SPACING.m,
        marginBottom: SPACING.m,
    },
    bankRow: {
        alignItems: 'center',
    },
    bankIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bankName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    bankInfo: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    actions: {
        gap: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.m,
    },
    gridItem: {
        width: '47%',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SPACING.m,
        alignItems: 'center',
        ...SHADOWS.soft,
    },
    suggestedIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.s,
    },
    suggestedName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    suggestedAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    suggestedAddText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SPACING.l,
        maxHeight: '80%',
    },
    modalHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modalForm: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
        marginTop: SPACING.m,
    },
    input: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    hint: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    colorGrid: {
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: COLORS.text,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: SPACING.m,
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BankSelectionScreen;
