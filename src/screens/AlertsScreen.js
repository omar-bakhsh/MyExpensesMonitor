import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../store';

const AlertsScreen = () => {
    const { t } = useTranslation();
    // Mock alerts for now
    const alerts = [
        { id: '1', title: t('budget') + ' Alert', message: 'You have reached 50% of your monthly budget.', type: 'warning', date: '2h ago' },
        { id: '2', title: 'Welcome', message: 'Welcome to MyExpensesMonitor!', type: 'info', date: '1d ago' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('alerts')}</Text>
            <FlatList
                data={alerts}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.alertCard}>
                        <View style={[styles.iconContainer, { backgroundColor: item.type === 'warning' ? '#FEF3C7' : '#E0E7FF' }]}>
                            <Ionicons
                                name={item.type === 'warning' ? 'warning' : 'information-circle'}
                                size={24}
                                color={item.type === 'warning' ? '#D97706' : '#4F46E5'}
                            />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.alertTitle}>{item.title}</Text>
                            <Text style={styles.alertMessage}>{item.message}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50,
        paddingHorizontal: SPACING.m,
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        fontWeight: 'bold',
        marginBottom: SPACING.l,
        color: COLORS.text,
    },
    list: {
        gap: SPACING.m,
    },
    alertCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: SPACING.m,
        // Add shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    content: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    alertMessage: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
    }
});

export default AlertsScreen;
