const AUTH_KEY = 'bl_auth'

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveAuth({ accessToken, refreshToken, user }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ accessToken, refreshToken, user }))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function isAdmin(auth) {
  const role = auth?.user?.role
  return role === 'ADMIN_ROLE' || role === 'STAFF_ROLE'
}
