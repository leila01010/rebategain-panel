<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { IrDropdown } from '@/lib/ui-kit'
import { countries, findCountryByIsoCode } from '@/data/countries.js'

defineProps({
  disabled: { type: Boolean, default: false },
})

const code = defineModel({ type: String, default: '' })

const isoCode = ref('')

const selectedCountry = computed(() => findCountryByIsoCode(isoCode.value) || countries[0])

const listRef = ref(null)
const itemRefs = ref({})
const highlightedIso = ref('')
let typeBuffer = ''
let typeTimer = null

watch(selectedCountry, (newCountry) => {
  if (newCountry) code.value = newCountry.code
}, { immediate: true })

function setItemRef(iso, el) {
  if (el) itemRefs.value[iso] = el
  else delete itemRefs.value[iso]
}

function scrollToIso(iso, block = 'nearest') {
  itemRefs.value[iso]?.scrollIntoView({ block })
}

function selectCountry(item, close) {
  isoCode.value = item.isoCode
  close()
}

function onOpen() {
  typeBuffer = ''
  highlightedIso.value = ''
  window.addEventListener('keydown', onTypeAhead)
  nextTick(() => scrollToIso(selectedCountry.value?.isoCode, 'center'))
}

function onClose() {
  window.removeEventListener('keydown', onTypeAhead)
  clearTimeout(typeTimer)
  typeBuffer = ''
}

function onTypeAhead(e) {
  if (e.key.length !== 1 || !/[a-zA-Z0-9]/.test(e.key)) return
  e.preventDefault()
  clearTimeout(typeTimer)
  typeBuffer += e.key.toUpperCase()
  typeTimer = setTimeout(() => { typeBuffer = '' }, 800)

  const isDigitBuffer = /^\d+$/.test(typeBuffer)
  const match = countries.find((c) =>
    isDigitBuffer
      ? c.code.slice(1).startsWith(typeBuffer)
      : c.isoCode.startsWith(typeBuffer)
  )
  if (!match) return
  highlightedIso.value = match.isoCode
  scrollToIso(match.isoCode)
}
</script>

<template>
  <IrDropdown
    class="phone-country"
    :disabled="disabled"
    :min-width="110"
    :max-width="220"
    @open="onOpen"
    @close="onClose"
  >
    <template #trigger>
      <div class="phone-country__trigger">
        <span class="phone-country__text">
          {{ selectedCountry?.code }} ({{ selectedCountry?.isoCode }})
        </span>
      </div>
    </template>

    <template #content="{ close }">
      <ul ref="listRef" class="phone-country__list">
        <li
          v-for="item in countries"
          :key="item.isoCode"
          :ref="(el) => setItemRef(item.isoCode, el)"
          class="phone-country__list-item"
          :class="{
            'phone-country__list-item--active': item.isoCode === isoCode,
            'phone-country__list-item--highlighted': item.isoCode === highlightedIso,
          }"
          @click="selectCountry(item, close)"
        >
          {{ item.code }} ({{ item.isoCode }})
        </li>
      </ul>
    </template>
  </IrDropdown>
</template>

<style lang="scss" scoped>
.phone-country {
  display: inline-flex;
  flex-shrink: 0;

  :deep(.ir-dropdown__trigger) {
    padding: 10px 12px;
    background: transparent;
    border: none;
    color: var(--color-dark-blue-600);
    font-size: 13px;
    gap: 6px;

    &:hover {
      border-color: transparent;
    }
  }

  :deep(.ir-dropdown__icon) {
    width: 12px;
    height: 12px;
    color: var(--color-dark-blue-400);
  }

  &__trigger {
    display: inline-flex;
    align-items: center;
    min-width: 65px;
  }

  &__text {
    font-size: 13px;
    color: var(--color-dark-blue-600);
    white-space: nowrap;
  }

  &__list {
    list-style: none;
    margin: 0;
  }

  &__list-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: var(--color-dark-blue-600);
    white-space: nowrap;
    transition: background 0.12s;

    &:hover {
      background: var(--color-blue-20);
    }

    &--active {
      background: var(--color-blue-20);
      font-weight: 500;
    }

    &--highlighted {
      outline: 1px solid var(--color-blue-100);
      outline-offset: -1px;
    }
  }
}
</style>
