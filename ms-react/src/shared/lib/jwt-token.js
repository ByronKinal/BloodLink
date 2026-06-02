import { JWT_STORAGE_KEY } from '../config/api.js'

export function getJwtToken() {
  return window.localStorage.getItem(JWT_STORAGE_KEY)
}

export function setJwtToken(token) {
  window.localStorage.setItem(JWT_STORAGE_KEY, token)
}

export function clearJwtToken() {
  window.localStorage.removeItem(JWT_STORAGE_KEY)
}