<template>
  <div ref="el" :class="wrapperClass">
    <slot />
    <slot v-if="!isDisabled" name="loading">
      <i class="ic-loading font-20" />
      <span v-if="loadingText" class="mt-20" v-text="loadingText" />
    </slot>
  </div>
</template>

<script>
export default {
  name: 'IrInfiniteLoading',

  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    loadingText: {
      type: String,
      default: null,
    },

    wrapperClass: {
      type: String,
      default: 'text-center pt-10 pb-20',
    },
  },

  emits: ['load-more'],

  data() {
    return {
      observer: null,
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      if (!this.observer) {
        this.observer = new IntersectionObserver(this.onIntersect)
        this.observer.observe(this.$refs.el)
      }
    },

    onIntersect(entries) {
      if (this.isLoading || this.isDisabled) {
        return
      }
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$emit('load-more')
          console.log('isIntersecting')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.ft-infinite-loading {
  text-align: center;
}
</style>
