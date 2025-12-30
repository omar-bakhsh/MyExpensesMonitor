import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, FlatList } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useExpensesStore, useTranslation } from '../store';
import { SAUDI_BANKS, getBankName } from '../utils/banks';

const CardCustomizationScreen = ({ navigation }) => {
    const { t, language } = useTranslation();
    const { cards, banks, addCard, updateCard, deleteCard } = useExpensesStore();
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [cardNickname, setCardNickname] = useState('');
    const [lastFourDigits, setLastFourDigits] = useState('');
    const [selectedBankId, setSelectedBankId] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4F46E5');
    const [showBankPicker, setShowBankPicker] = useState(false);

    const PRESET_COLORS = [
        '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16',
        '#1E293B', '#6366F1', '#0891B2', '#059669'
    ];

    const availableBanks = [...SAUDI_BANKS, ...banks.filter(b => b.isCustom)];

    const resetForm = () => {
        setCardNickname('');
        setLastFourDigits('');
        setSelectedBankId('');
        setSelectedColor('#4F46E5');
        setEditingCard(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (card) => {
        setEditingCard(card);
        setCardNickname(card.nickname || '');
        setLastFourDigits(card.lastFourDigits || '');
        setSelectedBankId(card.bankId || '');
        setSelectedColor(card.color || '#4F46E5');
        setShowModal(true);
    };

    const handleSaveCard = () => {
        if (!cardNickname.trim()) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        if (lastFourDigits.length !== 4 || !/^\d{4}$/.test(lastFourDigits)) {
            Alert.alert(t('error'), language === 'ar' ? 'يرجى إدخال آخر 4 أرقام صحيحة' : 'Please enter valid last 4 digits');
            return;
        }

        const cardData = {
            nickname: cardNickname.trim(),
            lastFourDigits: lastFourDigits,
            bankId: selectedBankId,
            color: selectedColor,
        };

        if (editingCard) {
            updateCard(editingCard.id, cardData);
            Alert.alert(t('success'), t('cardUpdated'));
        } else {
            addCard(cardData);
            Alert.alert(t('success'), t('cardAdded'));
        }

        setShowModal(false);
        resetForm();
    };

    const handleDeleteCard = (card) => {
        Alert.alert(
            t('deleteGoal'),
            t('deleteCardConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('deleteGoal'),
                    style: 'destructive',
                    onPress: () => {
                        deleteCard(card.id);
                        Alert.alert(t('success'), t('cardDeleted'));
                    }
                }
            ]
        );
    };

    const getBankForCard = (bankId) => {
        return availableBanks.find(b => b.id === bankId);
    };

    const renderCardItem = (card) => {
        const bank = getBankForCard(card.bankId);
        const bankName = bank ? (language === 'ar' ? bank.nameAr : bank.name) : '';

        return (
            <TouchableOpacity
                key={card.id}
                style={[styles.cardItem, { borderLeftColor: card.color, borderLeftWidth: 4 }]}
                onPress={() => openEditModal(card)}
            >
                <View style={styles.cardContent}>
                    <View style={[styles.cardIcon, { backgroundColor: card.color }]}>
                        <Ionicons name="card" size={24} color="#FFF" />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardNickname}>{card.nickname}</Text>
                        <Text style={styles.cardDetails}>
                            •••• •••• •••• {card.lastFourDigits}
                        </Text>
                        {bankName ? (
                            <Text style={styles.cardBank}>{bankName}</Text>
                        ) : null}
                    </View>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => openEditModal(card)}
                    >
                        <Ionicons name="pencil" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCard(card)}
                    >
                        <Ionicons name="trash" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderBankOption = (bank) => {
        const bankName = language === 'ar' ? bank.nameAr : bank.name;
        const isSelected = selectedBankId === bank.id;

        return (
            <TouchableOpacity
                key={bank.id}
                style={[styles.bankOption, isSelected && styles.bankOptionSelected]}
                onPress={() => {
                    setSelectedBankId(bank.id);
                    setShowBankPicker(false);
                }}
            >
                <View style={[styles.bankLogo, { backgroundColor: bank.color }]}>
                    <Text style={styles.bankLogoText}>
                        {bank.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.bankOptionText}>{bankName}</Text>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('cardManagement')}</Text>
                <TouchableOpacity onPress={openAddModal} style={styles.addHeaderButton}>
                    <Ionicons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Cards Section */}
                {cards.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('myCards')}</Text>
                        <Text style={styles.sectionSubtitle}>
                            {cards.length} {language === 'ar' ? 'بطاقة' : 'cards'}
                        </Text>
                        <View style={styles.cardsContainer}>
                            {cards.map(card => renderCardItem(card))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="card-outline" size={80} color={COLORS.textSecondary} />
                        <Text style={styles.emptyTitle}>{t('noCards')}</Text>
                        <Text style={styles.emptySubtitle}>{t('addFirstCard')}</Text>
                        <TouchableOpacity style={styles.addFirstButton} onPress={openAddModal}>
                            <Ionicons name="add-circle" size={24} color="#FFF" />
                            <Text style={styles.addFirstButtonText}>{t('addCard')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Add Card Button (when cards exist) */}
                {cards.length > 0 && (
                    <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                        <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                        <Text style={styles.addButtonText}>{t('addCard')}</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Add/Edit Card Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingCard ? t('editCard') : t('addCard')}
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Card Preview */}
                            <View style={[styles.cardPreview, { backgroundColor: selectedColor }]}>
                                <View style={styles.cardPreviewChip}>
                                    <View style={styles.chipLines}>
                                        <View style={styles.chipLine} />
                                        <View style={styles.chipLine} />
                                        <View style={styles.chipLine} />
                                    </View>
                                </View>
                                <Text style={styles.cardPreviewNumber}>
                                    •••• •••• •••• {lastFourDigits || '0000'}
                                </Text>
                                <Text style={styles.cardPreviewName}>
                                    {cardNickname || t('cardNickname')}
                                </Text>
                            </View>

                            {/* Card Nickname */}
                            <Text style={styles.inputLabel}>{t('cardNickname')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={language === 'ar' ? 'مثال: بطاقة الراتب' : 'e.g. Salary Card'}
                                value={cardNickname}
                                onChangeText={setCardNickname}
                            />

                            {/* Last 4 Digits */}
                            <Text style={styles.inputLabel}>{t('lastFourDigits')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="1234"
                                value={lastFourDigits}
                                onChangeText={(text) => setLastFourDigits(text.replace(/[^0-9]/g, '').substring(0, 4))}
                                keyboardType="numeric"
                                maxLength={4}
                            />

                            {/* Bank Selection */}
                            <Text style={styles.inputLabel}>{t('selectBank')}</Text>
                            <TouchableOpacity
                                style={styles.bankSelector}
                                onPress={() => setShowBankPicker(true)}
                            >
                                {selectedBankId ? (
                                    <View style={styles.selectedBankDisplay}>
                                        <View style={[styles.bankLogoSmall, { backgroundColor: getBankForCard(selectedBankId)?.color }]}>
                                            <Text style={styles.bankLogoTextSmall}>
                                                {getBankForCard(selectedBankId)?.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text style={styles.selectedBankName}>
                                            {language === 'ar' ? getBankForCard(selectedBankId)?.nameAr : getBankForCard(selectedBankId)?.name}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.placeholderText}>{t('selectBank')}</Text>
                                )}
                                <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            {/* Color Selection */}
                            <Text style={styles.inputLabel}>{t('cardColor')}</Text>
                            <View style={styles.colorPicker}>
                                {PRESET_COLORS.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.colorOptionSelected
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    >
                                        {selectedColor === color && (
                                            <Ionicons name="checkmark" size={20} color="#FFF" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Modal Buttons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveCard}
                            >
                                <Text style={styles.saveButtonText}>{t('save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Bank Picker Modal */}
            <Modal
                visible={showBankPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowBankPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bankPickerContent}>
                        <View style={styles.bankPickerHeader}>
                            <Text style={styles.bankPickerTitle}>{t('selectBank')}</Text>
                            <TouchableOpacity onPress={() => setShowBankPicker(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.bankList}>
                            {availableBanks.map(bank => renderBankOption(bank))}
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
    addHeaderButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: SPACING.m,
    },
    section: {
        marginBottom: SPACING.l,
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
        marginBottom: SPACING.m,
    },
    cardsContainer: {
        gap: SPACING.m,
    },
    cardItem: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...SHADOWS.light,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    cardInfo: {
        flex: 1,
    },
    cardNickname: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    cardDetails: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontFamily: 'monospace',
        marginBottom: 2,
    },
    cardBank: {
        fontSize: 12,
        color: COLORS.primary,
    },
    cardActions: {
        flexDirection: 'row',
        gap: SPACING.s,
    },
    editButton: {
        padding: SPACING.s,
    },
    deleteButton: {
        padding: SPACING.s,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl * 2,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.m,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
        marginBottom: SPACING.l,
    },
    addFirstButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        borderRadius: 12,
        gap: SPACING.s,
    },
    addFirstButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
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
        gap: SPACING.s,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
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
        width: '90%',
        maxWidth: 400,
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
        textAlign: 'center',
    },
    cardPreview: {
        borderRadius: 16,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        height: 180,
        justifyContent: 'space-between',
    },
    cardPreviewChip: {
        width: 45,
        height: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
        justifyContent: 'center',
        padding: 4,
    },
    chipLines: {
        gap: 3,
    },
    chipLine: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 1,
    },
    cardPreviewNumber: {
        fontSize: 18,
        color: '#FFF',
        fontFamily: 'monospace',
        letterSpacing: 2,
    },
    cardPreviewName: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.s,
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
    bankSelector: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedBankDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    bankLogoSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bankLogoTextSmall: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    selectedBankName: {
        fontSize: 16,
        color: COLORS.text,
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    colorPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    bankPickerContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        width: '90%',
        maxWidth: 400,
        maxHeight: '70%',
    },
    bankPickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    bankPickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    bankList: {
        padding: SPACING.m,
    },
    bankOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.s,
        backgroundColor: COLORS.background,
    },
    bankOptionSelected: {
        backgroundColor: '#EEF2FF',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    bankLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    bankLogoText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bankOptionText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
});

export default CardCustomizationScreen;
