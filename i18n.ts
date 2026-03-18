import * as en from '@/locales/en/index';
import * as sv from '@/locales/sv/index';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = ['en', 'sv'];

const resources = {
  en,
  sv,
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'sv',
  fallbackLng: 'sv',
  defaultNS: 'common',
  supportedLngs: LANGUAGES,
});

export default i18next;
