import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';
import Card from '../components/Card';

const AlertsScreen = () => {
    const { t, isRTL } = useTranslation();
    
    // Mock alerts
    const alerts = [
        { 
            id: '1', 
            titleAr: 'تنبيه الميزانية', 
            titleEn: 'Budget Alert', 
            messageAr: 'لقد استهلكت 50% من ميزانيتك الشهرية.', 
            messageEn: 'You have reached 50% of your monthly budget.', 
            type: 'warning', 
            dateAr: 'منذ ساعتين', 
            dateEn: '2h ago' 
        },
        { 
            id: '2', 
            titleAr: 'مرحباً بك', 
            titleEn: 'Welcome', 
            messageAr: 'مرحباً بك في تطبيق مدير المصاريف الخاص بك!', 
            messageEn: 'Welcome to your Expense Monitor app!', 
            type: 'info', 
            dateAr: 'منذ يوم', 
            dateEn: '1d ago' 
        },
    ];

    const renderItem = ({ item }) => {
        const isWarning = item.type === 'warning';
        return (
            <Card style={styles.alertCard} variant="outlined">
                <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isWarning ? '#FEF3C7' : '#E0E7FF' }]}>
                        <Ionicons
                            name={isWarning ? 'warning' : 'information-circle'}
                            size={24}
                            color={isWarning ? '#D97706' : '#4F46E5'}
                        />
                    </View>
                    <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={styles.alertTitle}>{isRTL ? item.titleAr : item.titleEn}</Text>
                            <Text style={styles.date}>{isRTL ? item.dateAr : item.dateEn}</Text>
                        </View>
                        <Text style={[styles.alertMessage, { textAlign: isRTL ? 'right' : 'left' }]}>
                            {isRTL ? item.messageAr : item.messageEn}
                        </Text>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.title}>{t('alerts')}</Text>
                <TouchableOpacity style={styles.clearBtn}>
                    <Text style={styles.clearBtnText}>{isRTL ? 'مسح الكل' : 'Clear All'}</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={alerts}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color={COLORS.textMuted} />
                        <Text style={styles.emptyText}>{isRTL ? 'لا توجد تنبيهات حالياً' : 'No alerts at the moment'}</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        backgroundColor: COLORS.white,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    clearBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: COLORS.surfaceVariant,
    },
    clearBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    list: {
        padding: SPACING.m,
    },
    alertCard: {
        padding: SPACING.m,
        marginBottom: SPACING.m,
    },
    row: {
        alignItems: 'flex-start',
        gap: SPACING.m,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    headerRow: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    date: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    alertMessage: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: SPACING.m,
        fontSize: 16,
        color: COLORS.textMuted,
    }
});

export default AlertsScreen;
