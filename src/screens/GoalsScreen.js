import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, StatusBar, Platform } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { useExpensesStore, useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import * as Progress from 'react-native-progress';

const GoalsScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const { savingsGoals: rawGoals, addGoal, updateGoal, deleteGoal } = useExpensesStore();
    const savingsGoals = rawGoals || [];
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
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('savingsGoals')}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddGoal}>
                    <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {savingsGoals.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <Ionicons name="flag-outline" size={64} color={COLORS.primary + '30'} />
                        </View>
                        <Text style={styles.emptyText}>{t('noGoals')}</Text>
                        <Text style={styles.emptySubtext}>{t('createFirstGoal')}</Text>
                        <TouchableOpacity style={styles.emptyAddBtn} onPress={handleAddGoal}>
                            <Text style={styles.emptyAddBtnText}>{t('createGoal')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    savingsGoals.map((goal) => {
                        const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
                        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                        return (
                            <Card key={goal.id} style={styles.goalCard} variant="elevated">
                                <View style={[styles.goalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${goal.color}15` }]}>
                                        <Ionicons name={goal.icon} size={24} color={goal.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.goalName, { textAlign: isRTL ? 'right' : 'left' }]}>
                                            {isRTL ? (goal.nameAr || goal.name) : goal.name}
                                        </Text>
                                        <Text style={[styles.goalDeadline, { textAlign: isRTL ? 'right' : 'left' }]}>
                                            {daysLeft > 0 ? `${daysLeft} ${t('daysLeft')}` : t('expired')}
                                        </Text>
                                    </View>
                                    <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <TouchableOpacity onPress={() => handleEditGoal(goal)} style={styles.actionIconBtn}>
                                            <Ionicons name="pencil" size={18} color={COLORS.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)} style={[styles.actionIconBtn, { backgroundColor: COLORS.error + '10' }]}>
                                            <Ionicons name="trash" size={18} color={COLORS.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.progressSection}>
                                    <View style={[styles.amountRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <View style={{flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'baseline'}}>
                                            <Text style={styles.currentAmount}>
                                                {goal.currentAmount.toLocaleString()}
                                            </Text>
                                            <Text style={styles.currency}> {t('sar')}</Text>
                                        </View>
                                        <Text style={styles.percentageText}>
                                            {(progress * 100).toFixed(0)}%
                                        </Text>
                                    </View>
                                    
                                    <Progress.Bar
                                        progress={progress}
                                        width={null}
                                        height={10}
                                        color={goal.color}
                                        unfilledColor={COLORS.surfaceVariant}
                                        borderWidth={0}
                                        borderRadius={5}
                                        style={styles.progressBar}
                                    />
                                    
                                    <View style={[styles.targetRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <Text style={styles.targetLabel}>{t('targetAmount')}</Text>
                                        <Text style={styles.targetAmount}>
                                            {goal.targetAmount.toLocaleString()} {t('sar')}
                                        </Text>
                                    </View>
                                </View>

                                {goal.isCompleted && (
                                    <View style={[styles.completedBadge, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                        <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
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

    React.useEffect(() => {
        if (visible) {
            setName(goal?.name || '');
            setNameAr(goal?.nameAr || '');
            setTargetAmount(goal?.targetAmount?.toString() || '');
            setCurrentAmount(goal?.currentAmount?.toString() || '0');
            setDeadline(goal?.deadline || '');
            setSelectedIcon(goal?.icon || 'flag');
            setSelectedColor(goal?.color || COLORS.primary);
        }
    }, [visible, goal]);

    const icons = ['flag', 'home', 'car', 'airplane', 'school', 'medical', 'wallet', 'gift'];
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];

    const handleSave = () => {
        if (!name || !targetAmount) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        const goalData = {
            id: goal?.id || Date.now().toString(),
            name,
            nameAr: nameAr || name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount),
            deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            icon: selectedIcon,
            color: selectedColor,
            isCompleted: parseFloat(currentAmount) >= parseFloat(targetAmount)
        };

        onSave(goalData);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {goal ? t('editGoal') : t('createGoal')}
                        </Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputCard}>
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
                                    placeholder="مثلاً: شراء سيارة جديدة"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
                                    {t('targetAmount')} ({t('sar')})
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
                                    {t('currentAmount')} ({t('sar')})
                                </Text>
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                    value={currentAmount}
                                    onChangeText={setCurrentAmount}
                                    keyboardType="numeric"
                                    placeholder="0"
                                />
                            </View>
                        </View>

                        <View style={[styles.inputCard, { marginTop: SPACING.m }]}>
                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left', marginBottom: SPACING.m }]}>
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
                                            size={22}
                                            color={selectedIcon === icon ? COLORS.white : COLORS.textSecondary}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left', marginTop: SPACING.l, marginBottom: SPACING.m }]}>
                                {t('color')}
                            </Text>
                            <View style={styles.colorGrid}>
                                {colors.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    >
                                        {selectedColor === color && (
                                            <Ionicons name="checkmark" size={20} color={COLORS.white} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        
                        <View style={{height: 40}} />
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 22,
    },
    title: {
        fontSize: 20,
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
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.l,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyAddBtn: {
        marginTop: SPACING.xl,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.m,
        borderRadius: 16,
    },
    emptyAddBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    goalCard: {
        marginBottom: SPACING.m,
        padding: SPACING.l,
    },
    goalHeader: {
        alignItems: 'center',
        marginBottom: SPACING.l,
        gap: SPACING.m,
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    goalDeadline: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    actions: {
        gap: SPACING.s,
    },
    actionIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressSection: {
    },
    amountRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    currentAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    currency: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    percentageText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    progressBar: {
        marginBottom: SPACING.s,
    },
    targetRow: {
        justifyContent: 'space-between',
    },
    targetLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    targetAmount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    completedBadge: {
        alignItems: 'center',
        gap: 6,
        marginTop: SPACING.l,
        padding: SPACING.s,
        backgroundColor: COLORS.success + '15',
        borderRadius: 12,
        justifyContent: 'center',
    },
    completedText: {
        fontSize: 13,
        color: COLORS.success,
        fontWeight: 'bold',
    },
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
        paddingBottom: SPACING.xl,
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
    modalBody: {
        padding: SPACING.m,
    },
    inputCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.l,
        ...SHADOWS.soft,
    },
    inputGroup: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: SPACING.s,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    iconOption: {
        width: '22%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorOption: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: SPACING.l,
        marginBottom: SPACING.m,
        ...SHADOWS.light,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GoalsScreen;
