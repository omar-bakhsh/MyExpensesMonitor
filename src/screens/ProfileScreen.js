import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore, useTranslation } from '../store';
import Card from '../components/Card';

const ProfileScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const { user, setUser } = useUserStore();

    const [name, setName] = useState(user?.name || '');
    const [position, setPosition] = useState(user?.position || '');
    const [company, setCompany] = useState(user?.company || '');

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        setUser({
            ...user,
            name: name.trim(),
            position: position.trim(),
            company: company.trim()
        });

        Alert.alert(t('success'), isRTL ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('editProfile')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={50} color={COLORS.white} />
                    </View>
                    <Text style={styles.avatarHint}>{isRTL ? 'تعديل الصورة الشخصية' : 'Edit Profile Picture'}</Text>
                </View>

                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('personalInfo')}</Text>
                <Card style={styles.card} variant="outlined">
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('employeeName')}</Text>
                        <TextInput
                            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                            value={name}
                            onChangeText={setName}
                            placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('position')}</Text>
                        <TextInput
                            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                            value={position}
                            onChangeText={setPosition}
                            placeholder={isRTL ? 'مثال: مدير المبيعات' : 'e.g. Sales Manager'}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('companyName')}</Text>
                        <TextInput
                            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                            value={company}
                            onChangeText={setCompany}
                            placeholder={isRTL ? 'اسم جهة العمل' : 'Workplace name'}
                        />
                    </View>
                </Card>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>{t('save')}</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
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
    avatarContainer: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
    },
    avatarHint: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.m,
        marginTop: SPACING.m,
    },
    card: {
        padding: SPACING.m,
    },
    inputGroup: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: SPACING.m,
        alignItems: 'center',
        marginTop: SPACING.xl,
        ...SHADOWS.medium,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
