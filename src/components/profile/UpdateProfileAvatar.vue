<script setup>
import { ref } from 'vue'
import { IrAvatar, IrIcon } from '@/lib/ui-kit'
import Dropzone from '@/components/Dropzone.vue'
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia'
import api from '@/api/api-list.js'
import http from '@/services/http.js'

defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(val),
  },
})

const store = useUserStore()
const { user } = storeToRefs(store)

const loading = ref(false)

async function handleFileChange(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  loading.value = true
  try {
    const { data } = await http.post(api.userAvatar, formData)
    user.value = {
      ...data,
      avatar: data?.media?.[0]?.url || '',
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <Dropzone
      :multiple="false"
      accept=".jpg,.jpeg,.png"
      :disabled="loading"
      @change="handleFileChange"
    >
      <IrAvatar :src="user?.avatar" :size />
      <button
        v-if="!loading"
        class="absolute inset-be-0 inset-e-0 size-6 md:size-6 rounded-full bg-white flex items-center justify-center border border-dark-blue-50 cursor-pointer"
      >
        <IrIcon name="edit" :size="14" />
      </button>
      <IrIcon v-if="loading" name="spinner" class="absolute left-1/2 top-1/2 -translate-1/2" />
    </Dropzone>
  </div>
</template>
