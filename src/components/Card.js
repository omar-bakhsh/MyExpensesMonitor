import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../utils/theme';

const Card = ({ children, style, variant = 'elevated' }) => {
    return (
        <View style={[
            styles.card, 
            variant === 'elevated' ? SHADOWS.soft : styles.outlined,
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: SPACING.m,
        marginBottom: SPACING.m,
    },
    outlined: {
        borderWidth: 1.5,
        borderColor: COLORS.border,
    }
});

export default Card;
