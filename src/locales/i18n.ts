import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import vi from './languages/vi.json';
import en from './languages/en.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4', // Cần thiết để chạy trên Android
  resources: {
    en: { translation: en },
    vi: { translation: vi }
  },
  lng: 'vi', // Mặc định ban đầu là tiếng Việt
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React đã tự bảo mật chống XSS rồi
  },
  debug: false,
});

export default i18n;