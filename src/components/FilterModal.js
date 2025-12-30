import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { useTranslation } from '../store';
import CATEGORIES from '../utils/categories';
import SAUDI_BANKS from '../utils/banks';

const FilterModal = ({ visible, onClose, onApply, currentFilters = {} }) => {
    const { t, isRTL } = useTranslation();
    const [filters, setFilters] = useState(currentFilters);

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({});
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={styles.title}>{t('advancedFilters')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filtersContainer}>
                        {/* Category Filter */}
                        <View style={styles.filterSection}>
                            <Text style={[styles.filterLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('category')}
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={[styles.chipContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TouchableOpacity
                                        style={[styles.chip, !filters.category && styles.chipActive]}
                                        onPress={() => updateFilter('category', null)}
                                    >
                                        <Text style={[styles.chipText, !filters.category && styles.chipTextActive]}>
                                            {t('all')}
                                        </Text>
                                    </TouchableOpacity>
                                    {CATEGORIES.map(cat => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.chip,
                                                filters.category === cat.id && { backgroundColor: cat.color }
                                            ]}
                                            onPress={() => updateFilter('category', cat.id)}
                                        >
                                            <Ionicons
                                                name={cat.icon}
                                                size={16}
                                                color={filters.category === cat.id ? COLORS.surface : cat.color}
                                            />
                                            <Text style={[
                                                styles.chipText,
                                                filters.category === cat.id && styles.chipTextActive
                                            ]}>
                                                {t(cat.id)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Bank Filter */}
                        <View style={styles.filterSection}>
                            <Text style={[styles.filterLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('bank')}
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={[styles.chipContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TouchableOpacity
                                        style={[styles.chip, !filters.bankId && styles.chipActive]}
                                        onPress={() => updateFilter('bankId', null)}
                                    >
                                        <Text style={[styles.chipText, !filters.bankId && styles.chipTextActive]}>
                                            {t('all')}
                                        </Text>
                                    </TouchableOpacity>
                                    {SAUDI_BANKS.map(bank => (
                                        <TouchableOpacity
                                            key={bank.id}
                                            style={[
                                                styles.chip,
                                                filters.bankId === bank.id && { backgroundColor: bank.color }
                                            ]}
                                            onPress={() => updateFilter('bankId', bank.id)}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                filters.bankId === bank.id && styles.chipTextActive
                                            ]}>
                                                {isRTL ? bank.nameAr : bank.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Amount Range */}
                        <View style={styles.filterSection}>
                            <Text style={[styles.filterLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('amountRange')}
                            </Text>
                            <View style={[styles.rangeInputs, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                    placeholder={t('min')}
                                    keyboardType="numeric"
                                    value={filters.minAmount?.toString() || ''}
                                    onChangeText={(text) => updateFilter('minAmount', text ? parseFloat(text) : undefined)}
                                />
                                <Text style={styles.separator}>-</Text>
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                    placeholder={t('max')}
                                    keyboardType="numeric"
                                    value={filters.maxAmount?.toString() || ''}
                                    onChangeText={(text) => updateFilter('maxAmount', text ? parseFloat(text) : undefined)}
                                />
                            </View>
                        </View>

                        {/* Date Range */}
                        <View style={styles.filterSection}>
                            <Text style={[styles.filterLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('dateRange')}
                            </Text>
                            <View style={styles.dateButtons}>
                                {['today', 'week', 'month', 'year'].map(period => (
                                    <TouchableOpacity
                                        key={period}
                                        style={styles.dateBtn}
                                        onPress={() => {
                                            const now = new Date();
                                            let dateFrom = new Date();

                                            switch (period) {
                                                case 'today':
                                                    dateFrom.setHours(0, 0, 0, 0);
                                                    break;
                                                case 'week':
                                                    dateFrom.setDate(now.getDate() - 7);
                                                    break;
                                                case 'month':
                                                    dateFrom.setMonth(now.getMonth() - 1);
                                                    break;
                                                case 'year':
                                                    dateFrom.setFullYear(now.getFullYear() - 1);
                                                    break;
                                            }

                                            updateFilter('dateFrom', dateFrom.toISOString());
                                            updateFilter('dateTo', now.toISOString());
                                        }}
                                    >
                                        <Text style={styles.dateBtnText}>{t(period)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Text style={styles.resetBtnText}>{t('reset')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyBtnText}>{t('apply')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    filtersContainer: {
        padding: SPACING.m,
    },
    filterSection: {
        marginBottom: SPACING.l,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
    },
    chipContainer: {
        flexDirection: 'row',
        gap: SPACING.s,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    chipActive: {
        backgroundColor: COLORS.primary,
    },
    chipText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    chipTextActive: {
        color: COLORS.surface,
        fontWeight: '600',
    },
    rangeInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: SPACING.m,
        borderRadius: 12,
        fontSize: 16,
    },
    separator: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    dateButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    dateBtn: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    dateBtnText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.m,
        paddingHorizontal: SPACING.m,
        marginTop: SPACING.m,
    },
    resetBtn: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    resetBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    applyBtn: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    applyBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.surface,
    },
});

export default FilterModal;
