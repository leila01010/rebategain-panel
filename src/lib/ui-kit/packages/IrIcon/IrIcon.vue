<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
})

const modules = import.meta.glob('@/assets/icons/*.svg', {
  eager: true,
})

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const name = path.split('/').pop().replace('.svg', '')
    return [name, mod.default]
  }),
)

const IconComponent = computed(() => icons[props.name])

const size = computed(() => `${props.size}px`)
</script>

<template>
  <component
    v-if="IconComponent"
    :key="name"
    :is="IconComponent"
    class="ir-icon"
  />

  <span v-else class="icon-missing">?</span>
</template>

<style scoped>
.ir-icon {
  width: v-bind(size);
  height: v-bind(size);
}
</style>
