import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore, useTranslation } from '../store';
import { useNavigation } from '@react-navigation/native';
import { scheduleDailyReminder, cancelAllNotifications } from '../services/notificationService';

const AccountScreen = () => {
    const { t, language } = useTranslation();
    const { settings, updateSettings } = useUserStore();
    const navigation = useNavigation();

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

    const renderItem = (icon, label, onPress, rightElement = null) => (
        <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
                <Text style={styles.itemText}>{label}</Text>
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
                {renderItem('wallet', t('manageBudget'), () => navigation.navigate('CategoryBudget'))}

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

            {/* Support */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                {renderItem('help-circle', t('helpCenter'))}
                {renderItem('document-text', t('terms'))}
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
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
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
    }
});

export default AccountScreen;
