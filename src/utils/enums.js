import { i18n } from '@/i18n'

export default {
  ACCOUNT_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    ACTION_NEEDED: 'action_needed',
  },

  getArray(enumItem, start = 0) {
    const t = i18n.global.t

    let result = []
    let index = start
    let item = this[enumItem]

    for (let key in item) {
      if (!Object.prototype.hasOwnProperty.call(item, key)) continue
      let tk = `enums.${enumItem}.${key}`
      result.push({
        id: index,
        title: t(tk) || '-',
        value: item[key],
        key
      })
      index++
    }
    return result
  },

  getItem(enumItem, val, key) {
    const array = this.getArray(enumItem)
    const item = array.find(e => e.value === val) || {}

    if (key) return item[key] || val
    return item
  }
}
