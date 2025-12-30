export const TRANSLATIONS = {
    ar: {
        // General
        appName: 'مراقب مصاريفي',
        welcome: 'مرحباً بك،',
        totalBalance: 'الرصيد الكلي',
        budget: 'الميزانية',
        spent: 'المصروف',
        remaining: 'المتبقي',
        recentTransactions: 'آخر العمليات',
        noTransactions: 'لا توجد عمليات بعد.',

        // Actions
        scanSms: 'فحص الرسائل',
        addManual: 'إضافة يدوية',
        save: 'حفظ',
        cancel: 'إلغاء',

        // Navigation
        home: 'الرئيسية',
        alerts: 'تنبيهات',
        offers: 'عروض',
        account: 'حسابي',

        // Add Transaction
        addTransactionTitle: 'إضافة عملية جديدة',
        amount: 'المبلغ (ر.س)',
        merchant: 'المتجر / الوصف',
        category: 'التصنيف',
        uncategorized: 'غير مصنف',

        // Settings
        settingsTitle: 'الإعدادات',
        subscriptions: 'الاشتراكات',
        manageSubscription: 'إدارة الاشتراك',
        bankConnections: 'ربط البنوك',
        manageBudget: 'إدارة الميزانية',
        notifications: 'التنبيهات',
        language: 'اللغة',
        helpCenter: 'مركز المساعدة',
        terms: 'الشروط والأحكام',
        logout: 'تسجيل خروج',

        // Categories
        Travel: 'سفر وسياحة',
        Health: 'صحة',
        International: 'مشتريات دولية',
        Entertainment: 'ترفيه',
        Furniture: 'أثاث',
        Education: 'تعليم',
        Telecom: 'اتصالات',
        Bakery: 'مخابز وحلويات',
        Beauty: 'تجميل',
        Electronics: 'إلكترونيات',
        CarService: 'خدمة سيارات',
        Uncategorized: 'غير محدد',

        // SMS Feature
        permissionRequired: 'إذن مطلوب',
        smsPermissionMessage: 'نحتاج إلى إذن قراءة الرسائل لفحص رسائل البنك.',
        noTransactionsFound: 'لم يتم العثور على عمليات',
        noSmsTransactions: 'لم يتم العثور على رسائل بنكية في الرسائل النصية.',
        success: 'نجح',
        transactionsImported: 'عملية تم استيرادها من الرسائل',
        error: 'خطأ',
        smsScanError: 'فشل فحص الرسائل. يرجى المحاولة مرة أخرى.',

        // Budget & Alerts
        budgetAlert: 'تنبيه الميزانية',
        youveSpent: 'لقد أنفقت',
        ofYourBudget: 'من ميزانيتك',

        // Search
        searchTransactions: 'البحث في العمليات...',
        noSearchResults: 'لا توجد نتائج للبحث',

        // Statistics
        spendingTrend: 'اتجاه الإنفاق',
        categoryStatistics: 'إحصائيات التصنيفات',

        // Goals
        goals: 'الأهداف',
        savingsGoals: 'أهداف الادخار',
        noGoals: 'لا توجد أهداف',
        createFirstGoal: 'أنشئ هدفك الأول',
        createGoal: 'إنشاء هدف',
        editGoal: 'تعديل الهدف',
        deleteGoal: 'حذف الهدف',
        deleteGoalConfirm: 'هل أنت متأكد من حذف هذا الهدف؟',
        goalName: 'اسم الهدف',
        enterGoalName: 'أدخل اسم الهدف',
        targetAmount: 'المبلغ المستهدف',
        currentAmount: 'المبلغ الحالي',
        daysLeft: 'يوم متبقي',
        expired: 'منتهي',
        completed: 'مكتمل',
        goalAchieved: 'تم تحقيق الهدف!',
        icon: 'الأيقونة',
        color: 'اللون',

        // Filters
        advancedFilters: 'فلاتر متقدمة',
        all: 'الكل',
        bank: 'البنك',
        amountRange: 'نطاق المبلغ',
        min: 'الحد الأدنى',
        max: 'الحد الأقصى',
        dateRange: 'نطاق التاريخ',
        today: 'اليوم',
        week: 'أسبوع',
        month: 'شهر',
        year: 'سنة',
        reset: 'إعادة تعيين',
        apply: 'تطبيق',

        // Data Management
        exportData: 'تصدير البيانات',
        importData: 'استيراد البيانات',
        backup: 'نسخ احتياطي',
        restore: 'استعادة',
        exportJSON: 'تصدير JSON',
        exportCSV: 'تصدير CSV',
        createBackup: 'إنشاء نسخة احتياطية',
        restoreBackup: 'استعادة من نسخة احتياطية',
        fillAllFields: 'يرجى ملء جميع الحقول',
        sar: 'ر.س',

        // Bank Selection
        bankSelection: 'اختيار البنوك',
        selectBanks: 'اختر البنوك التي تستخدمها',
        addCustomBank: 'إضافة بنك مخصص',
        customBankName: 'اسم البنك',
        customBankColor: 'لون البنك',
        bankAdded: 'تم إضافة البنك',
        bankRemoved: 'تم إزالة البنك',
        myBanks: 'بنوكي',
        availableBanks: 'البنوك المتاحة',

        // Card Management
        cardManagement: 'إدارة البطاقات',
        myCards: 'بطاقاتي',
        addCard: 'إضافة بطاقة',
        editCard: 'تعديل البطاقة',
        cardNickname: 'اسم البطاقة',
        cardNumber: 'رقم البطاقة',
        lastFourDigits: 'آخر 4 أرقام',
        selectBank: 'اختر البنك',
        cardColor: 'لون البطاقة',
        cardAdded: 'تم إضافة البطاقة',
        cardUpdated: 'تم تحديث البطاقة',
        cardDeleted: 'تم حذف البطاقة',
        deleteCardConfirm: 'هل أنت متأكد من حذف هذه البطاقة؟',
        noCards: 'لا توجد بطاقات',
        addFirstCard: 'أضف بطاقتك الأولى',

        // Category Budget
        categoryBudget: 'ميزانية التصنيفات',
        categoryBudgets: 'ميزانيات التصنيفات',
        setBudget: 'تعيين الميزانية',
        budgetLimit: 'حد الميزانية',
        alertThresholds: 'حدود التنبيه',
        noBudgetSet: 'لم يتم تعيين ميزانية',
        budgetUpdated: 'تم تحديث الميزانية',
        categorySpending: 'إنفاق التصنيف',

        // Merchant Stats
        merchantStats: 'إحصائيات المتاجر',
        topMerchants: 'أكثر المتاجر إنفاقاً',
        merchantFrequency: 'تكرار المتاجر',
        totalSpent: 'إجمالي الإنفاق',
        visits: 'الزيارات',
        noMerchantData: 'لا توجد بيانات للمتاجر',
        timePeriod: 'الفترة الزمنية',

        // Historical Reports
        historicalReports: 'التقارير التاريخية',
        monthlyReports: 'التقارير الشهرية',
        yearlyComparison: 'المقارنة السنوية',
        quarterlyReports: 'التقارير الربعية',
        annualSummary: 'الملخص السنوي',
        exportReport: 'تصدير التقرير',
        noDataAvailable: 'لا توجد بيانات متاحة',
        quarter: 'الربع',
        Q1: 'الربع الأول',
        Q2: 'الربع الثاني',
        Q3: 'الربع الثالث',
        Q4: 'الربع الرابع',
    },
    en: {
        // General
        appName: 'MyExpensesMonitor',
        welcome: 'Welcome back,',
        totalBalance: 'Total Balance',
        budget: 'Budget',
        spent: 'Spent',
        remaining: 'Remaining',
        recentTransactions: 'Recent Transactions',
        noTransactions: 'No transactions yet.',

        // Actions
        scanSms: 'Scan SMS',
        addManual: 'Add Manual',
        save: 'Save',
        cancel: 'Cancel',

        // Navigation
        home: 'Home',
        alerts: 'Alerts',
        offers: 'Offers',
        account: 'Account',

        // Add Transaction
        addTransactionTitle: 'Add Transaction',
        amount: 'Amount (SAR)',
        merchant: 'Merchant / Description',
        category: 'Category',
        uncategorized: 'Uncategorized',

        // Settings
        settingsTitle: 'Settings',
        subscriptions: 'Subscriptions',
        manageSubscription: 'Manage Subscription',
        bankConnections: 'Bank Connections',
        manageBudget: 'Manage Budget',
        notifications: 'Notifications',
        language: 'Language',
        helpCenter: 'Help Center',
        terms: 'Terms & Conditions',
        logout: 'Logout',

        // Categories
        Travel: 'Travel',
        Health: 'Health',
        International: 'International',
        Entertainment: 'Entertainment',
        Furniture: 'Furniture',
        Education: 'Education',
        Telecom: 'Telecom',
        Bakery: 'Bakery',
        Beauty: 'Beauty',
        Electronics: 'Electronics',
        CarService: 'Car Service',
        Uncategorized: 'Uncategorized',

        // SMS Feature
        permissionRequired: 'Permission Required',
        smsPermissionMessage: 'SMS permission is required to scan transaction messages.',
        noTransactionsFound: 'No Transactions Found',
        noSmsTransactions: 'No bank transaction messages were found in your SMS.',
        success: 'Success',
        transactionsImported: 'transactions imported from SMS',
        error: 'Error',
        smsScanError: 'Failed to scan SMS messages. Please try again.',

        // Budget & Alerts
        budgetAlert: 'Budget Alert',
        youveSpent: 'You\'ve spent',
        ofYourBudget: 'of your budget',

        // Search
        searchTransactions: 'Search transactions...',
        noSearchResults: 'No search results found',

        // Statistics
        spendingTrend: 'Spending Trend',
        categoryStatistics: 'Category Statistics',

        // Goals
        goals: 'Goals',
        savingsGoals: 'Savings Goals',
        noGoals: 'No goals yet',
        createFirstGoal: 'Create your first goal',
        createGoal: 'Create Goal',
        editGoal: 'Edit Goal',
        deleteGoal: 'Delete Goal',
        deleteGoalConfirm: 'Are you sure you want to delete this goal?',
        goalName: 'Goal Name',
        enterGoalName: 'Enter goal name',
        targetAmount: 'Target Amount',
        currentAmount: 'Current Amount',
        daysLeft: 'days left',
        expired: 'Expired',
        completed: 'Completed',
        goalAchieved: 'Goal Achieved!',
        icon: 'Icon',
        color: 'Color',

        // Filters
        advancedFilters: 'Advanced Filters',
        all: 'All',
        bank: 'Bank',
        amountRange: 'Amount Range',
        min: 'Min',
        max: 'Max',
        dateRange: 'Date Range',
        today: 'Today',
        week: 'Week',
        month: 'Month',
        year: 'Year',
        reset: 'Reset',
        apply: 'Apply',

        // Data Management
        exportData: 'Export Data',
        importData: 'Import Data',
        backup: 'Backup',
        restore: 'Restore',
        exportJSON: 'Export JSON',
        exportCSV: 'Export CSV',
        createBackup: 'Create Backup',
        restoreBackup: 'Restore from Backup',
        fillAllFields: 'Please fill all fields',
        sar: 'SAR',

        // Bank Selection
        bankSelection: 'Bank Selection',
        selectBanks: 'Select banks you use',
        addCustomBank: 'Add Custom Bank',
        customBankName: 'Bank Name',
        customBankColor: 'Bank Color',
        bankAdded: 'Bank Added',
        bankRemoved: 'Bank Removed',
        myBanks: 'My Banks',
        availableBanks: 'Available Banks',

        // Card Management
        cardManagement: 'Card Management',
        myCards: 'My Cards',
        addCard: 'Add Card',
        editCard: 'Edit Card',
        cardNickname: 'Card Nickname',
        cardNumber: 'Card Number',
        lastFourDigits: 'Last 4 Digits',
        selectBank: 'Select Bank',
        cardColor: 'Card Color',
        cardAdded: 'Card Added',
        cardUpdated: 'Card Updated',
        cardDeleted: 'Card Deleted',
        deleteCardConfirm: 'Are you sure you want to delete this card?',
        noCards: 'No cards yet',
        addFirstCard: 'Add your first card',

        // Category Budget
        categoryBudget: 'Category Budget',
        categoryBudgets: 'Category Budgets',
        setBudget: 'Set Budget',
        budgetLimit: 'Budget Limit',
        alertThresholds: 'Alert Thresholds',
        noBudgetSet: 'No budget set',
        budgetUpdated: 'Budget Updated',
        categorySpending: 'Category Spending',

        // Merchant Stats
        merchantStats: 'Merchant Statistics',
        topMerchants: 'Top Merchants',
        merchantFrequency: 'Merchant Frequency',
        totalSpent: 'Total Spent',
        visits: 'Visits',
        noMerchantData: 'No merchant data available',
        timePeriod: 'Time Period',

        // Historical Reports
        historicalReports: 'Historical Reports',
        monthlyReports: 'Monthly Reports',
        yearlyComparison: 'Yearly Comparison',
        quarterlyReports: 'Quarterly Reports',
        annualSummary: 'Annual Summary',
        exportReport: 'Export Report',
        noDataAvailable: 'No data available',
        quarter: 'Quarter',
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4',
    }
};
