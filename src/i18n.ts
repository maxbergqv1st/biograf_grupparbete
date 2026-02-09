import * as translationEN from '@/locales/en/index';
import * as translationSV from '@/locales/sv/index';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = ['en', 'sv'];

const resources = {
  en: { translation: translationEN },
  sv: { translation: translationSV },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: LANGUAGES,
});

export default i18next;
