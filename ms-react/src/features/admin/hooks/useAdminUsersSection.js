import { useEffect, useMemo, useRef, useState } from 'react'
import { createUserByAdmin, fetchAllowedRoles, fetchUserRoles, fetchUsersByRole, updateUserByAdmin, updateUserRole, updateUserStatusByAdmin } from '../../../shared/api/users.api.js'

const DEFAULT_ROLE = 'DONOR_ROLE'
const ROLE_FILTERS = ['ADMIN_ROLE', 'DONOR_ROLE', 'STAFF_ROLE']

function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message).join(' · ')
  }

  return error?.response?.data?.message || error?.message || 'No se pudo completar la operación.'
}

function normalizeRoles(roles) {
  return [...new Set((roles || []).map((role) => String(role).trim().toUpperCase()).filter(Boolean))]
}

function getVisibleRoles(roles) {
  normalizeRoles(roles)

  return ROLE_FILTERS
}

export function useAdminUsersSection() {
  const [allowedRoles, setAllowedRoles] = useState(ROLE_FILTERS)
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [rolesModalUser, setRolesModalUser] = useState(null)
  const [rolesModalLoading, setRolesModalLoading] = useState(false)
  const [rolesModalItems, setRolesModalItems] = useState([])

  const [editModalUser, setEditModalUser] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const initialLoadCompleted = useRef(false)

  useEffect(() => {
    let cancelled = false

    const loadInitialData = async () => {
      setLoading(true)
      setError('')

      try {
        const [allowedRolesResponse, usersResponse] = await Promise.all([
          fetchAllowedRoles(),
          fetchUsersByRole(DEFAULT_ROLE),
        ])

        if (cancelled) {
          return
        }

        const roles = getVisibleRoles(allowedRolesResponse.data?.data ?? allowedRolesResponse.data ?? [])
        setAllowedRoles(roles.length > 0 ? roles : ROLE_FILTERS)
        setUsers(usersResponse.data?.data ?? usersResponse.data ?? [])
      } catch (loadError) {
        if (!cancelled) {
          setAllowedRoles(ROLE_FILTERS)
          setError(getErrorMessage(loadError))
        }
      } finally {
        if (!cancelled) {
          initialLoadCompleted.current = true
          setLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (selectedRole === DEFAULT_ROLE && !initialLoadCompleted.current) {
      return
    }

    let cancelled = false

    const loadUsers = async () => {
      setRefreshing(true)
      setError('')

      try {
        const response = await fetchUsersByRole(selectedRole)
        if (!cancelled) {
          setUsers(response.data?.data ?? response.data ?? [])
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError))
        }
      } finally {
        if (!cancelled) {
          setRefreshing(false)
        }
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [selectedRole])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((user) => {
      return [user.name, user.surname, user.username, user.email, user.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [search, users])

  const openRolesModal = async (user) => {
    setRolesModalUser(user)
    setRolesModalItems([])
    setRolesModalLoading(true)

    try {
      const response = await fetchUserRoles(user.id)
      setRolesModalItems(normalizeRoles(response.data?.data ?? response.data ?? []))
    } catch (loadError) {
      setRolesModalItems([])
      setError(getErrorMessage(loadError))
    } finally {
      setRolesModalLoading(false)
    }
  }

  const openEditModal = (user) => {
    setEditModalUser(user)
  }

  const openCreateModal = () => {
    setCreateModalOpen(true)
  }

  const handleSaveUser = async (form) => {
    if (!editModalUser) {
      return
    }

    const payload = {
      name: form.name.trim(),
      surname: form.surname.trim(),
      phone: form.phone.trim(),
    }

    try {
      setSaving(true)
      setError('')

      await updateUserByAdmin(editModalUser.id, payload)

      if (form.roleName && form.roleName !== editModalUser.role) {
        await updateUserRole(editModalUser.id, form.roleName)
      }

      const response = await fetchUsersByRole(selectedRole)
      setUsers(response.data?.data ?? response.data ?? [])
      setEditModalUser(null)
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      setSaving(true)
      setError('')

      await updateUserStatusByAdmin(user.id, !user.status)

      const response = await fetchUsersByRole(selectedRole)
      setUsers(response.data?.data ?? response.data ?? [])
    } catch (toggleError) {
      setError(getErrorMessage(toggleError))
    } finally {
      setSaving(false)
    }
  }

  const handleCreateUser = async (form) => {
    try {
      setSaving(true)
      setError('')

      const response = await createUserByAdmin(form)
      const createdUser = response.data?.data ?? response.data ?? null
      const nextRole = typeof createdUser?.role === 'string'
        ? createdUser.role
        : form.roleName || selectedRole

      setCreateModalOpen(false)
      setSelectedRole(nextRole)

      const refreshed = await fetchUsersByRole(nextRole)
      setUsers(refreshed.data?.data ?? refreshed.data ?? [])
    } catch (createError) {
      setError(getErrorMessage(createError))
    } finally {
      setSaving(false)
    }
  }

  return {
    allowedRoles,
    selectedRole,
    setSelectedRole,
    search,
    setSearch,
    users,
    filteredUsers,
    loading,
    refreshing,
    error,
    saving,
    rolesModalUser,
    rolesModalLoading,
    rolesModalItems,
    editModalUser,
    createModalOpen,
    openRolesModal,
    openEditModal,
    openCreateModal,
    handleSaveUser,
    handleToggleStatus,
    handleCreateUser,
    setRolesModalUser,
    setEditModalUser,
    setCreateModalOpen,
  }
}
