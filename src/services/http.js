import axios from 'axios'
import { storage } from '@/services/storage.service.js'
import { camelKeys, snakeKeys } from '@/utils'

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

  if (config.params) config.params = snakeKeys(config.params)

  return config
})

http.interceptors.response.use(
  response => {
    let data = response.data?.data ?? response.data

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
    const errorMessage = error.response?.data?.message ?? error.message

    if (status === 401) {
      // handle auth globally
    } else if (error) {
      // handle auth globally
    }

    return Promise.reject({ status, error: errorMessage, errors: error.response?.data?.errors ?? null })
  }
)

export default http
