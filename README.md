# 📊 Masrofati (مصروفاتي) - Smart Expense Monitor

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.31-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Masrofati** is a premium, open-source personal finance management application built with React Native and Expo. It empowers users to track their spending automatically by scanning bank SMS messages, managing budgets, and visualizing financial health through advanced analytics.

---

## 🌍 Language Support / دعم اللغات
Fully supports **English (LTR)** and **Arabic (RTL)** with a seamless toggle in settings.
يدعم التطبيق **اللغة العربية (من اليمين لليسار)** و **الإنجليزية** بشكل كامل مع إمكانية التبديل من الإعدادات.

---

## ✨ Key Features / المميزات الرئيسية

### 🇸🇦 Optimized for Saudi & Gulf Banks / مخصص للبنوك السعودية والخليجية
*   **Auto SMS Scanning:** Automatically detects and parses transaction messages from major banks (Al Rajhi, SNB, Riyad, STC Pay, etc.).
*   **سحب الرسائل التلقائي:** التعرف التلقائي على رسائل العمليات من البنوك الكبرى (الراجحي، الأهلي، الرياض، STC Pay وغيرهم).

### 📈 Financial Intelligence / الذكاء المالي
*   **Dynamic Charts:** Visual 6-month trends and category-wise spending distribution.
*   **إحصائيات ذكية:** رسوم بيانية توضح توجه الصرف خلال 6 أشهر وتوزيعه حسب التصنيفات.
*   **Merchant Analytics:** Detailed statistics on where you spend most (Top Merchants).
*   **تحليل المتاجر:** إحصائيات دقيقية حول أكثر المتاجر التي تستهلك ميزانيتك.

### 💰 Budget & Goals / الميزانية والأهداف
*   **Smart Budgeting:** Set monthly limits and receive alerts when reaching thresholds (50%, 75%, 90%).
*   **ميزانية ذكية:** تعيين حدود شهرية مع تنبيهات عند استهلاك (50%، 75%، 90%) من الميزانية.
*   **Savings Goals:** Track progress towards your financial milestones with visual progress bars.
*   **أهداف الادخار:** تتبع أهدافك المالية مع واجهة بصرية لمراقبة التقدم.

### 📄 Professional Reporting / التقارير الاحترافية
*   **Export Data:** Generate professional PDF and Excel reports for your financial history.
*   **تصدير التقرير:** استخراج تقارير احترافية بصيغة PDF و Excel لتاريخك المالي.

---

## 🛠 Tech Stack / التقنيات المستخدمة
*   **Framework:** React Native (Expo)
*   **State Management:** Zustand (Fast & Lightweight)
*   **Database:** Expo SQLite & AsyncStorage
*   **Charts:** React Native Chart Kit
*   **Styling:** Custom Design System (Modern & Minimalist)

---

## 🚀 Getting Started / ابدأ الآن

### Prerequisites / المتطلبات
*   Node.js (v18 or newer)
*   Expo Go (for testing) or Android Studio (for Dev Builds)

### Installation / التثبيت
1.  Clone the repository:
    ```bash
    git clone https://github.com/omar-bakhsh/MyExpensesMonitor.git
    cd MyExpensesMonitor
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npx expo start
    ```

> **Note:** SMS Scanning requires a **Development Build** due to native Android permissions. Run `npx expo run:android` to build.

---

## 🛡 Privacy & Security / الخصوصية والأمان
All your financial data is stored **locally** on your device. We do not use external servers to process your SMS or transaction history. Your privacy is our priority.
جميع بياناتك المالية تُحفظ **محلياً** على جهازك. لا نستخدم خوادم خارجية لمعالجة رسائلك أو تاريخ عملياتك. خصوصيتك هي أولويتنا.

---

## 👨‍💻 Developed By / تطوير
**Omar Bakhsh** - [@omar-bakhsh](https://github.com/omar-bakhsh)
Developed at **Kayan Platform**.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
