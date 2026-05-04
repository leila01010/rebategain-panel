<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 20
  }
})

const modules = import.meta.glob('@/assets/icons/*.svg', {
  eager: true
})

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const name = path.split('/').pop().replace('.svg', '')
    return [name, mod.default]
  })
)

const IconComponent = icons[props.name]
</script>

<template>
  <component
    :is="IconComponent"
    v-if="IconComponent"
    :style="{ width: size + 'px', height: size + 'px' }"
    class="ir-icon"
  />

  <span v-else class="icon-missing">
    ?
  </span>
</template>
