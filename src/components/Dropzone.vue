<script setup>
import { ref } from 'vue'

const props = defineProps({
  multiple: { type: Boolean, default: true },
  accept: { type: String, default: '.jpg,.jpeg,.png,.gif,.mp4' },
  disabled: { type: Boolean, default: false },
  zoneClass: { type: String, default: '' }
})

const emit = defineEmits(['change'])

const isHover = ref(false)

function onEnter() {
  if (!props.disabled) isHover.value = true
}
function onLeave() {
  isHover.value = false
}
function onDrop(event) {
  if (props.disabled) return
  onLeave()
  checkFiles(event.dataTransfer.files, 'drop')

}
function onFileChange(event) {
  checkFiles(event.target.files)
  event.target.value = ''
}
function checkFiles(files, eventType = 'input') {
  if (!files.length) return
  files = props.multiple ? files : [files[0]]
  Array.prototype.forEach.call(files, file => {
    emit('change', file)
  })
}
</script>

<template>
  <div
    ref="form"
    :class="{ 'is-hover': isHover }"
    @drag.prevent.stop
    @dragstart.prevent.stop
    @dragover.prevent.stop="onEnter"
    @dragenter.prevent.stop="onEnter"
    @dragend.prevent.stop="onLeave"
    @dragleave.prevent.stop="onLeave"
    @drop.prevent.stop="onDrop"
  >
    <slot name="top" />
    <div class="media-zone" :class="[zoneClass, { 'is-hover': isHover }]">
      <input
        v-if="!disabled"
        ref="file"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="onFileChange"
      >
      <slot />
    </div>
    <slot name="bottom" />
  </div>
</template>

<style>
.media-zone {
  position: relative;
  &.is-hover {
    border-color: var(--color-primary);
  }
  input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 100px;
    opacity: 0;
    color: transparent;
    z-index: 2;
    cursor: pointer;
    overflow: hidden;
    &::-webkit-file-upload-button,
    &::file-selector-button {
      cursor: pointer;
    }
  }
}
</style>
