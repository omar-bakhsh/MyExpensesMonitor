import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/theme';
import { useTranslation } from '../store';

const SearchBar = ({ onSearch, onFilterPress }) => {
    const { t, isRTL } = useTranslation();
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
        onSearch(text);
    };

    const clearSearch = () => {
        setSearchText('');
        onSearch('');
    };

    return (
        <View style={styles.container}>
            <View style={[styles.searchBox, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                <TextInput
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    placeholder={t('searchTransactions')}
                    value={searchText}
                    onChangeText={handleSearch}
                    placeholderTextColor={COLORS.textSecondary}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
            {onFilterPress && (
                <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
                    <Ionicons name="options" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingHorizontal: SPACING.m,
        gap: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.m,
        fontSize: 16,
        color: COLORS.text,
    },
    filterBtn: {
        width: 48,
        height: 48,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});

export default SearchBar;
