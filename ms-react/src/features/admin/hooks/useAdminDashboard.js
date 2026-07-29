import { useCallback, useEffect, useState } from 'react'
import { fetchUsersByRole } from '../../../shared/api/users.api.js'
import { fetchStockSummary } from '../../../shared/api/reports.api.js'
import { getCriticalBloodTypes } from '../../../shared/utils/bloodStock.js'

const ROLES = ['ADMIN_ROLE', 'DONOR_ROLE', 'STAFF_ROLE']
const RECENT_USERS_LIMIT = 5

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo cargar el dashboard.'
}

function extractUsers(response) {
  return response.data?.data ?? response.data ?? []
}

function buildRecentUsers(usersByRole) {
  return Object.values(usersByRole)
    .flat()
    .filter((user) => user.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_USERS_LIMIT)
}

export function useAdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [usersByRole, setUsersByRole] = useState({ ADMIN_ROLE: [], DONOR_ROLE: [], STAFF_ROLE: [] })
  const [recentUsers, setRecentUsers] = useState([])
  const [stockSummary, setStockSummary] = useState(null)
  const [criticalBloodTypes, setCriticalBloodTypes] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [adminUsers, donorUsers, staffUsers, stockRes] = await Promise.all([
        fetchUsersByRole('ADMIN_ROLE'),
        fetchUsersByRole('DONOR_ROLE'),
        fetchUsersByRole('STAFF_ROLE'),
        fetchStockSummary(),
      ])

      const byRole = {
        ADMIN_ROLE: extractUsers(adminUsers),
        DONOR_ROLE: extractUsers(donorUsers),
        STAFF_ROLE: extractUsers(staffUsers),
      }

      setUsersByRole(byRole)
      setRecentUsers(buildRecentUsers(byRole))

      const summary = stockRes.data?.data ?? null
      setStockSummary(summary)
      setCriticalBloodTypes(getCriticalBloodTypes(summary?.byBloodType))
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totalUsers = ROLES.reduce((sum, role) => sum + (usersByRole[role]?.length ?? 0), 0)

  return {
    loading,
    error,
    totalUsers,
    usersByRole,
    recentUsers,
    stockSummary,
    criticalBloodTypes,
    refresh: load,
  }
}
