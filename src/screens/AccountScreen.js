import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, StatusBar, Alert } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore, useExpensesStore, useTranslation } from '../store';
import { useNavigation } from '@react-navigation/native';
import { scheduleDailyReminder, cancelAllNotifications } from '../services/notificationService';
import { exportTransactions, exportToPDF, exportToExcel, createBackup } from '../services/dataService';
import Card from '../components/Card';

const AccountScreen = () => {
    const { t, language, isRTL } = useTranslation();
    const { settings, updateSettings, user } = useUserStore();
    const { budget, transactions, incomeSources } = useExpensesStore();
    const navigation = useNavigation();

    const handleBackup = async () => {
        const result = await createBackup({ transactions, budget, incomeSources, settings });
        if (result.success) Alert.alert(t('success'), result.message);
    };

    const handleExportPDF = async () => {
        const result = await exportToPDF(transactions, t('annualSummary'), t('sar'), language === 'ar', user);
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

    const SettingItem = ({ icon, label, onPress, value, type = 'chevron', color = COLORS.primary }) => (
        <TouchableOpacity style={[styles.item, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} onPress={onPress}>
            <View style={[styles.itemIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.itemText, { textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
            {type === 'chevron' && <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={COLORS.textMuted} />}
            {type === 'switch' && (
                <Switch
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ false: COLORS.surfaceVariant, true: color + '40' }}
                    thumbColor={value ? color : COLORS.white}
                />
            )}
            {type === 'text' && <Text style={styles.itemValue}>{value}</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.headerTitle}>{t('settings')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Summary */}
                <Card style={styles.profileCard} variant="elevated">
                    <View style={[styles.profileInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={32} color={COLORS.white} />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                            <Text style={[styles.userName, { textAlign: isRTL ? 'right' : 'left' }]}>{user?.name}</Text>
                            <Text style={[styles.userEmail, { textAlign: isRTL ? 'right' : 'left' }]}>{user?.position} @ {user?.company}</Text>
                        </View>
                    </View>
                </Card>

                {/* General Settings */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('general')}</Text>
                <Card style={styles.settingsGroup} variant="outlined">
                    <SettingItem 
                        icon="person-circle" 
                        label={t('profile')} 
                        onPress={() => navigation.navigate('Profile')} 
                    />
                    <SettingItem 
                        icon="language" 
                        label={t('language')} 
                        onPress={toggleLanguage} 
                        type="text" 
                        value={language === 'ar' ? 'العربية' : 'English'} 
                    />
                    <SettingItem 
                        icon="notifications" 
                        label={t('notifications')} 
                        onPress={() => updateSettings({ pushNotificationsEnabled: !settings.pushNotificationsEnabled })} 
                        type="switch" 
                        value={settings.pushNotificationsEnabled} 
                    />
                    <SettingItem 
                        icon="shield-checkmark" 
                        label={t('security')} 
                        onPress={() => navigation.navigate('Security')} 
                    />
                </Card>

                {/* Wallet & Banks */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('wallets')}</Text>
                <Card style={styles.settingsGroup} variant="outlined">
                    <SettingItem 
                        icon="business" 
                        label={t('banks')} 
                        onPress={() => navigation.navigate('BankSelection')} 
                    />
                    <SettingItem 
                        icon="card" 
                        label={t('cards')} 
                        onPress={() => navigation.navigate('CardCustomization')} 
                    />
                </Card>

                {/* Data Management */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('data')}</Text>
                <Card style={styles.settingsGroup} variant="outlined">
                    <SettingItem 
                        icon="cloud-upload" 
                        label={t('backup')} 
                        onPress={handleBackup} 
                        color={COLORS.secondary}
                    />
                    <SettingItem 
                        icon="document-text" 
                        label={t('exportPDF')} 
                        onPress={handleExportPDF} 
                        color="#EF4444"
                    />
                    <SettingItem 
                        icon="grid" 
                        label={t('exportExcel')} 
                        onPress={handleExportExcel} 
                        color="#10B981"
                    />
                </Card>

                {/* About */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('about')}</Text>
                <Card style={styles.settingsGroup} variant="outlined">
                    <SettingItem 
                        icon="help-circle" 
                        label={t('helpSupport')} 
                        onPress={() => navigation.navigate('Help')} 
                    />
                    <SettingItem 
                        icon="information-circle" 
                        label={t('termsConditions')} 
                        onPress={() => navigation.navigate('Terms')} 
                    />
                </Card>
                
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <View style={{ height: 40 }} />
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.m,
    },
    profileCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        marginBottom: SPACING.l,
    },
    profileInfo: {
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: SPACING.l,
        marginBottom: SPACING.s,
        paddingHorizontal: 4,
    },
    settingsGroup: {
        padding: 0,
        overflow: 'hidden',
    },
    item: {
        padding: SPACING.m,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceVariant,
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        marginHorizontal: SPACING.m,
    },
    itemValue: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: SPACING.xl,
    }
});

export default AccountScreen;
