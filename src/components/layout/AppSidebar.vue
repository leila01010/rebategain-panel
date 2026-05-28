<script setup>
import { computed, ref, watch } from 'vue'
import { IrIcon, IrButton } from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  showSidebar: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const NAV = computed(() => [
    {
      key: 'dashboard',
      label: t('common.routes.overview'),
      icon: 'dashboard',
      badge: null,
      to: '/',
    },
    {
      key: 'accounts',
      label: t('common.routes.accounts'),
      icon: 'wallet',
      badge: null,
      to: '/accounts',
    },
    {
      key: 'withdraws',
      label: t('common.routes.withdraws'),
      icon: 'upload',
      badge: null,
      to: '/withdraws',
    },
    {
      key: 'payment-methods',
      label: t('common.routes.paymentMethods'),
      icon: 'dollar',
      badge: null,
      to: '/payment-methods',
    },
  ]
)

const collapsed = ref(false)

watch(() => props.showSidebar, () => {
  collapsed.value = false
})

const sidebarClasses = computed(() => {
  return [
    'sidebar',
    collapsed.value && 'sidebar--collapsed',
    props.showSidebar && 'sidebar--mobile-open',
  ]
})
</script>

<template>
  <aside :class="sidebarClasses">
    <button class="sidebar__expand-pill" @click="collapsed = false" title="Expand">
      <IrIcon name="right" class="icon-flip-rtl" />
    </button>

    <div class="sidebar__header">
      <div class="sidebar__brand">
        <img src="/logo-s.png" alt="logo" class="sidebar__logo" />
        <div class="sidebar__brand-text">RebateGain</div>
      </div>
      <button class="sidebar__collapse-btn" @click="collapsed = true" title="Collapse">
        <IrIcon name="go-start" class="icon-flip-rtl" />
      </button>
      <button class="sidebar__close-btn" @click="emit('close')" title="Close">
        <IrIcon name="close" />
      </button>
    </div>

    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in NAV"
        :key="item.key"
        class="sidebar__item"
        active-class="sidebar__item--active"
        :title="collapsed ? item.label : ''"
        :to="item.to"
        @click="emit('close')"
      >
        <IrIcon :name="item.icon" class="sidebar__item-icon" />
        <span class="sidebar__item-text">{{ item.label }}</span>
        <span v-if="item.badge" class="sidebar__item-badge">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <div v-if="!collapsed" class="sidebar__footer">
      <IrButton
        :text="$t('common.contactSupport')"
        variant="outline"
        size="lg"
        prepend-icon="mail"
        block
        class="!border-dark-blue-50 !text-dark-blue-500"
      />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  overflow: visible;
  transition: width var(--transition);
  position: relative;
  flex-shrink: 0;
  z-index: 10;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  min-height: var(--header-height);
  flex-shrink: 0;
  overflow: hidden;
  transition: padding var(--transition), justify-content var(--transition);
}
.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar--collapsed .sidebar__header {
  padding: 18px 0;
  justify-content: center;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.sidebar__logo {
  width: 32px;
  height: 32px;
}

.sidebar__brand-text {
  min-width: 0;
  overflow: hidden;
  opacity: 1;
  max-width: 200px;
  transition: opacity var(--transition), max-width var(--transition);
  white-space: nowrap;
}
.sidebar--collapsed .sidebar__brand-text {
  opacity: 0;
  display: none;
}

.sidebar__brand-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-dark-blue-900);
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.sidebar__collapse-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: 6px;
  flex-shrink: 0;
  color: #bcbcbc;
  transition: background 0.15s, color 0.15s, opacity var(--transition);
}
.sidebar__collapse-btn:hover { background: #f8f8f8; color: var(--color-primary); }
.sidebar--collapsed .sidebar__collapse-btn { opacity: 0; pointer-events: none; width: 0; }

.sidebar__expand-pill {
  position: absolute;
  inset-inline-end: -13px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-sidebar);
  border: 1px solid #f1f1f1;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: #bcbcbc;
  transition: background 0.15s, color 0.15s, opacity var(--transition);
  opacity: 0;
  pointer-events: none;
  z-index: 20;
}
.sidebar--collapsed .sidebar__expand-pill {
  opacity: 1;
  pointer-events: all;
}
.sidebar__expand-pill:hover { background: #f8f8f8; color: var(--color-primary); }

.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-block: 16px;
  padding-inline-start: 16px;
  padding-inline-end: 12px;
  scrollbar-width: none;
}
.sidebar__nav::-webkit-scrollbar { display: none; }

.sidebar--collapsed .sidebar__nav {
  padding: 8px;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  height: 44px;
  border-radius: 8px;
  margin-bottom: 8px;
  position: relative;
  transition: background 0.15s;
  overflow: hidden;
}

.sidebar__item--active { background: var(--color-blue-50); }

.sidebar--collapsed .sidebar__item {
  justify-content: center;
  padding: 0;
}

.sidebar__item-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-dark-blue-400);
  transition: color 0.15s;
}
.sidebar__item:hover .sidebar__item-icon,
.sidebar__item--active .sidebar__item-icon { color: var(--color-blue-900); }

.sidebar__item-text {
  font-size: 16px;
  font-weight: 400;
  color: var(--color-dark-blue-400);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  opacity: 1;
  transition: opacity var(--transition), color 0.15s;
}
.sidebar--collapsed .sidebar__item-text { opacity: 0; width: 0; display: none; }
.sidebar__item--active .sidebar__item-text { color: var(--color-blue-900); }

.sidebar__item-badge {
  background: #bcbcbc;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  padding: 0 5px;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  transition: all var(--transition);
}
.sidebar--collapsed .sidebar__item-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 14px;
  height: 14px;
  font-size: 8px;
  padding: 0 3px;
}

.sidebar__footer {
  height: 80px;
  padding: 16px;
  border-top: 1px solid var(--color-blue-20);
  overflow: hidden;
}
.sidebar--collapsed .sidebar__footer {
  padding: 14px 0;
  justify-content: center;
}

.sidebar__close-btn {
  display: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #221F1F;
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 50;
    width: var(--mobile-sidebar-width);
    transform: translateX(-100%);
    transition: transform var(--transition);
    border-start-end-radius: 16px;
    border-end-end-radius: 16px;
  }

  .sidebar__header {
    min-height: var(--mobile-header-height);
    padding: 16px 18px;
    box-shadow: 0 1px 0 0 #E9EBF1;
  }

  .sidebar__logo {
    width: 28px;
    height: 28px;
  }

  .sidebar__item-icon {
    width: 20px;
    height: 20px;
  }

  [dir='rtl'] .sidebar {
    transform: translateX(100%);
  }

  .sidebar.sidebar--mobile-open {
    transform: translateX(0);
  }

  .sidebar__expand-pill {
    display: none;
  }

  .sidebar__collapse-btn {
    display: none;
  }

  .sidebar__close-btn {
    display: block;
  }
}
</style>
