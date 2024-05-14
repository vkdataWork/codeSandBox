import {createI18n} from 'vue-i18n';
import { locale as dxLocale } from "devextreme/localization";
import en from '@/Plugins/I18n/Locales/en.json';
import cz from '@/Plugins/I18n/Locales/cz.json';

const messagesEn = {
    en: en
};
const messagesCz = {
    cz: cz
};

const index = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: messagesEn
})

dxLocale('cs');

export default index;