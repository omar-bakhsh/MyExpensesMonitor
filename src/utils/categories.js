import { COLORS } from './theme';

/**
 * Category configuration with icons and colors
 * Each category has:
 * - id: unique identifier (English key)
 * - icon: Ionicons icon name
 * - color: category color
 * - nameAr: Arabic name
 * - nameEn: English name
 */

export const CATEGORIES = [
    {
        id: 'Uncategorized',
        icon: 'help-circle',
        color: '#9CA3AF',
        nameAr: 'غير محدد',
        nameEn: 'Uncategorized'
    },
    {
        id: 'Education',
        icon: 'school',
        color: '#3B82F6',
        nameAr: 'تعليم',
        nameEn: 'Education'
    },
    {
        id: 'Telecom',
        icon: 'call',
        color: '#8B5CF6',
        nameAr: 'اتصالات',
        nameEn: 'Telecom'
    },
    {
        id: 'Bakery',
        icon: 'cafe',
        color: '#F59E0B',
        nameAr: 'مخابز وحلويات',
        nameEn: 'Bakery'
    },
    {
        id: 'Beauty',
        icon: 'sparkles',
        color: '#EC4899',
        nameAr: 'تجميل',
        nameEn: 'Beauty'
    },
    {
        id: 'Electronics',
        icon: 'laptop',
        color: '#6366F1',
        nameAr: 'إلكترونيات',
        nameEn: 'Electronics'
    },
    {
        id: 'CarService',
        icon: 'car',
        color: '#EF4444',
        nameAr: 'خدمة سيارات',
        nameEn: 'Car Service'
    },
    {
        id: 'Travel',
        icon: 'airplane',
        color: '#14B8A6',
        nameAr: 'سفر وسياحة',
        nameEn: 'Travel'
    },
    {
        id: 'Health',
        icon: 'medical',
        color: '#10B981',
        nameAr: 'صحة',
        nameEn: 'Health'
    },
    {
        id: 'International',
        icon: 'globe',
        color: '#06B6D4',
        nameAr: 'مشتريات دولية',
        nameEn: 'International'
    },
    {
        id: 'Entertainment',
        icon: 'game-controller',
        color: '#F97316',
        nameAr: 'ترفيه',
        nameEn: 'Entertainment'
    },
    {
        id: 'Furniture',
        icon: 'bed',
        color: '#84CC16',
        nameAr: 'أثاث',
        nameEn: 'Furniture'
    }
];

/**
 * Get category by ID
 */
export const getCategoryById = (id) => {
    return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
};

/**
 * Get category name by language
 */
export const getCategoryName = (id, language = 'ar') => {
    const category = getCategoryById(id);
    return language === 'ar' ? category.nameAr : category.nameEn;
};

/**
 * Get all category IDs
 */
export const getCategoryIds = () => {
    return CATEGORIES.map(cat => cat.id);
};

export default CATEGORIES;
