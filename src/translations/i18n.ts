import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {TRANSLATIONS_VI} from "./vi/translations";
import {TRANSLATIONS_EN} from "./en/translations";
import {getLocalStorageAuthData} from "../utils/handleLocalStorage";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: TRANSLATIONS_EN
            },
            vi: {
                translation: TRANSLATIONS_VI
            }
        },
        lng: 'en',
        fallbackLng: 'en',
    });

//initialize language getting from local storage
//default is English(en)
i18n.changeLanguage(getLocalStorageAuthData()?.language || 'en');
export default i18n;