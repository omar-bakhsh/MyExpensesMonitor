export const COLORS = {
    primary: '#4F46E5', // Indigo 600
    secondary: '#10B981', // Emerald 500
    background: '#F9FAFB', // Gray 50
    surface: '#FFFFFF',
    text: '#1F2937', // Gray 800
    textSecondary: '#6B7280', // Gray 500
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    border: '#E5E7EB',
    overlay: 'rgba(0,0,0,0.5)',
    // Gradients or special accents can be added here
    primaryGradient: ['#4F46E5', '#818CF8'], // For LinearGradient usage
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
};

export const FONTS = {
    // Assuming default system fonts for now, but configured for easy swap
    regular: 'System',
    bold: 'System',
    medium: 'System',
    // In a real app with custom fonts (Cairo/Tajawal), we'd map them here after loading
};

export const SHADOWS = {
    light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
};
