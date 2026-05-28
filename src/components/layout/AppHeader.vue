<script setup>
import { IrIcon, IrDivider } from '@/lib/ui-kit'
import UserMenu from './UserMenu.vue'
import LanguageSelect from './LanguageSelect.vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useDevice } from '@/composables/useDevice.js'
import { useUserStore } from '@/stores/user.js'

const route = useRoute()
const { t } = useI18n()
const { isPhone } = useDevice()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const emit = defineEmits(['toggle-sidebar'])

const PageTitle = computed(() => {
  return t(`common.routes.${route.name}`)
})
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
      <LanguageSelect v-if="!isPhone" />
      <IrDivider v-if="!isPhone && user" orientation="vertical" class="!h-9" />
      <UserMenu v-if="!isPhone && user" />
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
  color: var(--color-dark-blue-500);
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.topbar__spacer { flex: 1; }

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

@media (max-width: 767px) {
  .topbar {
    height: var(--mobile-header-height);
    padding: 0 16px;
    border-left: none;
    border-color: var(--color-dark-blue-50);
  }
  .topbar__menu-btn {
    display: flex;
  }
}
</style>
