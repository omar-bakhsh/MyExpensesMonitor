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
        id: 'groceries',
        icon: 'basket',
        color: '#10B981',
        nameAr: 'مقاضي وتموينات',
        nameEn: 'Groceries'
    },
    {
        id: 'dining',
        icon: 'restaurant',
        color: '#F59E0B',
        nameAr: 'مطاعم ومقاهي',
        nameEn: 'Dining'
    },
    {
        id: 'transport',
        icon: 'car',
        color: '#3B82F6',
        nameAr: 'نقل وبنزين',
        nameEn: 'Transport'
    },
    {
        id: 'shopping',
        icon: 'cart',
        color: '#EC4899',
        nameAr: 'تسوق',
        nameEn: 'Shopping'
    },
    {
        id: 'utilities',
        icon: 'document-text',
        color: '#8B5CF6',
        nameAr: 'فواتير وخدمات',
        nameEn: 'Utilities'
    },
    {
        id: 'health',
        icon: 'medical',
        color: '#EF4444',
        nameAr: 'صحة',
        nameEn: 'Health'
    },
    {
        id: 'entertainment',
        icon: 'game-controller',
        color: '#F97316',
        nameAr: 'ترفيه',
        nameEn: 'Entertainment'
    },
    {
        id: 'travel',
        icon: 'airplane',
        color: '#14B8A6',
        nameAr: 'سفر وسياحة',
        nameEn: 'Travel'
    },
    {
        id: 'Education',
        icon: 'school',
        color: '#6366F1',
        nameAr: 'تعليم',
        nameEn: 'Education'
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
