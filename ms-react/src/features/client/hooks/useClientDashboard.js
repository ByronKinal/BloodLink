import { useCallback, useEffect, useState } from 'react'
import { fetchMyStats } from '../../../shared/api/reports.api.js'
import { fetchWalletById } from '../../../shared/api/rewards.api.js'
import { fetchTriageForms } from '../../../shared/api/triage.api.js'
import { getStoredAuth } from '../../../shared/utils/auth.store.js'
import { getLatestTriageForm } from '../../../shared/utils/triageLock.js'
import { getTriageFreshnessInfo } from '../../../shared/utils/triageFreshness.js'

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo cargar el dashboard.'
}

function resolveEligibilityStatus(lastForm, freshness) {
  if (!lastForm) {
    return 'sin-triaje'
  }

  if (!freshness.eligible) {
    return 'vencido'
  }

  return lastForm.evaluation?.result === 'APTO' ? 'apto' : 'no-apto'
}

export function useClientDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [walletPoints, setWalletPoints] = useState(0)
  const [eligibility, setEligibility] = useState({
    status: 'sin-triaje',
    daysSinceSubmission: null,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const userId = getStoredAuth()?.user?.id

      const [statsRes, walletRes, triageRes] = await Promise.all([
        fetchMyStats(),
        userId ? fetchWalletById(userId) : Promise.resolve({ data: { data: { balancePoints: 0 } } }),
        fetchTriageForms(userId),
      ])

      setStats(statsRes.data?.data ?? null)

      const walletData = walletRes.data?.data ?? walletRes.data ?? {}
      setWalletPoints(walletData.balancePoints ?? walletData.balance_points ?? 0)

      const lastForm = getLatestTriageForm(triageRes.data?.data ?? [])
      const freshness = getTriageFreshnessInfo(lastForm)

      setEligibility({
        status: resolveEligibilityStatus(lastForm, freshness),
        daysSinceSubmission: freshness.daysSinceSubmission,
      })
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { loading, error, stats, walletPoints, eligibility, refresh: load }
}
