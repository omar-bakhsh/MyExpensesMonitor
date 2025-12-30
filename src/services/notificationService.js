import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Register for Push Notifications
 * Returns the token if successful
 */
export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return null;
        }

        // Get the token (for remote push) - currently we mostly use local
        try {
            // Attempt to get token - if projectId is missing in app.json, this might throw
            // but we catch it below.
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch (innerError) {
            // Suppress validation error for dummy projectId in dev/local mode
            if (!innerError.message.includes('VALIDATION_ERROR')) {
                console.log('Error getting push token:', innerError);
            }
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

/**
 * Schedule a local notification
 * @param {string} title 
 * @param {string} body 
 * @param {number} seconds - seconds from now
 */
export async function scheduleNotification(title, body, seconds = 1) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger: {
            seconds,
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
    });
}

/**
 * Schedule a daily reminder
 * @param {number} hour 
 * @param {number} minute 
 */
export async function scheduleDailyReminder(hour = 20, minute = 0) {
    // Cancel existing reminders first to avoid duplicates
    await cancelAllNotifications();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Daily Expense Check 💸",
            body: "Don't forget to log your expenses for today!",
        },
        trigger: {
            hour,
            minute,
            repeats: true,
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
    });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export default {
    registerForPushNotificationsAsync,
    scheduleNotification,
    scheduleDailyReminder,
    cancelAllNotifications
};
