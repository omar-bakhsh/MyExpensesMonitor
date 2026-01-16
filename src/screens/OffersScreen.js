import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../utils/theme';
import { useTranslation } from '../store';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

const OffersScreen = () => {
    const { t, isRTL } = useTranslation();

    const offers = [
        {
            id: '1',
            titleAr: 'تخفيضات الصيف',
            titleEn: 'Summer Sale',
            descriptionAr: 'خصم يصل إلى 50% على جميع الإلكترونيات من جرير',
            descriptionEn: 'Get up to 50% off on all electronics at Jarir',
            discount: '50%',
            validUntil: '2025-01-31',
            categoryAr: 'إلكترونيات',
            categoryEn: 'Electronics',
            color: '#4F46E5',
            icon: 'laptop-outline'
        },
        {
            id: '2',
            titleAr: 'عروض السفر',
            titleEn: 'Travel Deals',
            descriptionAr: 'احجز رحلتك القادمة عبر المسافر ووفر 30%',
            descriptionEn: 'Book your next trip via Almosafer and save 30%',
            discount: '30%',
            validUntil: '2025-02-15',
            categoryAr: 'سفر',
            categoryEn: 'Travel',
            color: '#10B981',
            icon: 'airplane-outline'
        },
        {
            id: '3',
            titleAr: 'المطاعم والوجبات',
            titleEn: 'Food & Dining',
            descriptionAr: 'استمتع بكاش باك 25% لدى مطاعم مختارة عبر هنقرستيشن',
            descriptionEn: 'Enjoy 25% cashback at selected restaurants via HungerStation',
            discount: '25%',
            validUntil: '2025-01-25',
            categoryAr: 'طعام',
            categoryEn: 'Food',
            color: '#F59E0B',
            icon: 'fast-food-outline'
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.title}>{t('offers')}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{offers.length} {isRTL ? 'متاح' : 'Available'}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {offers.map((offer) => (
                    <Card key={offer.id} style={styles.offerCard} variant="elevated">
                        <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.iconBox, { backgroundColor: offer.color + '15' }]}>
                                <Ionicons name={offer.icon} size={28} color={offer.color} />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: SPACING.m }}>
                                <Text style={[styles.offerCategory, { textAlign: isRTL ? 'right' : 'left' }]}>
                                    {isRTL ? offer.categoryAr : offer.categoryEn}
                                </Text>
                                <Text style={[styles.offerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                                    {isRTL ? offer.titleAr : offer.titleEn}
                                </Text>
                            </View>
                            <View style={[styles.discountTag, { backgroundColor: offer.color }]}>
                                <Text style={styles.discountNum}>{offer.discount}</Text>
                                <Text style={styles.discountLabel}>{isRTL ? 'خصم' : 'OFF'}</Text>
                            </View>
                        </View>

                        <Text style={[styles.description, { textAlign: isRTL ? 'right' : 'left' }]}>
                            {isRTL ? offer.descriptionAr : offer.descriptionEn}
                        </Text>

                        <View style={styles.divider} />

                        <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.validity, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Ionicons name="calendar-outline" size={16} color={COLORS.textMuted} />
                                <Text style={styles.validityText}>
                                    {isRTL ? 'حتى' : 'Until'} {new Date(offer.validUntil).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                                </Text>
                            </View>
                            <TouchableOpacity style={[styles.claimBtn, { backgroundColor: offer.color }]}>
                                <Text style={styles.claimText}>{isRTL ? 'استفد الآن' : 'Claim Now'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}
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
    badge: {
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    content: {
        padding: SPACING.m,
    },
    offerCard: {
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderRadius: 24,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    offerCategory: {
        fontSize: 12,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    offerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 2,
    },
    discountTag: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discountNum: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    discountLabel: {
        fontSize: 10,
        color: COLORS.white,
        fontWeight: 'bold',
        opacity: 0.9,
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: SPACING.m,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.surfaceVariant,
        marginBottom: SPACING.m,
    },
    cardFooter: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    validity: {
        alignItems: 'center',
        gap: 6,
    },
    validityText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    claimBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    claimText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default OffersScreen;
