<script setup>
import { computed } from 'vue'
import { IrIcon } from '@/lib/ui-kit/index.js'

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
})

const emit = defineEmits(['update:modelValue'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.modelValue

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const wanted = new Set([1, 2, total - 1, total, current - 1, current, current + 1])
  const result = []
  let prev = 0
  for (let i = 1; i <= total; i++) {
    if (!wanted.has(i)) continue
    if (i - prev > 1) result.push('...')
    result.push(i)
    prev = i
  }
  return result
})

function goTo(page) {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return
  emit('update:modelValue', page)
}
</script>

<template>
  <div class="ir-pagination">
    <button
      class="ir-pagination__nav"
      :class="{ 'ir-pagination__nav--active': modelValue !== 1 }"
      type="button"
      :disabled="modelValue === 1"
      @click="goTo(modelValue - 1)"
    >
      <IrIcon name="arrow-left" :size="16" />
    </button>

    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === '...'" class="ir-pagination__ellipsis">…</span>
      <button
        v-else
        class="ir-pagination__page"
        :class="{ 'ir-pagination__page--active': page === modelValue }"
        type="button"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="ir-pagination__nav"
      :class="{ 'ir-pagination__nav--active': modelValue !== totalPages }"
      type="button"
      :disabled="modelValue === totalPages"
      @click="goTo(modelValue + 1)"
    >
      <IrIcon name="arrow-right" :size="16" />
    </button>
  </div>
</template>

<style lang="scss" src="./IrPagination.scss" />
