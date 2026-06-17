import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 12 languages support
import en from '@/translations/en.json';
import ru from '@/translations/ru.json';
import kk from '@/translations/kk.json';
import es from '@/translations/es.json';
import de from '@/translations/de.json';
import fr from '@/translations/fr.json';
import zh from '@/translations/zh.json';
import ja from '@/translations/ja.json';
import ar from '@/translations/ar.json';
import tr from '@/translations/tr.json';
import pt from '@/translations/pt.json';
import it from '@/translations/it.json';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false },
  { code: 'ja', name: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'pt', name: 'Português', flag: '🇧🇷', rtl: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false },
];

export const DEFAULT_LANGUAGE = 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kk: { translation: kk },
    es: { translation: es },
    de: { translation: de },
    fr: { translation: fr },
    zh: { translation: zh },
    ja: { translation: ja },
    ar: { translation: ar },
    tr: { translation: tr },
    pt: { translation: pt },
    it: { translation: it },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;

// Helper to get language direction
export const isRTL = (langCode: string) => {
  const lang = LANGUAGES.find((l) => l.code === langCode);
  return lang?.rtl || false;
};

// Helper to get language by code
export const getLanguage = (code: string) => {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
};
