<script setup>
import { computed, watch } from 'vue'
import BlankLayout from '@/layouts/blankLayout.vue'
import DefaultLayout from '@/layouts/defaultLayout.vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale } = useI18n()

const layouts = {
  default: DefaultLayout,
  blank: BlankLayout,
}

const layout = computed(() => layouts[route.meta.layout] || DefaultLayout)

watch(locale, (newLang) => {
  const isRTL = ['fa', 'ar', 'he'].includes(newLang)

  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = newLang
}, { immediate: true })
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
