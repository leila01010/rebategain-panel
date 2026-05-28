<script setup>
import { computed } from 'vue'
import { IrDropdown, IrIcon } from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'
import { localize } from '@/lib/moment.js'
import { storage } from '@/services/storage.service.js'

const { locale } = useI18n()

const LANGS = [
  { code: 'en', flag: 'flag-us', country: 'US', label: 'EN' },
  { code: 'ar', flag: 'flag-ir', country: 'AR', label: 'AR' },
]

const current = computed(() => LANGS.find(l => l.code === locale.value) ?? LANGS[0])

function select(lang, close) {
  locale.value = lang.code
  localize(lang.code)
  storage.set('locale', lang.code)
  close()
}
</script>

<template>
  <IrDropdown class="lang-dropdown" align="end" :max-width="124">
    <template #trigger>
      <span class="lang-trigger">
        <IrIcon :key="current.country" :name="current.flag" :size="20" />
        <span class="lang-trigger__label">{{ current.country }} / {{ current.label }}</span>
      </span>
    </template>
    <template #content="{ close }">
      <ul class="lang-menu">
        <li
          v-for="lang in LANGS"
          :key="lang.code"
          class="lang-menu__item"
          :class="{ 'lang-menu__item--active': lang.code === locale }"
          @click="select(lang, close)"
        >
          <IrIcon :key="lang.code" :name="lang.flag" :size="20" />
          <span>{{ lang.country }} / {{ lang.label }}</span>
        </li>
      </ul>
    </template>
  </IrDropdown>
</template>

<style scoped>
.lang-dropdown :deep(.ir-dropdown__trigger) {
  padding: 6px 12px;
  border: 1px solid var(--color-dark-blue-50);
  border-radius: 12px;
  background: #fff;
}

.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-dark-blue-600);
}

.lang-trigger__label {
  white-space: nowrap;
}

.lang-menu {
  list-style: none;
  margin: 0;
  padding: 0 4px;
}

.lang-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: var(--color-dark-blue-500);
  transition: background 0.15s;
}

.lang-menu__item:hover {
  background: var(--color-blue-20);
}

.lang-menu__item--active {
  background: var(--color-blue-20);
  font-weight: 500;
}
</style>
