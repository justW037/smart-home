import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from './src/locales/en.json'
import vi from './src/locales/vi.json'
import ja from './src/locales/ja.json'
import ko from './src/locales/ko.json'
import zh from './src/locales/zh.json'
import tw from './src/locales/zh-tw.json'

const resources = {
  'en': { translation: en },
  'vi': { translation: vi },
  'ja': { translation: ja },
  'ko': {translation: ko},
  'zh': {translation: zh},
  'tw': {translation: tw}
}

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language')

  if (!savedLanguage) {
    savedLanguage = 'en'
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: savedLanguage,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  })
}

initI18n()

export default i18n
