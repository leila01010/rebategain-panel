<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="layout">
    <AppSidebar />
    <div class="layout__body">
      <AppHeader />

      <main class="main">
        <div class="main__content">
          <slot />
        </div>
      </main>
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
}

.main__content {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: content-box;
}
</style>
