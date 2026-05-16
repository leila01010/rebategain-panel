import { createApp, ref, h } from 'vue'
import IrMessage from './IrMessage.vue'

class Message {
  #config
  #messages = ref([])
  #timers = new Map()
  #uid = 0
  #app = null
  #rootId = 'ui-kit-holder'

  constructor(config = {}) {
    this.#config = { duration: 4000, max: 10, ...config }

    let appHolder = document.getElementById(this.#rootId)

    if (!appHolder) {
      const el = document.createElement('div')

      el.id = this.#rootId
      document.body.appendChild(el)

      this.#app = createApp({
        render: () =>
          h(IrMessage, {
            messages: this.#messages.value,
            onDismiss: (id) => this.#dismiss(id),
          }),
      })

      this.#app.mount(el)
    }
  }

  #dismiss(id) {
    clearTimeout(this.#timers.get(id))
    this.#timers.delete(id)

    const idx = this.#messages.value.findIndex((m) => m.id === id)
    if (idx > -1) this.#messages.value.splice(idx, 1)
  }

  /**
   * @param {string} text
   * @param {string} type
   * @param {object} options
   * @returns {function(): void}
   */
  show(text, type, options = {}) {
    if (this.#messages.value.length >= this.#config.max) {
      this.#dismiss(this.#messages.value[0].id)
    }

    const id = ++this.#uid
    const duration = options.duration ?? this.#config.duration

    this.#messages.value.push({ id, text, type, duration })

    if (duration > 0) {
      this.#timers.set(id, setTimeout(() => this.#dismiss(id), duration))
    }

    return () => this.#dismiss(id)
  }

  destroy() {
    this.#timers.forEach((timer) => clearTimeout(timer))
    this.#timers.clear()

    this.#app?.unmount()
    document.getElementById(this.#rootId)?.remove()

    this.#app = null
    this.#uid = 0
    this.#messages.value = []
  }
}

/**
 * Create an independent message API instance.
 * Each instance mounts its own container with a unique DOM id.
 *
 * @param {object} [config]
 *
 * @example
 * const msg = createMessage({ duration: 3000, max: 5 })
 * msg.success('Done!')
 * msg.destroy()
 */
export function createMessage(config) {
  const message = new Message(config)

  const MessageHandler = (text, options) => message.show(text, 'default', options)

  MessageHandler.success = (text, options) => message.show(text, 'success', options)
  MessageHandler.error = (text, options) => message.show(text, 'error', options)
  MessageHandler.warning = (text, options) => message.show(text, 'warning', options)
  MessageHandler.info = (text, options) => message.show(text, 'info', options)
  MessageHandler.destroy = () => message.destroy()

  return MessageHandler
}

export const message = createMessage()
