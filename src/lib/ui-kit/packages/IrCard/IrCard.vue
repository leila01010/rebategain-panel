<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  flush: { type: Boolean, default: false },
  headerClass: { type: String, default: '' },
  bodyClass: { type: String, default: '' },
  footerClass: { type: String, default: '' },
})
</script>

<template>
  <div :class="['ir-card', { 'ir-card--flush': flush }]">
    <div v-if="$slots.header || title" :class="['ir-card__header', headerClass]">
      <div class="ir-card__header-start">
        <div class="ir-card__meta">
          <h3 v-if="title" class="ir-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="ir-card__subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="ir-card__header-end">
        <slot name="header-actions" />
      </div>
    </div>
    <div :class="['ir-card__body', bodyClass]">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="['ir-ir-card__footer', footerClass]">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" src="./IrCard.scss" />
