import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useExpensesStore, useTranslation } from '../store';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';

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
                    text: t('delete'),
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
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('income')}</Text>
                <TouchableOpacity onPress={() => openModal()} style={styles.addBtn}>
                    <Ionicons name="add" size={28} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Total Income Card */}
                <Card style={styles.totalCard} variant="elevated">
                    <Text style={styles.totalLabel}>{t('totalIncome')}</Text>
                    <Text style={styles.totalAmount}>{totalIncome.toLocaleString()} {t('sar')}</Text>
                </Card>

                {/* Income Sources List */}
                <View style={styles.listSection}>
                    <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('incomeSources')}</Text>
                    {incomeSources.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconWrapper}>
                                <Ionicons name="card-outline" size={64} color={COLORS.primary + '20'} />
                            </View>
                            <Text style={styles.emptyText}>{t('noDataAvailable')}</Text>
                        </View>
                    ) : (
                        incomeSources.map((source) => {
                            const typeInfo = incomeTypes.find(t => t.id === source.type) || incomeTypes[4];
                            return (
                                <TouchableOpacity
                                    key={source.id}
                                    activeOpacity={0.7}
                                    onPress={() => openModal(source)}
                                >
                                    <Card style={styles.sourceItem} variant="outlined">
                                        <View style={[styles.sourceItemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '15' }]}>
                                                <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                                <Text style={[styles.sourceName, { textAlign: isRTL ? 'right' : 'left' }]}>{typeInfo.label}</Text>
                                                {source.note ? <Text style={[styles.sourceNote, { textAlign: isRTL ? 'right' : 'left' }]}>{source.note}</Text> : null}
                                            </View>
                                            <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                                                <Text style={styles.sourceAmount}>+{source.amount} {t('sar')}</Text>
                                                <TouchableOpacity onPress={() => handleDelete(source.id)} style={styles.deleteBtn}>
                                                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Card>
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
                        <View style={styles.modalContent}>
                            <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <TouchableOpacity onPress={closeModal} style={styles.modalCloseBtn}>
                                    <Ionicons name="close" size={24} color={COLORS.text} />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>{editingId ? t('editIncome') : t('addIncomeSource')}</Text>
                                <View style={{ width: 44 }} />
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} style={{ padding: SPACING.m }}>
                                <View style={styles.inputCard}>
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('incomeAmount')}</Text>
                                        <TextInput
                                            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                            value={amount}
                                            onChangeText={setAmount}
                                            keyboardType="numeric"
                                            placeholder="0.00"
                                            placeholderTextColor={COLORS.textMuted}
                                            autoFocus
                                        />
                                    </View>

                                    <View style={[styles.divider, { marginVertical: SPACING.l }]} />

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left', marginBottom: SPACING.m }]}>
                                            {t('incomeType')}
                                        </Text>
                                        <View style={styles.typeGrid}>
                                            {incomeTypes.map((iType) => {
                                                const isSelected = type === iType.id;
                                                return (
                                                    <TouchableOpacity
                                                        key={iType.id}
                                                        style={[
                                                            styles.typeItem,
                                                            isSelected && { backgroundColor: iType.color + '15', borderColor: iType.color }
                                                        ]}
                                                        onPress={() => setType(iType.id)}
                                                    >
                                                        <View style={[styles.catIconWrapper, { backgroundColor: isSelected ? iType.color : COLORS.surfaceVariant }]}>
                                                            <Ionicons
                                                                name={iType.icon}
                                                                size={20}
                                                                color={isSelected ? COLORS.white : COLORS.textSecondary}
                                                            />
                                                        </View>
                                                        <Text style={[
                                                            styles.typeText,
                                                            isSelected && { color: iType.color, fontWeight: '700' }
                                                        ]}>
                                                            {iType.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>

                                    <View style={[styles.divider, { marginVertical: SPACING.l }]} />

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('note')}</Text>
                                        <TextInput
                                            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                            value={note}
                                            onChangeText={setNote}
                                            placeholder={t('note')}
                                            placeholderTextColor={COLORS.textMuted}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.saveBtn} onPress={handleAddOrUpdate}>
                                    <Text style={styles.saveBtnText}>{t('save')}</Text>
                                </TouchableOpacity>
                                
                                <View style={{ height: 40 }} />
                            </ScrollView>
                        </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
    },
    backBtn: {
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
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.light,
    },
    content: {
        padding: SPACING.m,
    },
    totalCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    totalLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    totalAmount: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: SPACING.s,
    },
    listSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    sourceItem: {
        padding: SPACING.m,
        marginBottom: SPACING.s,
    },
    sourceItemContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sourceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    sourceNote: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    sourceAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    deleteBtn: {
        marginTop: 4,
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.m,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '92%',
    },
    modalHeader: {
        padding: SPACING.l,
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    modalCloseBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.l,
        ...SHADOWS.soft,
    },
    inputGroup: {
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeItem: {
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
    typeText: {
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
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default IncomeScreen;
