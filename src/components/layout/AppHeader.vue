<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IrIcon } from '@/lib/ui-kit'

const { locale } = useI18n()

const emit = defineEmits(['toggle-sidebar'])

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
    <button class="topbar__menu-btn" @click="emit('toggle-sidebar')" aria-label="Toggle menu">
      <IrIcon name="menu" />
    </button>

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
.topbar__menu-btn:hover {
  background: var(--color-blue-20);
  color: var(--color-blue-900);
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

@media (max-width: 767px) {
  .topbar {
    height: var(--mobile-header-height);
    padding: 0 16px;
    border-left: none;
    box-shadow: 0 4px 8px 0 #7E8AA626;
  }

  .topbar__menu-btn {
    display: flex;
  }
}
</style>
