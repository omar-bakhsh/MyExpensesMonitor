import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import * as Progress from 'react-native-progress';

const GoalsScreen = () => {
    const { t, isRTL } = useTranslation();
    const { savingsGoals, addGoal, updateGoal, deleteGoal } = useExpensesStore();
    const [showModal, setShowModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const handleAddGoal = () => {
        setEditingGoal(null);
        setShowModal(true);
    };

    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setShowModal(true);
    };

    const handleDeleteGoal = (id) => {
        Alert.alert(
            t('deleteGoal'),
            t('deleteGoalConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: () => deleteGoal(id)
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.title}>{t('savingsGoals')}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddGoal}>
                    <Ionicons name="add" size={24} color={COLORS.surface} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {savingsGoals.length === 0 ? (
                    <Card style={styles.emptyState}>
                        <Ionicons name="flag-outline" size={48} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>{t('noGoals')}</Text>
                        <Text style={styles.emptySubtext}>{t('createFirstGoal')}</Text>
                    </Card>
                ) : (
                    savingsGoals.map((goal) => {
                        const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
                        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                        return (
                            <Card key={goal.id} style={styles.goalCard}>
                                <View style={[styles.goalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${goal.color}20` }]}>
                                        <Ionicons name={goal.icon} size={24} color={goal.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.goalName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                            {isRTL ? goal.nameAr : goal.name}
                                        </Text>
                                        <Text style={[styles.goalDeadline, { textAlign: isRTL ? 'right' : 'left' }]}>
                                            {daysLeft > 0 ? `${daysLeft} ${t('daysLeft')}` : t('expired')}
                                        </Text>
                                    </View>
                                    <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <TouchableOpacity onPress={() => handleEditGoal(goal)}>
                                            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                                            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.progressSection}>
                                    <Progress.Bar
                                        progress={progress}
                                        width={null}
                                        height={8}
                                        color={goal.color}
                                        unfilledColor="#E5E7EB"
                                        borderWidth={0}
                                        borderRadius={4}
                                    />
                                    <View style={[styles.amountRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <Text style={styles.currentAmount}>
                                            {goal.currentAmount.toLocaleString()} {t('sar')}
                                        </Text>
                                        <Text style={styles.targetAmount}>
                                            / {goal.targetAmount.toLocaleString()} {t('sar')}
                                        </Text>
                                    </View>
                                    <Text style={[styles.percentage, { textAlign: isRTL ? 'right' : 'left' }]}>
                                        {(progress * 100).toFixed(0)}% {t('completed')}
                                    </Text>
                                </View>

                                {goal.isCompleted && (
                                    <View style={styles.completedBadge}>
                                        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                        <Text style={styles.completedText}>{t('goalAchieved')}</Text>
                                    </View>
                                )}
                            </Card>
                        );
                    })
                )}
            </ScrollView>

            <GoalModal
                visible={showModal}
                goal={editingGoal}
                onClose={() => setShowModal(false)}
                onSave={(goalData) => {
                    if (editingGoal) {
                        updateGoal(editingGoal.id, goalData);
                    } else {
                        addGoal(goalData);
                    }
                    setShowModal(false);
                }}
            />
        </View>
    );
};

const GoalModal = ({ visible, goal, onClose, onSave }) => {
    const { t, isRTL } = useTranslation();
    const [name, setName] = useState(goal?.name || '');
    const [nameAr, setNameAr] = useState(goal?.nameAr || '');
    const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
    const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount?.toString() || '0');
    const [deadline, setDeadline] = useState(goal?.deadline || '');
    const [selectedIcon, setSelectedIcon] = useState(goal?.icon || 'flag');
    const [selectedColor, setSelectedColor] = useState(goal?.color || COLORS.primary);

    const icons = ['flag', 'home', 'car', 'airplane', 'school', 'medical', 'wallet', 'gift'];
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];

    const handleSave = () => {
        if (!name || !targetAmount) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        const goalData = {
            name,
            nameAr: nameAr || name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount),
            deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            icon: selectedIcon,
            color: selectedColor,
        };

        onSave(goalData);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={styles.modalTitle}>
                            {goal ? t('editGoal') : t('createGoal')}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('goalName')} (English)
                            </Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={name}
                                onChangeText={setName}
                                placeholder={t('enterGoalName')}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('goalName')} (العربية)
                            </Text>
                            <TextInput
                                style={[styles.input, { textAlign: 'right' }]}
                                value={nameAr}
                                onChangeText={setNameAr}
                                placeholder="أدخل اسم الهدف"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('targetAmount')}
                            </Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={targetAmount}
                                onChangeText={setTargetAmount}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('currentAmount')}
                            </Text>
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={currentAmount}
                                onChangeText={setCurrentAmount}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('icon')}
                            </Text>
                            <View style={styles.iconGrid}>
                                {icons.map(icon => (
                                    <TouchableOpacity
                                        key={icon}
                                        style={[
                                            styles.iconOption,
                                            selectedIcon === icon && { backgroundColor: COLORS.primary }
                                        ]}
                                        onPress={() => setSelectedIcon(icon)}
                                    >
                                        <Ionicons
                                            name={icon}
                                            size={24}
                                            color={selectedIcon === icon ? COLORS.surface : COLORS.text}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('color')}
                            </Text>
                            <View style={styles.colorGrid}>
                                {colors.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.colorSelected
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    >
                                        {selectedColor === color && (
                                            <Ionicons name="checkmark" size={20} color={COLORS.surface} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>{t('save')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        marginBottom: SPACING.l,
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.l,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.m,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
    },
    goalCard: {
        marginBottom: SPACING.m,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        gap: SPACING.m,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    goalDeadline: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    progressSection: {
        marginTop: SPACING.s,
    },
    amountRow: {
        flexDirection: 'row',
        marginTop: SPACING.s,
        gap: 4,
    },
    currentAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    targetAmount: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    percentage: {
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 4,
        fontWeight: '600',
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: SPACING.m,
        padding: SPACING.s,
        backgroundColor: '#D1FAE5',
        borderRadius: 8,
    },
    completedText: {
        fontSize: 14,
        color: COLORS.success,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: SPACING.l,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modalBody: {
        padding: SPACING.m,
    },
    inputGroup: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
    },
    input: {
        backgroundColor: '#F3F4F6',
        padding: SPACING.m,
        borderRadius: 12,
        fontSize: 16,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    iconOption: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    colorOption: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorSelected: {
        borderWidth: 3,
        borderColor: COLORS.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: SPACING.m,
        marginTop: SPACING.m,
    },
    saveBtnText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GoalsScreen;
