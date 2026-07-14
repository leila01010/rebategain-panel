import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from '@/i18n.js'
import { copy } from '@/directives'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.directive('copy', copy)

router.isReady().then(() => app.mount('#app'))
