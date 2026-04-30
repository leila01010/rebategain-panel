<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BlankLayout from '@/layouts/blankLayout.vue'
import DefaultLayout from '@/layouts/defaultLayout.vue'

const route = useRoute()

const layouts = {
  default: DefaultLayout,
  blank: BlankLayout,
}

const layout = computed(() => layouts[route.meta.layout] || DefaultLayout)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
