import { useEffect, useMemo, useState } from 'react'
import {
  fetchAllRewards,
  createReward as apiCreateReward,
  updateReward as apiUpdateReward,
  deleteReward as apiDeleteReward,
} from '../../../shared/api/rewards.api.js'

function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message).join(' · ')
  }

  return error?.response?.data?.message || error?.message || 'No se pudo completar la operación.'
}

export function useAdminRewardsSection() {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalReward, setEditModalReward] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadRewards = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetchAllRewards()
        if (!cancelled) {
          setRewards(response.data?.data ?? response.data ?? [])
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadRewards()

    return () => {
      cancelled = true
    }
  }, [])

  const refreshRewards = async () => {
    try {
      const response = await fetchAllRewards()
      setRewards(response.data?.data ?? response.data ?? [])
    } catch (refreshError) {
      setError(getErrorMessage(refreshError))
    }
  }

  const filteredRewards = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return rewards
    }

    return rewards.filter((reward) =>
      String(reward.name || '').toLowerCase().includes(query)
    )
  }, [search, rewards])

  const handleCreate = async (form) => {
    try {
      setSaving(true)
      setError('')

      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('requiredPoints', String(form.requiredPoints))
      formData.append('stock', String(form.stock))
      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      await apiCreateReward(formData)

      setCreateModalOpen(false)
      await refreshRewards()
    } catch (createError) {
      setError(getErrorMessage(createError))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (form) => {
    if (!editModalReward) {
      return
    }

    try {
      setSaving(true)
      setError('')

      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('stock', String(form.stock))
      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      await apiUpdateReward(editModalReward.id, formData)

      setEditModalReward(null)
      await refreshRewards()
    } catch (updateError) {
      setError(getErrorMessage(updateError))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (rewardId) => {
    try {
      setSaving(true)
      setError('')

      await apiDeleteReward(rewardId)

      setDeleteConfirmId(null)
      await refreshRewards()
    } catch (deleteError) {
      setError(getErrorMessage(deleteError))
    } finally {
      setSaving(false)
    }
  }

  return {
    rewards,
    filteredRewards,
    loading,
    saving,
    error,
    search,
    setSearch,
    createModalOpen,
    setCreateModalOpen,
    editModalReward,
    setEditModalReward,
    deleteConfirmId,
    setDeleteConfirmId,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
