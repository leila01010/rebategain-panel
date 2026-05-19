import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'

const size = reactive({
  width: 0,
  height: 0,
})

let queue = 0

function onResize() {
  size.width = window.innerWidth
  size.height = window.innerHeight
}

function register() {
  queue++
  if (queue === 1 && typeof window !== 'undefined') {
    window.addEventListener('resize', onResize)
    onResize()
  }
}

function unregister() {
  queue--
  if (queue < 1 && typeof window !== 'undefined') {
    window.removeEventListener('resize', onResize)
  }
}

export function useDevice() {
  onMounted(register)
  onBeforeUnmount(unregister)

  const isPhone = computed(() => {
    return size.width <= 768
  })

  return {
    size,
    isPhone,
  }
}
