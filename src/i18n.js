import { createI18n } from 'vue-i18n'
import fa from './locales/fa/index.js'
import en from './locales/en/index.js'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { fa, en }
})
