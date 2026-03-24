import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { storage, StorageKeys } from '../storage/storageHelper';

// On Android, remote notifications were removed from Expo Go in SDK 53+.
// We check if we are running in Expo Go on Android to avoid crashes.
const isAndroidExpoGo = Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: any = null;
if (!isAndroidExpoGo) {
    try {
        Notifications = require('expo-notifications');
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    } catch (e) {
        console.warn('Failed to load expo-notifications:', e);
    }
}

export const notificationService = {
    async registerForPushNotificationsAsync() {
        if (Platform.OS === 'web' || isAndroidExpoGo || !Notifications) return;

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
        } catch (e) {
            console.error('Error in registerForPushNotificationsAsync:', e);
        }
    },

    async scheduleDailyNotification(hour: number, minute: number) {
        if (isAndroidExpoGo || !Notifications) return;

        try {
            await Notifications.cancelAllScheduledNotificationsAsync();

            const enabled = await storage.get<boolean>(StorageKeys.NOTIFICATIONS_ENABLED);
            if (enabled === false) return;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Daily Screen Quote",
                    body: "Open to see today's cinematic inspiration.",
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true,
                } as any,
            });
        } catch (e) {
            console.error('Error in scheduleDailyNotification:', e);
        }
    },
};
