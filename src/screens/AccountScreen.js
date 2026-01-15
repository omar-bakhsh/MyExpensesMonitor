import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore, useExpensesStore, useTranslation } from '../store';
import { useNavigation } from '@react-navigation/native';
import { scheduleDailyReminder, cancelAllNotifications } from '../services/notificationService';
import { exportTransactions, exportToPDF, exportToExcel, createBackup } from '../services/dataService';
import { Alert } from 'react-native';

const AccountScreen = () => {
    const { t, language } = useTranslation();
    const { settings, updateSettings } = useUserStore();
    const { budget, transactions, incomeSources } = useExpensesStore();
    const navigation = useNavigation();

    const handleBackup = async () => {
        const result = await createBackup({ transactions, budget, incomeSources, settings });
        if (result.success) Alert.alert(t('success'), result.message);
    };

    const handleExportPDF = async () => {
        const result = await exportToPDF(transactions, t('annualSummary'), t('sar'), language === 'ar');
        if (result.success) Alert.alert(t('success'), result.message);
    };

    const handleExportExcel = async () => {
        const result = await exportToExcel(transactions);
        if (result.success) Alert.alert(t('success'), result.message);
    };

    const toggleLanguage = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        updateSettings({ language: newLang });
    };

    const toggleNotifications = async () => {
        const newValue = !settings.pushNotificationsEnabled;
        updateSettings({ pushNotificationsEnabled: newValue });

        if (newValue) {
            await scheduleDailyReminder();
        } else {
            await cancelAllNotifications();
        }
    };


    const renderItem = (icon, label, onPress, rightElement = null, subLabel = null) => (
        <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
                <View>
                    <Text style={styles.itemText}>{label}</Text>
                    {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
                </View>
            </View>
            {rightElement || <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{t('account')}</Text>

            {/* Subscriptions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('subscriptions')}</Text>
                {renderItem('card', t('manageSubscription'))}
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('settingsTitle')}</Text>
                {renderItem('business', t('bankConnections'), () => navigation.navigate('BankSelection'))}
                {renderItem('card', t('cardManagement'), () => navigation.navigate('CardCustomization'))}

                {/* Income & Budget Management */}
                {renderItem(
                    'wallet',
                    t('editIncome'),
                    () => navigation.navigate('Income'),
                    null,
                    `${t('totalIncome')}: ${budget} ${t('sar')}`
                )}

                {/* Categories Budget */}
                {renderItem('grid', t('categoryBudgets'), () => navigation.navigate('CategoryBudget'))}

                {/* Notification Toggle */}
                {renderItem('notifications', t('notifications'), toggleNotifications, (
                    <Switch
                        value={settings.pushNotificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{ false: '#767577', true: COLORS.primary }}
                        thumbColor={'#f4f3f4'}
                    />
                ))}

                {/* Language Toggle */}
                <TouchableOpacity style={styles.item} onPress={toggleLanguage}>
                    <View style={styles.itemLeft}>
                        <Ionicons name="language" size={20} color={COLORS.primary} />
                        <Text style={styles.itemText}>{t('language')}</Text>
                    </View>
                    <View style={styles.languageToggle}>
                        <Text style={styles.languageText}>{language === 'ar' ? 'العربية' : 'English'}</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Data Management */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('backup')}</Text>
                {renderItem('cloud-upload-outline', t('createBackup'), handleBackup)}
                {renderItem('document-text-outline', t('exportPDF'), handleExportPDF)}
                {renderItem('grid-outline', t('exportExcel'), handleExportExcel)}
            </View>

            {/* Support */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                {renderItem('help-circle', t('helpCenter'), () => navigation.navigate('Help'))}
                {renderItem('document-text', t('terms'), () => navigation.navigate('Terms'))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn}>
                <Text style={styles.logoutText}>{t('logout')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.m,
        paddingTop: 50,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        marginBottom: SPACING.l,
        color: COLORS.text,
    },
    section: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.s,
        minHeight: 56,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    subLabel: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 2,
    },
    languageToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    languageText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    logoutBtn: {
        backgroundColor: '#FEE2E2',
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    logoutText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.m,
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        width: '100%',
        maxWidth: 340,
        borderRadius: 20,
        padding: SPACING.l,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.l,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.background,
        padding: SPACING.m,
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.primary,
        marginBottom: SPACING.xl,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.m,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.background,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
});

export default AccountScreen;
