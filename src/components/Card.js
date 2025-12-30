import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../utils/theme';

const Card = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.light,
    },
});

export default Card;
