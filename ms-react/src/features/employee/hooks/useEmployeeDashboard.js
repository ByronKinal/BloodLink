import { useCallback, useEffect, useState } from 'react'
import { fetchStaffAgenda } from '../../../shared/api/appointments.api.js'
import { fetchStockSummary } from '../../../shared/api/reports.api.js'
import { getCriticalBloodTypes } from '../../../shared/utils/bloodStock.js'

function todayDateKey() {
  return new Date().toISOString().slice(0, 10)
}

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo cargar el dashboard.'
}

export function useEmployeeDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [agendaStats, setAgendaStats] = useState({ total: 0, pending: 0, confirmed: 0 })
  const [stockSummary, setStockSummary] = useState(null)
  const [criticalBloodTypes, setCriticalBloodTypes] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [agendaRes, stockRes] = await Promise.all([
        fetchStaffAgenda(todayDateKey()),
        fetchStockSummary(),
      ])

      const appointments = agendaRes.data?.data ?? []
      const pending = appointments.filter((appointment) => appointment.status === 'PENDING').length
      const confirmed = appointments.filter((appointment) => appointment.status === 'CONFIRMED').length
      setAgendaStats({ total: pending + confirmed, pending, confirmed })

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

  return { loading, error, agendaStats, stockSummary, criticalBloodTypes, refresh: load }
}
