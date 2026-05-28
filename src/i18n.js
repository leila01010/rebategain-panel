import { createI18n } from 'vue-i18n'
import ar from './locales/ar/index.js'
import en from './locales/en/index.js'
import { localize } from './lib/moment.js'
import { storage } from './services/storage.service.js'

const SUPPORTED = ['en', 'ar']
const saved = storage.get('locale')
const initialLocale = SUPPORTED.includes(saved) ? saved : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, ar }
})

localize(i18n.global.locale.value)
