<script setup>
import { ref } from 'vue'
import { IrIcon, IrModal } from '@/lib/ui-kit'

defineProps({
  videoSrc: { type: String, default: '' },
})

const showVideo = ref(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <span v-text="$t('account.needHelp')" class="text-dark-blue-400 text-xs" />
    <button
      class="h-6 flex items-center gap-2 border border-dark-blue-300 rounded-lg px-2 cursor-pointer"
      @click="showVideo = true"
    >
      <IrIcon name="video" :size="16" />
      <span v-text="$t('account.watchTutorial')" class="text-dark-blue-300 text-xs" />
    </button>
    <span v-text="$t('account.or')" class="text-dark-blue-400 text-xs" />
    <button class="text-xs text-primary underline cursor-pointer" v-text="$t('common.contactSupport')" />

    <IrModal
      v-model:show="showVideo"
      :full-screen="false"
      size="800px"
      plain
    >
      <div class="relative">
        <span class="block pt-[57%]" />
        <iframe
          width="100%"
          height="100%"
          :src="videoSrc"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          class="absolute inset-0 rounded-xl md:rounded-3xl"
          allowfullscreen
        />
      </div>
    </IrModal>
  </div>
</template>
