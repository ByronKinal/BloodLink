import { Navigate } from 'react-router-dom'
import { getStoredAuth, isAdmin } from '../utils/auth.store.js'

export function ProtectedRoute({ children, adminOnly = false, clientOnly = false }) {
  const auth = getStoredAuth()

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin(auth)) {
    return <Navigate to="/dashboard" replace />
  }

  if (clientOnly && isAdmin(auth)) {
    return <Navigate to="/admin" replace />
  }

  return children
}
