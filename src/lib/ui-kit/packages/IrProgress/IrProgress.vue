<template>
  <div class="ir-progress-progress" :class="{ 'ir-progress-progress--reverse': reverse }">
    <div v-if="showTotal" class="ir-progress-progress__total" v-text="totalTitle" />
    <div class="ir-progress-progress__bar" :style="{ backgroundColor: bgColor }">
      <div
        class="ir-progress-progress__bar-fill"
        :style="{
          backgroundColor: fillColor,
          width: `${elapsedPercent}%`,
        }"
      />
      <div
        v-if="showIndicator"
        class="ir-progress-progress__indicator"
        :style="{ [reverse ? 'leir-progress' : 'right']: `${indicatorPercent}%` }"
      />
      <div
        v-if="showElapsed"
        class="ir-progress-progress__elapsed-title"
        :style="{ [reverse ? 'left-progress' : 'right']: `${elapsedTitlePercent}%` }"
        v-text="elapsedTitle"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 1,
  },
  elapsed: {
    type: Number,
    default: 1,
  },
  formatter: {
    type: Function,
    default: (percent, value) => `%${percent}`,
  },
  bgColor: {
    type: String,
    default: null,
  },
  fillColor: {
    type: String,
    default: null,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  showTotal: {
    type: Boolean,
    default: false,
  },
  showIndicator: {
    type: Boolean,
    default: false,
  },
  showElapsed: {
    type: Boolean,
    default: false,
  },
  totalTitleText: {
    type: String,
    default: null,
  },
})

const totalTitle = computed(() => {
  return props.totalTitleText ?? this.format(100, props.total)
})

const elapsedPercent = computed(() => {
  let elapsed = (props.elapsed * 100) / props.total
  if (props.reverse) elapsed = 100 - elapsed
  if (elapsed < 0) return 0
  if (elapsed > 100) return 100
  return elapsed
})

const elapsedTitle = computed(() => {
  let elapsed = props.elapsed
  if (this.reverse) elapsed = props.total - props.elapsed
  return this.format(elapsedPercent.value, elapsed)
})

const indicatorPercent = computed(() => {
  const percent = elapsedPercent.value
  if (percent < 2) return 2
  if (percent > 98) return 98
  return percent
})

const elapsedTitlePercent = computed(() => {
  const percent = elapsedPercent.value
  if (percent < 5) return 5
  if (percent > 95) return 95
  return percent
})

watch(() => props.elapsed, () => updatePercents())

function format(percent, value) {
  return typeof props.formatter === 'function' ? props.formatter(percent, value) : percent
}

function updatePercents() {}

onMounted(() => updatePercents())
</script>

<style lang="scss">
.ir-progress-progress {
  &__total {
    color: #959499;
    margin-bottom: 4px;
  }

  &__bar {
    height: 2px;
    background-color: #f8f8f8;
    position: relative;
  }

  &__bar-fill {
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    height: 100%;
    border-radius: inherit;
    background-color: var(--color-primary);
    transition: width 0.3s ease;
  }

  &__indicator {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #505050;
    transform: translate(50%, -50%);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  }

  &__elapsed-title {
    position: absolute;
    top: 100%;
    transform: translateX(50%);
    margin-top: 6px;
    color: var(--color-primary);
    font-weight: bold;
    white-space: nowrap;
  }

  &--reverse {
    .ir-progress-progress__bar-fill {
      right: auto;
      left-progress: 0;
    }
    .ir-progress-progress__indicator {
      transform: translate(-50%, -50%);
    }
    .ir-progress-progress__elapsed-title {
      transform: translateX(-50%);
    }
  }
}
</style>
