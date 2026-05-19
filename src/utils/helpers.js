import moment from '@/lib/moment.js'

export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  if (value == null) return '-'

  const number = Number(value)

  if (isNaN(number)) return ''

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

// Persian (06F0–06F9) and Arabic-Indic (0660–0669) digits → Latin
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
