<script setup>
import { ref, watch } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { popupManager } from '@/lib/ui-kit/src/utils/popup-manager.js'

const showSidebar = ref(false)
const overlayZIndex = ref(null)
const sidebarZIndex = ref(null)

watch(showSidebar, (open) => {
  if (!open) return
  overlayZIndex.value = popupManager.getNewZIndex()
  sidebarZIndex.value = popupManager.getNewZIndex()
})

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function closeSidebar() {
  showSidebar.value = false
}
</script>

<template>
  <div class="layout">
    <Transition name="sidebar-fade">
      <div
        v-if="showSidebar"
        class="layout__overlay"
        :style="overlayZIndex ? { zIndex: overlayZIndex } : null"
        @click="closeSidebar"
      />
    </Transition>

    <AppSidebar :show-sidebar="showSidebar" :z-index="sidebarZIndex" @close="closeSidebar" />

    <div class="layout__body">
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <main class="main">
        <div class="main__content">
          <slot />
        </div>
      </main>

      <BottomNav />
    </div>
  </div>
</template>

<style>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main {
  overflow: auto;
  overscroll-behavior: contain;
  flex-grow: 1;
}

.main__content {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: content-box;
}

@media (max-width: 767px) {
  .main {
    padding-bottom: calc(var(--bottom-nav-height) + 100px + env(safe-area-inset-bottom, 0));
  }
}

.layout__overlay {
  position: fixed;
  inset: 0;
  background: rgba(76, 94, 140, 0.25);
  z-index: 40;
  display: none;
}

.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.25s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .layout__overlay {
    display: block;
  }
}
</style>
