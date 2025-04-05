import { formatDistance } from 'date-fns';
import { enUS as dateEn } from 'date-fns/locale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import { selectLanguageCode, selectLocale } from './rdx/app/selectors';
import { store, useAppSelector } from './rdx/store';

export const DATE_LOCALES = {
  en: dateEn,
};

export type LangKey = 'en';

export type Lang = {
  key: LangKey;
  value: string;
};

export const LANGUAGES: Lang[] = [{ key: 'en', value: 'English' }];

export const LANGUAGE_CODES = LANGUAGES.map(lang => lang.key);

// export const LANGUAGES = ['en', 'es', 'fr', 'ja', 'ko', 'zh-CN', 'zh-TW'];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  compatibilityJSON: 'v3',

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;

export const useLanguage = () => {
  const languageCode = useAppSelector(selectLanguageCode);
  const locale = useAppSelector(selectLocale);

  const lang = languageCode || locale?.currencyCode || 'en';

  return lang as LangKey;
};

export const getLanguage = () => {
  const state = store.getState();
  const languageCode = selectLanguageCode(state);
  const locale = selectLocale(state);

  const lang = languageCode || locale?.currencyCode || 'en';

  return lang as LangKey;
};

export const useFormatDistance = (dateMs: number) => {
  const language = useLanguage();

  return formatDistance(new Date(dateMs), new Date(), {
    addSuffix: true,
    locale: DATE_LOCALES[language],
  });
};
