import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useExpensesStore, useTranslation } from '../store';
import { SAUDI_BANKS } from '../utils/banks';
import Card from '../components/Card';

const CardCustomizationScreen = ({ navigation }) => {
    const { t, language, isRTL } = useTranslation();
    const { cards, banks, addCard, updateCard, deleteCard } = useExpensesStore();
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [cardNickname, setCardNickname] = useState('');
    const [lastFourDigits, setLastFourDigits] = useState('');
    const [selectedBankId, setSelectedBankId] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4F46E5');
    const [showBankPicker, setShowBankPicker] = useState(false);

    const PRESET_COLORS = [
        '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16',
        '#1E293B'
    ];

    const availableBanks = [...SAUDI_BANKS, ...banks];

    const resetForm = () => {
        setCardNickname('');
        setLastFourDigits('');
        setSelectedBankId('');
        setEditingCard(null);
    };

    const handleSaveCard = () => {
        if (!cardNickname.trim()) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        if (lastFourDigits.length !== 4) {
            Alert.alert(t('error'), isRTL ? 'يرجى إدخال 4 أرقام' : 'Please enter 4 digits');
            return;
        }

        const cardData = {
            nickname: cardNickname.trim(),
            lastFourDigits,
            bankId: selectedBankId,
            color: selectedColor,
        };

        if (editingCard) {
            updateCard(editingCard.id, cardData);
        } else {
            addCard(cardData);
        }

        setShowModal(false);
        resetForm();
    };

    const getBank = (id) => availableBanks.find(b => b.id === id);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('cardManagement')}</Text>
                <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
                    <Ionicons name="add" size={28} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {cards.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="card-outline" size={80} color={COLORS.textMuted} />
                        <Text style={styles.emptyTitle}>{t('noCards')}</Text>
                        <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setShowModal(true)}>
                            <Text style={styles.emptyAddText}>{t('addCard')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    cards.map(card => {
                        const bank = getBank(card.bankId);
                        return (
                            <TouchableOpacity 
                                key={card.id} 
                                style={[styles.cardItem, { backgroundColor: card.color }]}
                                onPress={() => {
                                    setEditingCard(card);
                                    setCardNickname(card.nickname);
                                    setLastFourDigits(card.lastFourDigits);
                                    setSelectedBankId(card.bankId);
                                    setSelectedColor(card.color);
                                    setShowModal(true);
                                }}
                            >
                                <View style={styles.cardHeader}>
                                    <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
                                    <Text style={styles.cardBankName}>{language === 'ar' ? bank?.nameAr : bank?.name}</Text>
                                </View>
                                
                                <View style={styles.cardChip}>
                                    <View style={styles.chipGlow} />
                                </View>

                                <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFourDigits}</Text>
                                
                                <View style={styles.cardFooter}>
                                    <View>
                                        <Text style={styles.cardHolderLabel}>{t('cardNickname')}</Text>
                                        <Text style={styles.cardHolderName}>{card.nickname}</Text>
                                    </View>
                                    <Ionicons name="card" size={32} color="rgba(255,255,255,0.3)" />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={styles.modalTitle}>{editingCard ? (isRTL ? 'تعديل البطاقة' : 'Edit Card') : (isRTL ? 'إضافة بطاقة جديدة' : 'Add New Card')}</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('cardNickname')}</Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={cardNickname}
                                onChangeText={setCardNickname}
                                placeholder={isRTL ? 'مثال: بطاقة الراتب' : 'e.g. Salary Card'}
                            />

                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'آخر 4 أرقام' : 'Last 4 Digits'}</Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={lastFourDigits}
                                onChangeText={t => setLastFourDigits(t.replace(/[^0-9]/g, '').slice(0, 4))}
                                keyboardType="numeric"
                                placeholder="1234"
                                maxLength={4}
                            />

                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('selectBank')}</Text>
                            <View style={styles.bankGrid}>
                                {availableBanks.map(bank => (
                                    <TouchableOpacity 
                                        key={bank.id} 
                                        style={[styles.bankChip, selectedBankId === bank.id && styles.selectedBankChip]}
                                        onPress={() => setSelectedBankId(bank.id)}
                                    >
                                        <Text style={[styles.bankChipText, selectedBankId === bank.id && styles.selectedBankChipText]}>
                                            {language === 'ar' ? (bank.nameAr || bank.name) : bank.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'لون البطاقة' : 'Card Color'}</Text>
                            <View style={[styles.colorGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                {PRESET_COLORS.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCard}>
                                <Text style={styles.saveBtnText}>{t('save')}</Text>
                            </TouchableOpacity>

                            {editingCard && (
                                <TouchableOpacity 
                                    style={styles.deleteBtn} 
                                    onPress={() => {
                                        Alert.alert(t('confirmDelete'), t('deleteCardConfirm'), [
                                            { text: t('cancel'), style: 'cancel' },
                                            { text: t('delete'), style: 'destructive', onPress: () => {
                                                deleteCard(editingCard.id);
                                                setShowModal(false);
                                                resetForm();
                                            }}
                                        ]);
                                    }}
                                >
                                    <Text style={styles.deleteBtnText}>{t('delete')}</Text>
                                </TouchableOpacity>
                            )}
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.m,
    },
    emptyAddBtn: {
        marginTop: SPACING.m,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    emptyAddText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    cardItem: {
        height: 200,
        borderRadius: 24,
        padding: 24,
        marginBottom: SPACING.m,
        justifyContent: 'space-between',
        ...SHADOWS.medium,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBankName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        opacity: 0.9,
    },
    cardChip: {
        width: 48,
        height: 38,
        backgroundColor: '#FFD700',
        borderRadius: 8,
        overflow: 'hidden',
    },
    chipGlow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.2)',
        transform: [{ skewX: '-20deg' }, { translateX: -10 }],
    },
    cardNumber: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: 'monospace',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardHolderLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    cardHolderName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
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
        maxHeight: '90%',
    },
    modalHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
    bankGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    bankChip: {
        backgroundColor: COLORS.surfaceVariant,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectedBankChip: {
        backgroundColor: COLORS.primary,
    },
    bankChipText: {
        fontSize: 12,
        color: COLORS.text,
    },
    selectedBankChipText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    selectedColor: {
        borderWidth: 3,
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
    deleteBtn: {
        padding: SPACING.m,
        alignItems: 'center',
        marginTop: SPACING.s,
    },
    deleteBtnText: {
        color: COLORS.error,
        fontWeight: 'bold',
    },
});

export default CardCustomizationScreen;
