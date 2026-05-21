import { createI18n } from 'vue-i18n'
import fa from './locales/fa/index.js'
import en from './locales/en/index.js'
import { localize } from './lib/moment.js'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { fa, en }
})

// moment defaults to 'fa' — align its calendar with the initial UI locale
localize(i18n.global.locale.value)
