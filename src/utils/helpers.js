import moment from '@/lib/moment.js'

export const fullName = (data) => {
  data = data || {}

  return [data.firstName, data.lastName]
    .filter(n => n)
    .join(' ')
    .trim()
}

export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  if (value == null) return '-'

  const number = Number(value)

  if (isNaN(number)) return '-'

  let options = {
    style: 'currency',
    currency: currency,
  }

  if (Number.isInteger(number)) {
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 0
  } else {
    options.minimumFractionDigits = 2
    options.maximumFractionDigits = 2
  }

  return new Intl.NumberFormat(locale, options).format(value)
}

/**
 * Masks the middle of a string, keeping a prefix and suffix visible.
 * Email-aware: preserves the `@domain` and masks only the local part.
 *
 * @param {string} str
 * @param {{ charStart?: number, charEnd?: number, mask?: string }} [options]
 * @returns {string}
 */
export const maskMiddle = (str, { charStart = 3, charEnd = 3, mask = '...' } = {}) => {
  if (!str || typeof str !== 'string') return str || ''

  const minMaskable = charStart + charEnd + mask.length
  const atIndex = str.lastIndexOf('@')

  if (atIndex > 0) {
    const local = str.slice(0, atIndex)
    if (local.length <= minMaskable) return str
    return `${local.slice(0, charStart)}${mask}${local.slice(-charEnd)}${str.slice(atIndex)}`
  }

  if (str.length <= minMaskable) return str
  return `${str.slice(0, charStart)}${mask}${str.slice(-charEnd)}`
}

function toLatinDigits(str) {
  return str.replace(/[۰-۹٠-٩]/g, (d) => {
    const code = d.charCodeAt(0)
    return code >= 0x06f0 ? code - 0x06f0 : code - 0x0660
  })
}

/**
 * Locale-aware date formatter.
 * The `j`-prefixed tokens render Jalali for `fa` and Gregorian for other
 * locales (xFormat strips the `j`). Follows the locale set via moment's
 * localize() — keep that in sync with vue-i18n.
 *
 * @example formatDate('2026-05-18T14:00:19Z') // en: "May 18, 2026" / fa: "اردیبهشت 28, 1405"
 */
export function formatDate(value, format = 'jD jMMMM, jYYYY') {
  if (!value) return '-'

  const date = moment(value)

  if (!date.isValid()) return '-'

  return toLatinDigits(date.xFormat(format))
}
