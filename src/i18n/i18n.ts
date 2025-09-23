import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Use generated ESM module to avoid require() in ESM builds
import en from "./generated-en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
