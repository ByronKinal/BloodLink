import { useEffect, useMemo, useState } from 'react'
import {
  fetchBloodBags,
  createBloodBag,
  updateBloodBag,
  deleteBloodBag,
} from '../../../shared/api/bloodBags.api.js'

function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message).join(' · ')
  }

  return error?.response?.data?.message || error?.message || 'No se pudo completar la operación.'
}

export function useEmployeeInventorySection() {
  const [bags, setBags] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalBag, setEditModalBag] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadBags = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetchBloodBags()
        if (!cancelled) {
          setBags(response.data?.data?.bags ?? response.data?.data ?? response.data ?? [])
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

    loadBags()

    return () => {
      cancelled = true
    }
  }, [])

  const refreshBags = async () => {
    try {
      const response = await fetchBloodBags()
      setBags(response.data?.data?.bags ?? response.data?.data ?? response.data ?? [])
    } catch (refreshError) {
      setError(getErrorMessage(refreshError))
    }
  }

  const filteredBags = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return bags
    }

    return bags.filter((bag) => {
      return [bag.bagIdentifier, bag.bloodType, bag.donorUserId, bag.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [search, bags])

  const handleCreate = async (form) => {
    try {
      setSaving(true)
      setError('')

      await createBloodBag({
        bloodType: form.bloodType,
        quantity: Number(form.quantity),
        donorId: form.donorId || undefined,
        collectionDate: form.collectionDate,
        expiryDate: form.expiryDate,
      })

      setCreateModalOpen(false)
      await refreshBags()
    } catch (createError) {
      setError(getErrorMessage(createError))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (form) => {
    if (!editModalBag) {
      return
    }

    try {
      setSaving(true)
      setError('')

      await updateBloodBag(editModalBag.id, {
        bloodType: form.bloodType,
        quantity: Number(form.quantity),
        donorId: form.donorId || undefined,
        collectionDate: form.collectionDate,
        expiryDate: form.expiryDate,
      })

      setEditModalBag(null)
      await refreshBags()
    } catch (updateError) {
      setError(getErrorMessage(updateError))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (bagId) => {
    try {
      setSaving(true)
      setError('')

      await deleteBloodBag(bagId)

      setDeleteConfirmId(null)
      await refreshBags()
    } catch (deleteError) {
      setError(getErrorMessage(deleteError))
    } finally {
      setSaving(false)
    }
  }

  return {
    bags,
    filteredBags,
    loading,
    saving,
    error,
    search,
    setSearch,
    createModalOpen,
    setCreateModalOpen,
    editModalBag,
    setEditModalBag,
    deleteConfirmId,
    setDeleteConfirmId,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
