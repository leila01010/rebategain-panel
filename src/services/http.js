import axios from 'axios'
import { storage } from '@/services/storage.service.js'
import { camelKeys, snakeKeys } from '@/utils'
import { message } from '@/lib/ui-kit'
import { redirectToSso, saveReturnTo } from '@/services/auth.service.js'
import { i18n } from '@/i18n.js'

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  headers: { 'Content-Type': 'application/json' },
  transformRequest: [
    data => {
      if (data && !(data instanceof FormData)) return snakeKeys(data)
      return data
    },
    ...axios.defaults.transformRequest
  ],
  timeout: 10_000,
})

http.interceptors.request.use(config => {
  const token = storage.get('token')

  if (token) config.headers.Authorization = `Bearer ${token}`

  config.headers['Accept-Language'] = i18n.global.locale.value

  if (config.params) config.params = snakeKeys(config.params)

  if (config.data instanceof FormData) delete config.headers['Content-Type']

  return config
})

http.interceptors.response.use(
  response => {
    let data = response.data

    if (data instanceof Blob || data instanceof ArrayBuffer) return data

    try {
      return camelKeys(data)
    } catch {
      return data
    }
  },
  error => {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return Promise.resolve(error)
    }

    const status  = error?.status
    const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !navigator.onLine)
    const errors = error.response?.data?.errors ?? null
    const fieldMessages = errors
      ? Object.values(errors).flat().filter(Boolean)
      : []
    const topMessage = error.response?.data?.message ?? error.message
    const errorMessage = isNetworkError
      ? i18n.global.t('common.networkError')
      : fieldMessages.length
        ? fieldMessages.join('\n')
        : topMessage

    if (status === 401) {
      message.error(i18n.global.t('common.unauthorizedError'))
      saveReturnTo(window.location.pathname + window.location.search)
      redirectToSso()
    } else if (isNetworkError) {
      message.error(errorMessage)
    } else if (status >= 400 && status < 500) {
      message.error(errorMessage)
    } else if (status >= 500) {
      message.error(i18n.global.t('common.serverError'))
    } else if (error) {
      console.log(error)
    }

    return Promise.reject({ status, error: errorMessage, errors })
  }
)

export default http
