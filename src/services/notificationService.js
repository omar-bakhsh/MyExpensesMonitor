import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in foreground
if (Notifications && Notifications.setNotificationHandler) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

/**
 * Register for Push Notifications
 * Returns the token if successful
 */
export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android' && Notifications.setNotificationChannelAsync) {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance?.MAX || 4,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted' && Notifications.requestPermissionsAsync) {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return null;
        }

        // Get the token (for remote push) - currently we mostly use local
        try {
            if (Notifications.getExpoPushTokenAsync) {
                const expoToken = await Notifications.getExpoPushTokenAsync();
                token = expoToken?.data;
            }
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
    if (!Notifications || !Notifications.scheduleNotificationAsync) return;
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: {
                seconds,
                type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL || 'timeInterval',
            },
        });
    } catch (e) { console.log('Notification Err:', e); }
}

/**
 * Schedule a daily reminder
 * @param {number} hour 
 * @param {number} minute 
 */
export async function scheduleDailyReminder(hour = 20, minute = 0) {
    if (!Notifications || !Notifications.scheduleNotificationAsync) return;
    // Cancel existing reminders first to avoid duplicates
    await cancelAllNotifications();

    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Daily Expense Check 💸",
                body: "Don't forget to log your expenses for today!",
            },
            trigger: {
                hour,
                minute,
                repeats: true,
                type: Notifications.SchedulableTriggerInputTypes?.DAILY || 'daily',
            },
        });
    } catch (e) { console.log('Daily Reminder Err:', e); }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
    if (Notifications && Notifications.cancelAllScheduledNotificationsAsync) {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
}

export default {
    registerForPushNotificationsAsync,
    scheduleNotification,
    scheduleDailyReminder,
    cancelAllNotifications
};
