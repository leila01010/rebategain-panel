import { storage } from '@/services/storage.service.js'

const RETURN_TO_KEY = 'returnTo'

export function getToken() {
  return storage.get('token')
}

export function saveReturnTo(path) {
  if (path && path !== '/sso') storage.set(RETURN_TO_KEY, path)
}

export function consumeReturnTo() {
  const path = storage.get(RETURN_TO_KEY)
  storage.remove(RETURN_TO_KEY)
  return path || '/'
}

export function redirectToSso() {
  storage.remove('token')
  const ssoUrl = import.meta.env.VITE_APP_SSO_URL
  if (!ssoUrl) {
    console.warn('[auth] SSO_URL is not set; cannot redirect to SSO')
    return
  }
  window.location.href = ssoUrl
}
