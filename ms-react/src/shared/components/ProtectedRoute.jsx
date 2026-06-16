import { Navigate } from 'react-router-dom'
import { getStoredAuth, isAdmin, isEmployee } from '../utils/auth.store.js'

export function ProtectedRoute({ children, adminOnly = false, clientOnly = false, employeeOnly = false }) {
  const auth = getStoredAuth()

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin(auth)) {
    return <Navigate to="/dashboard" replace />
  }

  if (employeeOnly && !isEmployee(auth)) {
    return <Navigate to="/dashboard" replace />
  }

  if (clientOnly && (isAdmin(auth) || isEmployee(auth))) {
    return isAdmin(auth) ? <Navigate to="/admin" replace /> : <Navigate to="/employee" replace />
  }

  return children
}
