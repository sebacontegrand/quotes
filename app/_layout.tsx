import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { notificationService } from '../src/services/notifications';
import '../src/i18n';
import { useTranslation } from 'react-i18next';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      notificationService.registerForPushNotificationsAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="favorites" 
          options={{ 
            headerShown: true, 
            title: t('favorites.title'), 
            headerTransparent: true, 
            headerBlurEffect: 'regular' 
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            headerShown: true, 
            title: t('settings.title'), 
            headerTransparent: true, 
            headerBlurEffect: 'regular' 
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
