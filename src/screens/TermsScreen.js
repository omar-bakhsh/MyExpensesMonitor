import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';

const TermsScreen = ({ navigation }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('terms')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>{t('termsOfService')}</Text>
                <Text style={styles.text}>
                    {t('termsText')}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>{t('privacyPolicy')}</Text>
                <Text style={styles.text}>
                    1. **Information Collection**: We do not collect any personal data on external servers. All data processing (SMS scanning) happens locally on your device.
                    {"\n\n"}
                    2. **Data Usage**: Your financial data is used solely for the purpose of generating reports and analytics within this application.
                    {"\n\n"}
                    3. **Security**: We use secure local storage to keep your data safe. However, please note that no method of electronic storage is 100% secure.
                    {"\n\n"}
                    4. **Changes**: We may update our Privacy Policy from time to time. Using the app after such changes constitutes acceptance.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.footerText}>
                    © {new Date().getFullYear()} Kayan Platform. All rights reserved.
                </Text>
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
        paddingBottom: 50,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.s,
        textAlign: 'left',
    },
    text: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: SPACING.l,
        textAlign: 'left',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.m,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.xl,
    }
});

export default TermsScreen;
