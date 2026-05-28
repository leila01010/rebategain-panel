<script setup>
import { computed, watch } from 'vue'
import { IrDropdown, IrInput } from '@/lib/ui-kit'
import { countries, findCountryByCode } from '@/data/countries.js'

defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const phone = defineModel({ type: String, default: '' })
const country = defineModel('country', { type: String, default: '' })

const selectedCountry = computed(() => findCountryByCode(country.value) || countries[0])

watch(country, (value) => {
  if (!value) country.value = selectedCountry.value.code
}, { immediate: true })

function selectCountry(item, close) {
  country.value = item.code
  close()
}
</script>

<template>
  <IrInput
    v-model="phone"
    :label
    :placeholder
    :disabled
    :error
    class="phone-input"
  >
    <template #prepend>
      <IrDropdown
        class="phone-input__country"
        :disabled="disabled"
        :min-width="110"
        :max-width="220"
      >
        <template #trigger>
          <div class="phone-input__country-trigger">
            <span class="phone-input__country-text">
              {{ selectedCountry?.code }} ({{ selectedCountry?.isoCode }})
            </span>
          </div>
        </template>

        <template #content="{ close }">
          <ul class="phone-input__list">
            <li
              v-for="item in countries"
              :key="item.isoCode"
              class="phone-input__list-item"
              :class="{ 'phone-input__list-item--active': item.code === country }"
              @click="selectCountry(item, close)"
            >
              {{ item.code }} ({{ item.isoCode }})
            </li>
          </ul>
        </template>
      </IrDropdown>
    </template>
  </IrInput>
</template>

<style lang="scss" scoped>
.phone-input {
  :deep(.ir-input__prepend) {
    padding: 0;
  }
  &__country {
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
  }

  &__country-trigger {
    display: inline-flex;
    align-items: center;
    min-width: 65px;
  }

  &__country-text {
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
  }
}
</style>
