/**
 * Convert camelCase to snake_case
 * @param {string} str
 * @returns {string}
 */
export const toSnakeCase = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
}

/**
 * Convert snake_case to camelCase
 * @param {string} str
 * @returns {string}
 */
export const toCamelCase = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * Converts object/array keys between camelCase and snake_case recursively
 * @param {object|array} obj - The object or array to convert
 * @param {Function} converter - The conversion function (toSnakeCase or toCamelCase)
 * @returns {object|array}
 */
function convertKeys(obj, converter) {
  if (obj === null || obj === undefined) return obj

  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeys(item, converter))
  }

  const result = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const newKey = converter(key)

      result[newKey] = (value && typeof value === 'object')
        ? convertKeys(value, converter)
        : value
    }
  }

  return result
}

/**
 * Converts object/array keys from snake_case to camelCase
 * @example camelKeys({ foo_id: 1, bar_name: 'test' }) // { fooId: 1, barName: 'test' }
 * @param {object|array} obj
 * @returns {object|array}
 */
export function camelKeys(obj) {
  return convertKeys(obj, toCamelCase)
}

/**
 * Converts object/array keys from camelCase to snake_case
 * @example snakeKeys({ fooId: 1, barName: 'test' }) // { foo_id: 1, bar_name: 'test' }
 * @param {object|array} obj
 * @returns {object|array}
 */
export function snakeKeys(obj) {
  return convertKeys(obj, toSnakeCase)
}

/**
 * change Object or Array values to number
 * @example: {foo: "0.2"} => {foo: 0.2}
 * @param value Object
 * @returns {string|any[]|number|{}}
 */
export function numberValues(value) {
  if (value instanceof Array) {
    return value.map(numberValues)
  } else if (typeof value === 'string') {
    if (
      value === '0' ||
      (!isNaN(value) &&
        // if value starts with "." or ends with "."
        !/^[+.0]|\.$/.test(value))
    ) {
      return value * 1
    }
    return value
  } else if (typeof value === 'number') {
    return value
  } else if (value && value.constructor === Object) {
    for (let key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        value[key] = numberValues(value[key])
      }
    }
  }

  return value
}
