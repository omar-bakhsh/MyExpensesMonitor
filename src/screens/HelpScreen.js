import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';
import Constants from 'expo-constants';
import Card from '../components/Card';

const HelpScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();
    const version = Constants.expoConfig?.version || '1.0.0';

    const handleWhatsApp = () => {
        const phone = '966543201512';
        const text = isRTL ? 'تطبيق مدير المصاريف' : 'MyExpensesMonitor App';
        const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`;
        Linking.openURL(url).catch(() => Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`));
    };

    const handleEmail = () => Linking.openURL('mailto:info@kayan.dev');

    const FAQItem = ({ title, body }) => (
        <Card style={styles.faqCard} variant="outlined">
            <Text style={[styles.faqTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
            <Text style={[styles.faqBody, { textAlign: isRTL ? 'right' : 'left' }]}>{body}</Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('helpCenter')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                    <View style={styles.heroIconBox}>
                        <Ionicons name="chatbubbles" size={48} color={COLORS.primary} />
                    </View>
                    <Text style={styles.heroTitle}>
                        {isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        {isRTL ? 'نحن هنا للإجابة على جميع استفساراتك' : 'We are here to answer all your questions'}
                    </Text>
                </View>

                {/* Contact Section */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('contactUs')}</Text>
                <View style={[styles.contactGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: '#25D36615' }]} onPress={handleWhatsApp}>
                        <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
                        <Text style={[styles.contactText, { color: '#25D366' }]}>{t('whatsapp')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: COLORS.primary + '15' }]} onPress={handleEmail}>
                        <Ionicons name="mail" size={32} color={COLORS.primary} />
                        <Text style={[styles.contactText, { color: COLORS.primary }]}>{t('email')}</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('faq')}</Text>
                <FAQItem title={t('faq1Title')} body={t('faq1Body')} />
                <FAQItem title={t('faq2Title')} body={t('faq2Body')} />

                {/* Footer Info */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/omar-bakhsh')}>
                        <Text style={styles.developedBy}>
                            {t('developedBy')} <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Omar Bakhsh</Text>
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.companyText}>@ Kayan Platform</Text>
                    <Text style={styles.versionText}>{t('version')} {version}</Text>
                </View>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.m,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    heroIconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.m,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    heroSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
        marginTop: SPACING.l,
    },
    contactGrid: {
        gap: SPACING.m,
    },
    contactCard: {
        flex: 1,
        height: 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    contactText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    faqCard: {
        padding: SPACING.m,
        marginBottom: SPACING.s,
    },
    faqTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    faqBody: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    footer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    developedBy: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    companyText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    versionText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: SPACING.m,
    },
});

export default HelpScreen;
