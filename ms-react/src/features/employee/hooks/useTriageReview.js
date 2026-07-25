import { useCallback, useEffect, useState } from 'react'
import { fetchTriageForms, updateTriageStatus } from '../../../shared/api/triage.api.js'
import { fetchProfileByUserId } from '../../../shared/api/profiles.api.js'

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudieron cargar los formularios de triaje.'
}

async function buildEmailMap(forms) {
  const uniqueAccountIds = [...new Set(forms.map((form) => form.accountId))]

  const entries = await Promise.all(
    uniqueAccountIds.map(async (accountId) => {
      try {
        const response = await fetchProfileByUserId(accountId)
        return [accountId, response.data?.data?.email ?? null]
      } catch {
        return [accountId, null]
      }
    })
  )

  return Object.fromEntries(entries)
}

export function useTriageReview() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewingId, setReviewingId] = useState(null)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, tone = 'success') => setToast({ message, tone })
  const dismissToast = () => setToast(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchTriageForms()
      const rawForms = response.data?.data ?? []
      const emailByAccountId = await buildEmailMap(rawForms)

      setForms(
        rawForms.map((form) => ({
          ...form,
          donorEmail: emailByAccountId[form.accountId] ?? null,
          reviewStatus: form.reviewStatus ?? 'PENDIENTE',
        }))
      )
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openDetail = (formId) => setSelectedFormId(formId)
  const closeDetail = () => setSelectedFormId(null)

  const reviewTriage = async (formId, status) => {
    setReviewingId(formId)

    try {
      const response = await updateTriageStatus(formId, status)
      const updatedStatus = response.data?.data?.reviewStatus ?? status

      setForms((current) =>
        current.map((form) => (form.id === formId ? { ...form, reviewStatus: updatedStatus } : form))
      )
      closeDetail()
      showToast(
        status === 'APROBADO' ? 'Formulario aprobado correctamente.' : 'Formulario rechazado.',
        status === 'APROBADO' ? 'success' : 'error'
      )
    } catch (reviewError) {
      showToast(getErrorMessage(reviewError), 'error')
    } finally {
      setReviewingId(null)
    }
  }

  const selectedForm = forms.find((form) => form.id === selectedFormId) ?? null

  return {
    forms,
    loading,
    error,
    reviewingId,
    selectedForm,
    openDetail,
    closeDetail,
    reviewTriage,
    refresh: load,
    toast,
    dismissToast,
  }
}
