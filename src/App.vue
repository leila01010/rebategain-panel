<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BlankLayout from '@/layouts/blankLayout.vue'
import DefaultLayout from '@/layouts/defaultLayout.vue'
import { IrLoadingOverlay } from '@/lib/ui-kit'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localize } from '@/lib/moment.js'
import { useUserStore } from '@/stores/user.js'

const route = useRoute()
const { locale } = useI18n()
const { loading, isLoaded } = storeToRefs(useUserStore())

const layouts = {
  default: DefaultLayout,
  blank: BlankLayout,
}

const appIndex = ref(1)

const layout = computed(() => layouts[route.meta.layout] || DefaultLayout)

const showOverlay = computed(() => loading.value && !isLoaded.value)

watch(locale, (newLang) => {
  const isRTL = ['fa', 'ar', 'he'].includes(newLang)

  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = newLang
  localize(newLang)
  appIndex.value += 1
}, { immediate: true })
</script>

<template>
  <div id="app" :key="appIndex">
    <IrLoadingOverlay v-if="showOverlay" fullscreen />
    <component v-else :is="layout">
      <RouterView />
    </component>
  </div>
</template>
