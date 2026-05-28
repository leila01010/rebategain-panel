<script setup>
import { IrIcon, IrAvatar } from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user.js'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const showMenu = ref(false)

const avatar = computed(() => {
  return userStore.user?.avatar
})

const items = computed(() => [
  { key: 'overview', label: t('common.routes.overview'), icon: 'dashboard', to: '/' },
  { key: 'withdraws', label: t('common.routes.withdraws'), icon: 'upload', to: '/withdraws' },
  { key: 'accounts', label: t('common.routes.accounts'), icon: 'wallet', to: '/accounts' },
  { key: 'you', label: t('common.you'), icon: 'menu', to: '/profile' },
])

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}

function goRebate() {
  closeMenu()
  router.push({ path: '/' })
}

function goAddAccount() {
  closeMenu()
  router.push({ path: '/accounts' })
}
</script>

<template>
  <Transition name="bn-overlay">
    <div v-if="showMenu" class="bottom-nav__backdrop" @click="closeMenu" />
  </Transition>

  <nav class="bottom-nav">
    <Transition name="bn-menu">
      <div v-if="showMenu" class="bottom-nav__menu">
        <button type="button" class="bottom-nav__menu-btn" @click="goRebate">
          {{ t('common.rebateRequest') }}
        </button>
        <button type="button" class="bottom-nav__menu-btn" @click="goAddAccount">
          {{ t('common.addAccount') }}
        </button>
      </div>
    </Transition>

    <div class="bottom-nav__inner">
      <template v-for="(item, idx) in items" :key="item.key">
        <component
          :is="item.to ? 'RouterLink' : 'button'"
          :to="item.to || undefined"
          :type="item.to ? undefined : 'button'"
          class="bottom-nav__item"
          active-class="bottom-nav__item--active"
        >
          <div v-if="item.key === 'you'" class="bottom-nav__avatar" aria-hidden="true">
            <IrAvatar :src="avatar" size="xs" />
          </div>
          <IrIcon v-else :name="item.icon" class="bottom-nav__icon" />
          <span class="bottom-nav__label">{{ item.label }}</span>
        </component>

        <span
          v-if="idx === 1"
          class="bottom-nav__fab-slot"
          aria-hidden="true"
        />
      </template>
    </div>

    <button
      type="button"
      class="bottom-nav__fab"
      :class="{ 'bottom-nav__fab--open': showMenu }"
      :aria-label="t('common.add')"
      @click="toggleMenu"
    >
      <IrIcon name="plus" :size="40" />
    </button>
  </nav>
</template>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 30;
  display: none;
  background: var(--bg-sidebar);
  border-top: 1px solid var(--color-blue-20);
  padding-bottom: env(safe-area-inset-bottom, 0);
  box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.05);
}

.bottom-nav__backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(21, 34, 66, 0.2);
  backdrop-filter: blur(4px);
  z-index: 29;
  display: none;
}

.bottom-nav__menu {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 24px);
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 1;
  white-space: nowrap;
}

.bottom-nav__menu-btn {
  width: 120px;
  height: 32px;
  background: var(--color-blue-500);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2.57px 20px 0 rgba(255, 255, 255, 0.1);
  transition: background 0.15s, transform 0.1s;
}

.bottom-nav__menu-btn:hover { background: var(--color-blue-600); }
.bottom-nav__menu-btn:active { transform: scale(0.96); }

.bottom-nav__inner {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: stretch;
  height: 64px;
  position: relative;
  background: var(--bg-sidebar);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-dark-blue-300);
  text-decoration: none;
  padding: 6px 4px;
  transition: color 0.15s;

  &--active {
    color: var(--color-primary);
  }
}

.bottom-nav__icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.bottom-nav__label {
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.bottom-nav__fab-slot {
  display: block;
}

.bottom-nav__fab {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -30%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-blue-500);
  color: #fff;
  border: 2px solid #ffffff;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 3px 3px 0 rgba(0, 14, 51, 0.1);
  transition: background 0.15s, transform 0.2s;
  z-index: 2;
}

.bottom-nav__fab:hover { background: var(--color-blue-600); }
.bottom-nav__fab:active { transform: translate(-50%, -30%) scale(0.96); }

.bottom-nav__fab--open {
  transform: translate(-50%, -30%) rotate(45deg);
}
.bottom-nav__fab--open:active { transform: translate(-50%, -30%) rotate(45deg) scale(0.96); }

.bn-overlay-enter-active,
.bn-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.bn-overlay-enter-from,
.bn-overlay-leave-to {
  opacity: 0;
}

.bn-menu-enter-active,
.bn-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.bn-menu-enter-from,
.bn-menu-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 767px) {
  .bottom-nav { display: block; }
  .bottom-nav__backdrop { display: block; }
}
</style>
