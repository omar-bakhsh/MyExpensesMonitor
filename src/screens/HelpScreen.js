import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';
import Constants from 'expo-constants';

const HelpScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const version = Constants.expoConfig?.version || '1.0.0';

    const handleWhatsApp = () => {
        const phone = '966543201512';
        const text = 'تطبيق مصروفاتي';
        const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url);
            } else {
                // Fallback for when whatsapp is not installed
                return Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
            }
        }).catch(err => console.error('An error occurred', err));
    };

    const handleEmail = () => {
        Linking.openURL('mailto:info@kayan.dev');
    };

    const FAQItem = ({ title, body }) => (
        <View style={styles.faqItem}>
            <Text style={styles.faqTitle}>{title}</Text>
            <Text style={styles.faqBody}>{body}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('helpCenter')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('contactUs')}</Text>

                    <TouchableOpacity style={[styles.contactBtn, styles.whatsappBtn]} onPress={handleWhatsApp}>
                        <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
                        <Text style={styles.btnText}>{t('whatsapp')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.contactBtn, styles.emailBtn]} onPress={handleEmail}>
                        <Ionicons name="mail" size={24} color="#FFF" />
                        <Text style={styles.btnText}>{t('email')}</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('faq')}</Text>
                    <FAQItem title={t('faq1Title')} body={t('faq1Body')} />
                    <FAQItem title={t('faq2Title')} body={t('faq2Body')} />
                </View>

                {/* Info Section */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('developedBy')} Omar Bakhsh</Text>
                    <Text style={styles.companyText}>@ Kayan Platform</Text>
                    <Text style={styles.versionText}>{t('version')} {version}</Text>
                </View>

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingTop: 60,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.m,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    contactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.s,
        gap: SPACING.s,
    },
    whatsappBtn: {
        backgroundColor: '#25D366',
    },
    emailBtn: {
        backgroundColor: COLORS.primary,
    },
    btnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    faqItem: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.s,
    },
    faqTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        textAlign: 'left',
    },
    faqBody: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        textAlign: 'left',
    },
    footer: {
        alignItems: 'center',
        marginTop: SPACING.l,
        marginBottom: SPACING.xl,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    companyText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 2,
    },
    versionText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
    }
});

export default HelpScreen;
