import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translations.json';
import esTranslations from './locales/es/translations.json';
import frTranslations from './locales/fr/translations.json';

// Get saved language from localStorage or default to 'en'
const getStoredLanguage = () => {
  const stored = localStorage.getItem('i18nextLng');
  if (stored && ['en', 'es', 'fr'].includes(stored)) {
    return stored;
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

