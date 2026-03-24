import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
    LAST_FETCHED_DATE: 'daily_quote_last_fetched_date',
    QUOTE_OF_THE_DAY: 'daily_quote_of_the_day',
    FAVORITES: 'daily_quote_favorites',
    USE_OFFLINE_ONLY: 'daily_quote_use_offline_only',
    NOTIFICATIONS_ENABLED: 'daily_quote_notifications_enabled',
    NOTIFICATION_TIME: 'daily_quote_notification_time',
};

export const storage = {
    async save(key: string, value: any): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Storage Save Error:', e);
        }
    },

    async get<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Storage Get Error:', e);
            return null;
        }
    },

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Storage Remove Error:', e);
        }
    },
};
