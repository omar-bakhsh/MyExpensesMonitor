import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useExpensesStore, useTranslation } from '../store';
import { useNavigation } from '@react-navigation/native';

const IncomeScreen = () => {
    const { t, isRTL } = useTranslation();
    const { incomeSources: rawIncomeSources, setIncomeSources } = useExpensesStore();
    const incomeSources = rawIncomeSources || [];
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('salary');
    const [note, setNote] = useState('');

    const incomeTypes = [
        { id: 'salary', label: t('salary'), icon: 'cash-outline', color: '#10B981' },
        { id: 'additionalIncome', label: t('additionalIncome'), icon: 'trending-up-outline', color: '#3B82F6' },
        { id: 'bonus', label: t('bonus'), icon: 'gift-outline', color: '#F59E0B' },
        { id: 'debt', label: t('debt'), icon: 'time-outline', color: '#EC4899' },
        { id: 'other', label: t('other'), icon: 'ellipsis-horizontal-outline', color: '#6B7280' },
    ];

    const totalIncome = incomeSources.reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);

    const handleAddOrUpdate = () => {
        if (!amount || isNaN(parseFloat(amount))) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        let updatedSources;
        if (editingId) {
            updatedSources = incomeSources.map(s =>
                s.id === editingId ? { ...s, amount: parseFloat(amount), type, note } : s
            );
        } else {
            updatedSources = [...incomeSources, {
                id: Date.now().toString(),
                amount: parseFloat(amount),
                type,
                note
            }];
        }

        setIncomeSources(updatedSources);
        closeModal();
    };

    const handleDelete = (id) => {
        Alert.alert(
            t('confirmDeleteIncome'),
            '',
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('deleteGoal'), // Reusing delete action text
                    style: 'destructive',
                    onPress: () => {
                        const updatedSources = incomeSources.filter(s => s.id !== id);
                        setIncomeSources(updatedSources);
                    }
                }
            ]
        );
    };

    const openModal = (source = null) => {
        if (source) {
            setEditingId(source.id);
            setAmount(source.amount.toString());
            setType(source.type);
            setNote(source.note || '');
        } else {
            setEditingId(null);
            setAmount('');
            setType('salary');
            setNote('');
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingId(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('income')}</Text>
                <TouchableOpacity onPress={() => openModal()} style={styles.addBtn}>
                    <Ionicons name="add" size={28} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Total Income Card */}
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>{t('totalIncome')}</Text>
                    <Text style={styles.totalAmount}>{totalIncome.toLocaleString()} {t('sar')}</Text>
                </View>

                {/* Income Sources List */}
                <View style={styles.listSection}>
                    <Text style={styles.sectionTitle}>{t('incomeSources')}</Text>
                    {incomeSources.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="card-outline" size={60} color="#CBD5E1" />
                            <Text style={styles.emptyText}>{t('noDataAvailable')}</Text>
                        </View>
                    ) : (
                        incomeSources.map((source) => {
                            const typeInfo = incomeTypes.find(t => t.id === source.type) || incomeTypes[4];
                            return (
                                <TouchableOpacity
                                    key={source.id}
                                    style={styles.sourceItem}
                                    onPress={() => openModal(source)}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '20' }]}>
                                        <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
                                    </View>
                                    <View style={styles.sourceInfo}>
                                        <Text style={styles.sourceName}>{typeInfo.label}</Text>
                                        {source.note ? <Text style={styles.sourceNote}>{source.note}</Text> : null}
                                    </View>
                                    <View style={styles.sourceRight}>
                                        <Text style={styles.sourceAmount}>+{source.amount} {t('sar')}</Text>
                                        <TouchableOpacity onPress={() => handleDelete(source.id)} style={styles.deleteBtn}>
                                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.modalKeyboardAvoid}
                        >
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{editingId ? t('editIncome') : t('addIncomeSource')}</Text>
                                    <TouchableOpacity onPress={closeModal}>
                                        <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>{t('incomeAmount')}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={amount}
                                            onChangeText={setAmount}
                                            keyboardType="numeric"
                                            placeholder="0.00"
                                            placeholderTextColor="#94A3B8"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>{t('incomeType')}</Text>
                                        <View style={styles.typeGrid}>
                                            {incomeTypes.map((iType) => (
                                                <TouchableOpacity
                                                    key={iType.id}
                                                    style={[
                                                        styles.typeItem,
                                                        type === iType.id && styles.typeItemActive
                                                    ]}
                                                    onPress={() => setType(iType.id)}
                                                >
                                                    <Ionicons
                                                        name={iType.icon}
                                                        size={24}
                                                        color={type === iType.id ? '#FFF' : iType.color}
                                                    />
                                                    <Text style={[
                                                        styles.typeLabel,
                                                        type === iType.id && styles.typeLabelActive
                                                    ]}>{iType.label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>{t('note')}</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={note}
                                            onChangeText={setNote}
                                            placeholder={t('note')}
                                            placeholderTextColor="#94A3B8"
                                            multiline
                                            numberOfLines={3}
                                        />
                                    </View>

                                    <TouchableOpacity style={styles.saveBtn} onPress={handleAddOrUpdate}>
                                        <Text style={styles.saveBtnText}>{t('save')}</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
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
        paddingHorizontal: SPACING.m,
        paddingTop: 60,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.surface,
    },
    backBtn: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    addBtn: {
        padding: 5,
    },
    content: {
        padding: SPACING.m,
    },
    totalCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.xl,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: SPACING.xl,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    totalLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: SPACING.s,
    },
    totalAmount: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    listSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    sourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        marginBottom: SPACING.m,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    sourceInfo: {
        flex: 1,
    },
    sourceName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    sourceNote: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sourceRight: {
        alignItems: 'flex-end',
        gap: SPACING.s,
    },
    sourceAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    deleteBtn: {
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: SPACING.m,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalKeyboardAvoid: {
        width: '100%',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: SPACING.l,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputGroup: {
        marginBottom: SPACING.l,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: SPACING.m,
        fontSize: 18,
        color: COLORS.text,
        fontWeight: '600',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    typeItem: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: COLORS.background,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    typeItemActive: {
        backgroundColor: COLORS.primary,
    },
    typeLabel: {
        fontSize: 12,
        marginTop: 4,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    typeLabelActive: {
        color: '#FFF',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: SPACING.m,
        alignItems: 'center',
        marginTop: SPACING.m,
        marginBottom: SPACING.xl,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default IncomeScreen;
