# 💰 Masrofati (مصروفاتي)

> **Your Personal Finance Command Center.**  
> Automatically track expenses, link bank accounts, and visualize your financial health.

![App Logo](./assets/icon.png)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://www.android.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 📖 Overview

**Masrofati** is a smart, localized personal finance application designed to make expense tracking effortless. Unlike manual trackers, Masrofati integrates directly with your **SMS messages** to automatically detect, parse, and categorize transactions from major banks (AlRajhi, SNB, STC Pay, and more).

With full **Arabic & English** support (RTL/LTR), it provides deep insights into your spending habits through beautiful, interactive charts.

---

## ✨ Key Features

### 🤖 Automatic SMS Scanning
- **Native Integration**: Scans your SMS inbox for transaction messages.
- **Smart Parsing**: Automatically extracts Amount, Merchant, and Date.
- **Privacy First**: All processing happens locally on your device.

### 🏦 Bank Integration
- **Bank Linking**: Link cards to specific banks.
- **Supported Banks**: Pre-configured support for **AlRajhi, SNB, Alinma, STC Pay, UrPay**, and more.
- **Custom Branding**: Visual cards matching official bank colors.

### 📊 Powerful Analytics
- **Interactive Charts**: Monthly spending trends and category breakdowns.
- **Merchant Stats**: See exactly how much you spend at "HungerStation" or "Starbucks".
- **Historical Reports**: Browse financial hisory up to 6 months back.

### 🔔 Smart Notifications
- **Daily Reminders**: Never forget to check your daily spending.
- **Budget Alerts**: Get notified when you exceed category limits (e.g., "Grocery Limit Reached").

### 🌍 Localization
- **Bilingual Interface**: Seamless switching between **Arabic** (RTL) and **English** (LTR).
- **Currency Support**: Formatted for SAR (Saudi Riyal) and other local currencies.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+)
- **React Native** environment setup
- **Android Device** or Emulator (for SMS features)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/momoamoory/myexpensesmonitor.git
    cd myexpensesmonitor
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the App**
    ```bash
    npx expo start
    ```

> **Note**: To test SMS Scanning, you **MUST** run a Development Build, as Expo Go does not support native SMS modules.

---

## 🏗️ Building the APK

We use **EAS (Expo Application Services)** for building the release APK.

1.  **Install EAS CLI**
    ```bash
    npm install -g eas-cli
    ```

2.  **Run Cloud Build**
    ```bash
    npx eas-cli build -p android --profile preview
    ```

3.  **Download**: Once complete, install the provided `.apk` on your Android device.

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 52)
- **State Management**: Zustand
- **Database**: Expo SQLite
- **Storage**: AsyncStorage
- **Charts**: react-native-gifted-charts
- **Notifications**: expo-notifications

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

---

Made with ❤️ by kayan.dev
