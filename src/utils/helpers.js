export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  if (value == null) return ''

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
