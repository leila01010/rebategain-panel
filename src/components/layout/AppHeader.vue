<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const pageTitle = ref('login')

function setLanguage(lang) {
  locale.value = lang
  const dir = ['fa', 'ar', 'he'].includes(lang) ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang)
}
</script>

<template>
  <header class="topbar">
    <div>
      <div class="topbar__breadcrumb">Dashboard / {{ pageTitle.toLowerCase() }}</div>
    </div>
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

.topbar__breadcrumb {
  font-size: 11px;
  color: var(--color-secondary);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
  margin-top: 2px;
}

.topbar__spacer { flex: 1; }

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
