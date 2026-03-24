import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../src/constants/Theme';
import { notificationService } from '../src/services/notifications';
import { storage, StorageKeys } from '../src/storage/storageHelper';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [offlineOnly, setOfflineOnly] = useState(false);
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Theme.dark : Theme.light;

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const notifs = await storage.get<boolean>(StorageKeys.NOTIFICATIONS_ENABLED);
        const offline = await storage.get<boolean>(StorageKeys.USE_OFFLINE_ONLY);

        if (notifs !== null) setNotificationsEnabled(notifs);
        if (offline !== null) setOfflineOnly(offline);
    };

    const toggleNotifications = async (value: boolean) => {
        setNotificationsEnabled(value);
        await storage.save(StorageKeys.NOTIFICATIONS_ENABLED, value);
        if (value) {
            await notificationService.scheduleDailyNotification(9, 0);
        }
    };

    const toggleOffline = async (value: boolean) => {
        setOfflineOnly(value);
        await storage.save(StorageKeys.USE_OFFLINE_ONLY, value);
    };

    const SettingRow = ({ label, value, onToggle, description }: any) => (
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
                {description && <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{description}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#f4f3f4'}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <SettingRow
                    label="Daily Notifications"
                    description="Get a new quote every morning at 9:00 AM"
                    value={notificationsEnabled}
                    onToggle={toggleNotifications}
                />
                <SettingRow
                    label="Offline Only Mode"
                    description="Disable API fetching and use the built-in cinematic quote database"
                    value={offlineOnly}
                    onToggle={toggleOffline}
                />

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        Daily Screen Quote v1.0.0
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 24,
        borderBottomWidth: 1,
    },
    settingInfo: {
        flex: 1,
        paddingRight: 20,
    },
    settingLabel: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});
