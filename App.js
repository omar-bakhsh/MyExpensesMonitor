import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listeners
    let subscription;
    let responseSubscription;

    if (Notifications.addNotificationReceivedListener) {
      subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification Received:', notification);
      });
    }

    if (Notifications.addNotificationResponseReceivedListener) {
      responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification Response:', response);
      });
    }

    return () => {
      subscription?.remove();
      responseSubscription?.remove();
    };
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
