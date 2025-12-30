import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import { useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

const OffersScreen = () => {
    const { t, isRTL } = useTranslation();

    // Mock offers data
    const offers = [
        {
            id: '1',
            title: 'Summer Sale',
            description: 'Get 50% off on all electronics',
            discount: '50%',
            validUntil: '2025-01-31',
            category: 'Electronics',
            color: '#4F46E5'
        },
        {
            id: '2',
            title: 'Travel Deals',
            description: 'Book your next trip and save 30%',
            discount: '30%',
            validUntil: '2025-02-15',
            category: 'Travel',
            color: '#10B981'
        },
        {
            id: '3',
            title: 'Food & Dining',
            description: 'Enjoy 25% cashback at selected restaurants',
            discount: '25%',
            validUntil: '2025-01-25',
            category: 'Food',
            color: '#F59E0B'
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>{t('offers')}</Text>
            <ScrollView contentContainerStyle={styles.content}>
                {offers.map((offer) => (
                    <Card key={offer.id} style={styles.offerCard}>
                        <View style={[styles.offerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.discountBadge, { backgroundColor: offer.color }]}>
                                <Text style={styles.discountText}>{offer.discount}</Text>
                                <Text style={styles.offText}>OFF</Text>
                            </View>
                            <View style={[styles.offerInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.offerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{offer.title}</Text>
                                <Text style={[styles.offerCategory, { textAlign: isRTL ? 'right' : 'left' }]}>{offer.category}</Text>
                            </View>
                        </View>
                        <Text style={[styles.offerDescription, { textAlign: isRTL ? 'right' : 'left' }]}>{offer.description}</Text>
                        <View style={[styles.offerFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.validityContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.validityText}>Valid until {new Date(offer.validUntil).toLocaleDateString()}</Text>
                            </View>
                            <TouchableOpacity style={styles.claimBtn}>
                                <Text style={styles.claimBtnText}>Claim</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}
            </ScrollView>
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
    content: {
        paddingBottom: SPACING.l,
    },
    offerCard: {
        marginBottom: SPACING.m,
    },
    offerHeader: {
        alignItems: 'center',
        marginBottom: SPACING.m,
        gap: SPACING.m,
    },
    discountBadge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.surface,
    },
    offText: {
        fontSize: 12,
        color: COLORS.surface,
        fontWeight: '600',
    },
    offerInfo: {
        flex: 1,
    },
    offerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    offerCategory: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    offerDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        lineHeight: 20,
    },
    offerFooter: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    validityContainer: {
        alignItems: 'center',
        gap: 4,
    },
    validityText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    claimBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 8,
    },
    claimBtnText: {
        color: COLORS.surface,
        fontWeight: '600',
        fontSize: 14,
    },
});

export default OffersScreen;
