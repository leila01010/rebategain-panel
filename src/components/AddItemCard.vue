<script setup>
import { IrIcon } from '@/lib/ui-kit'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="border border-dashed border-dark-blue-100 rounded-2xl p-8 hidden md:flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-20/50 transition-colors duration-100">
    <div class="size-12 rounded-full bg-white border border-dark-blue-50 flex items-center justify-center mb-4">
      <IrIcon name="plus" class="text-dark-blue-300" />
    </div>
    <div class="text-sm text-dark-blue-400 font-medium mb-1">{{ title }}</div>
    <div class="text-xs text-dark-blue-300 text-center">{{ description }}</div>
  </div>
</template>
