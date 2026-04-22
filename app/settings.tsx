import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Switch, Text, useColorScheme, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../src/constants/Theme';
import { notificationService } from '../src/services/notifications';
import { storage, StorageKeys } from '../src/storage/storageHelper';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
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

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
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

    const LanguageToggle = () => (
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.language')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{t('settings.language_desc')}</Text>
            </View>
            <View style={styles.languageToggleContainer}>
                <TouchableOpacity 
                    onPress={() => changeLanguage('en')}
                    style={[
                        styles.languageButton, 
                        i18n.language === 'en' && { backgroundColor: '#007AFF' }
                    ]}
                >
                    <Text style={[
                        styles.languageButtonText, 
                        { color: i18n.language === 'en' ? '#fff' : colors.textSecondary }
                    ]}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => changeLanguage('zh')}
                    style={[
                        styles.languageButton, 
                        i18n.language === 'zh' && { backgroundColor: '#007AFF' }
                    ]}
                >
                    <Text style={[
                        styles.languageButtonText, 
                        { color: i18n.language === 'zh' ? '#fff' : colors.textSecondary }
                    ]}>ZH</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <SettingRow
                    label={t('settings.notifications')}
                    description={t('settings.notifications_desc')}
                    value={notificationsEnabled}
                    onToggle={toggleNotifications}
                />
                <SettingRow
                    label={t('settings.offline')}
                    description={t('settings.offline_desc')}
                    value={offlineOnly}
                    onToggle={toggleOffline}
                />
                
                <LanguageToggle />

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        {t('settings.version')}
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
    },
    languageToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 4,
    },
    languageButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    languageButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
    }
});
