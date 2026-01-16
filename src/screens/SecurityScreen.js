import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTranslation, useUserStore } from '../store';
import Card from '../components/Card';

const SecurityScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const { settings, updateSettings } = useUserStore();

    // Local state for toggles (synced with store usually)
    const [biometricsEnabled, setBiometricsEnabled] = useState(settings?.biometricsEnabled || false);
    const [pinEnabled, setPinEnabled] = useState(settings?.pinEnabled || false);
    const [hideBalance, setHideBalance] = useState(settings?.hideBalance || false);

    const handleToggle = async (key, value, setter) => {
        if (key === 'biometricsEnabled' && value === true) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert(
                    isRTL ? 'تنبيه' : 'Warning',
                    isRTL ? 'جهازك لا يدعم البصمة أو لم يتم إعدادها' : 'Your device does not support biometrics or it is not set up'
                );
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: isRTL ? 'تأكيد تفعيل البصمة' : 'Confirm Biometrics Activation',
            });

            if (!result.success) return;
        }

        setter(value);
        updateSettings({ [key]: value });
    };

    const SettingItem = ({ icon, label, description, value, onToggle, color = COLORS.primary }) => (
        <View style={[styles.item, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                <Text style={[styles.itemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
                <Text style={[styles.itemDescription, { textAlign: isRTL ? 'right' : 'left' }]}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: COLORS.surfaceVariant, true: color + '40' }}
                thumbColor={value ? color : COLORS.white}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('security')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.shieldIconContainer}>
                    <View style={styles.shieldPulse}>
                        <Ionicons name="shield-checkmark" size={64} color={COLORS.primary} />
                    </View>
                    <Text style={styles.shieldTitle}>{isRTL ? 'حماية بياناتك المالية' : 'Protect Your Financial Data'}</Text>
                    <Text style={styles.shieldSubtitle}>
                        {isRTL ? 'فعل ميزات الأمان لضمان خصوصية معلوماتك' : 'Enable security features to ensure your privacy'}
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('authentication')}</Text>
                <Card style={styles.groupCard} variant="outlined">
                    <SettingItem 
                        icon="finger-print" 
                        label={isRTL ? 'البصمة / التعرف على الوجه' : 'Biometrics / FaceID'}
                        description={isRTL ? 'استخدم البصمة لفتح التطبيق بسرعة' : 'Use biometrics to unlock the app quickly'}
                        value={biometricsEnabled}
                        onToggle={(v) => handleToggle('biometricsEnabled', v, setBiometricsEnabled)}
                    />
                    <View style={styles.divider} />
                    <SettingItem 
                        icon="keypad" 
                        label={isRTL ? 'رمز القفل (PIN)' : 'PIN Code'}
                        description={isRTL ? 'قفل التطبيق برمز سري مكون من 4 أرقام' : 'Lock the app with a 4-digit secret code'}
                        value={pinEnabled}
                        onToggle={(v) => handleToggle('pinEnabled', v, setPinEnabled)}
                        color={COLORS.secondary}
                    />
                </Card>

                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy')}</Text>
                <Card style={styles.groupCard} variant="outlined">
                    <SettingItem 
                        icon="eye-off" 
                        label={isRTL ? 'إخفاء الرصيد' : 'Hide Balance'}
                        description={isRTL ? 'إخفاء المبالغ المالية في الشاشة الرئيسية' : 'Hide monetary amounts on the dashboard'}
                        value={hideBalance}
                        onToggle={(v) => handleToggle('hideBalance', v, setHideBalance)}
                        color="#EF4444"
                    />
                </Card>

                <TouchableOpacity style={styles.changePasswordBtn}>
                    <Text style={styles.changePasswordText}>{isRTL ? 'تغيير رمز المرور' : 'Change Passcode'}</Text>
                </TouchableOpacity>

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
    content: {
        padding: SPACING.m,
    },
    shieldIconContainer: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    shieldPulse: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.m,
    },
    shieldTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    shieldSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: SPACING.l,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: SPACING.l,
        marginBottom: SPACING.s,
    },
    groupCard: {
        padding: 0,
        overflow: 'hidden',
    },
    item: {
        padding: SPACING.m,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    itemDescription: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.surfaceVariant,
        marginHorizontal: SPACING.m,
    },
    changePasswordBtn: {
        marginTop: SPACING.xl,
        padding: SPACING.m,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    changePasswordText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default SecurityScreen;
