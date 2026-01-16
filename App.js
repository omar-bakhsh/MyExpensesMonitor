import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from 'expo-local-authentication';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import { useUserStore } from './src/store';
import { COLORS, SPACING } from './src/utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const { settings } = useUserStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    registerForPushNotificationsAsync();

    if (settings?.biometricsEnabled) {
      handleAuthentication();
    } else {
      setIsUnlocked(true);
      setIsAuthenticating(false);
    }

    // Listeners ... (keep existing listener logic if needed or clean up)
  }, []);

  const handleAuthentication = async () => {
    try {
      setIsAuthenticating(true);
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsUnlocked(true);
        setIsAuthenticating(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'الدخول إلى تطبيق مدير المصاريف',
        cancelLabel: 'إلغاء',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    } catch (e) {
      console.error(e);
      setIsUnlocked(true); // Fallback to avoid locking user out if error
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return (
      <View style={styles.lockContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isUnlocked && settings?.biometricsEnabled) {
    return (
      <View style={styles.lockContainer}>
        <Ionicons name="lock-closed" size={80} color={COLORS.primary} />
        <Text style={styles.lockText}>التطبيق مقفل</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={handleAuthentication}>
          <Text style={styles.retryText}>فتح التطبيق</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  lockContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 40,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 16,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
