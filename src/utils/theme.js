export const COLORS = {
    primary: '#6366F1', // Indigo 500
    primaryDark: '#4F46E5', // Indigo 600
    secondary: '#10B981', // Emerald 500
    background: '#FDFDFF', // Very light lavender tinted white
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6', // Gray 100
    text: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    textMuted: '#94A3B8', // Slate 400
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    border: '#E2E8F0', // Slate 200
    overlay: 'rgba(15, 23, 42, 0.6)', 
    white: '#FFFFFF',
    black: '#000000',
    primaryGradient: ['#6366F1', '#818CF8'],
    successGradient: ['#10B981', '#34D399'],
    errorGradient: ['#EF4444', '#F87171'],
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const FONTS = {
    regular: 'System',
    bold: 'System',
    medium: 'System',
    semiBold: 'System',
};

export const SHADOWS = {
    none: {
        shadowColor: 'transparent',
        elevation: 0,
    },
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    light: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    dark: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },
};
