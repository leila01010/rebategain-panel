import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReferenceStore = defineStore('reference', () => {
  const countries = ref([])
  const brokers = ref([])

  return { countries, brokers }
})
