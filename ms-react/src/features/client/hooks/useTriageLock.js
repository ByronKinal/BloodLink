import { useCallback, useEffect, useState } from 'react'
import { fetchTriageForms } from '../../../shared/api/triage.api.js'
import { getStoredAuth } from '../../../shared/utils/auth.store.js'
import { getLatestTriageForm, getTriageLockInfo } from '../../../shared/utils/triageLock.js'

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo verificar tu estado de triaje.'
}

export function useTriageLock() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lockInfo, setLockInfo] = useState({ blocked: false, hoursRemaining: 0, lastForm: null })

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')

    const userId = getStoredAuth()?.user?.id

    try {
      const response = await fetchTriageForms(userId)
      const forms = response.data?.data ?? []
      const lastForm = getLatestTriageForm(forms)
      setLockInfo(getTriageLockInfo(lastForm))
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { loading, error, ...lockInfo, refresh }
}
