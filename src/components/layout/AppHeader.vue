<script setup>
import { IrIcon } from '@/lib/ui-kit'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localize } from '@/lib/moment.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const { locale } = useI18n()
const { t } = useI18n()

const emit = defineEmits(['toggle-sidebar'])

const PageTitle = computed(() => {
  return t(`common.routes.${route.name}`)
})

function setLanguage(lang) {
  locale.value = lang
  localize(lang)
  const dir = ['fa', 'ar', 'he'].includes(lang) ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang)
}
</script>

<template>
  <header class="topbar">
    <button
      class="topbar__menu-btn"
      @click="emit('toggle-sidebar')"
      aria-label="Toggle menu"
    >
      <IrIcon name="menu" />
    </button>
    <div class="topbar__title">{{ PageTitle }}</div>
    <div class="topbar__spacer" />
    <div class="topbar__actions">
      <button class="space-x-2 cursor-pointer">
        <span @click="setLanguage('en')">En</span>
        <span>/</span>
        <span @click="setLanguage('fa')">Fa</span>
      </button>
    </div>
  </header>
</template>

<style>
.topbar {
  height: var(--header-height);
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--color-blue-20);
  border-left: 1px solid var(--color-blue-20);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 16px;
  flex-shrink: 0;
  transition: background var(--transition);
}

.topbar__title {
  font-size: 14px;
  color: var(--color-dark-blue-500);
}

.topbar__menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  color: var(--color-dark-blue-5);
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.topbar__spacer { flex: 1; }

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 767px) {
  .topbar {
    height: var(--mobile-header-height);
    padding: 0 16px;
    border-left: none;
    box-shadow: 0 4px 8px 0 #7E8AA626;
  }
}
</style>
