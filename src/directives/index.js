import { message } from '@/lib/ui-kit'
import { i18n } from '@/i18n'

export const copy = {
  mounted(el, binding) {
    el.addEventListener('click', async () => {
      const text = binding.value

      try {
        await navigator.clipboard.writeText(text)
        message.success(i18n.global.t('common.copied'))
      } catch (error) {
        console.error('Failed to copy!', error)
      }
    })
  }
}
