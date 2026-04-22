import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './en.json';
import zh from './zh.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

const LANGUAGE_KEY = 'user-language';

const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        return callback(savedLanguage);
      }
      
      const locale = Localization.getLocales()[0].languageCode;
      callback(locale === 'zh' ? 'zh' : 'en');
    } catch (error) {
      console.log('Error fetching language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {}
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
