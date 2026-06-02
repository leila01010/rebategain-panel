<script setup>
import { watch } from 'vue'
import { IrInput } from '@/lib/ui-kit'
import PhoneCountrySelect from './PhoneCountrySelect.vue'
import { countries } from '@/data/countries.js'

defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const phone = defineModel({ type: String, default: '' })
const country = defineModel('country', { type: String, default: '' })

watch(country, (value) => {
  if (!value) country.value = countries[0].code
}, { immediate: true })
</script>

<template>
  <IrInput
    v-model="phone"
    :label
    :placeholder
    :disabled
    :error
    number
    class="phone-input"
  >
    <template #prepend>
      <PhoneCountrySelect v-model="country" :disabled="disabled" />
    </template>
  </IrInput>
</template>

<style lang="scss" scoped>
.phone-input {
  :deep(.ir-input__prepend) {
    padding: 0;
  }
}
</style>
