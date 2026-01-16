import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';
import Card from '../components/Card';

const TermsScreen = ({ navigation }) => {
    const { t, isRTL } = useTranslation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('termsConditions')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.iconBox}>
                    <Ionicons name="document-text" size={64} color={COLORS.primary} />
                </View>

                <Card style={styles.termsCard} variant="outlined">
                    <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('termsOfService')}</Text>
                    <Text style={[styles.text, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {t('termsText')}
                    </Text>

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacyPolicy')}</Text>
                    <Text style={[styles.text, { textAlign: isRTL ? 'right' : 'left' }]}>
                        1. <Text style={styles.bold}>{isRTL ? 'جمع المعلومات' : 'Information Collection'}</Text>: {isRTL ? 'نحن لا نجمع أي بيانات شخصية على خوادم خارجية. جميع معالجة البيانات (مسح الرسائل القصيرة) تتم محليًا على جهازك.' : 'We do not collect any personal data on external servers. All data processing (SMS scanning) happens locally on your device.'}
                        {"\n\n"}
                        2. <Text style={styles.bold}>{isRTL ? 'استخدام البيانات' : 'Data Usage'}</Text>: {isRTL ? 'تُستخدم بياناتك المالية فقط لغرض إنشاء التقارير والتحليلات داخل هذا التطبيق.' : 'Your financial data is used solely for the purpose of generating reports and analytics within this application.'}
                        {"\n\n"}
                        3. <Text style={styles.bold}>{isRTL ? 'الأمان' : 'Security'}</Text>: {isRTL ? 'نحن نستخدم التخزين المحلي الآمن للحفاظ على أمان بياناتك. ومع ذلك ، يرجى ملاحظة أنه لا توجد طريقة تخزين إلكترونية آمنة بنسبة 100٪.' : 'We use secure local storage to keep your data safe. However, please note that no method of electronic storage is 100% secure.'}
                        {"\n\n"}
                        4. <Text style={styles.bold}>{isRTL ? 'التغييرات' : 'Changes'}</Text>: {isRTL ? 'قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. استخدام التطبيق بعد هذه التغييرات يشكل قبولاً.' : 'We may update our Privacy Policy from time to time. Using the app after such changes constitutes acceptance.'}
                    </Text>
                </Card>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} Kayan Platform. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                    </Text>
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
    iconBox: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    termsCard: {
        padding: SPACING.l,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    text: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    bold: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.surfaceVariant,
        marginVertical: SPACING.xl,
    },
    footer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
});

export default TermsScreen;
