import { useEffect, useMemo, useRef, useState } from 'react'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { createUserByAdmin, fetchAllowedRoles, fetchUserRoles, fetchUsersByRole, updateUserByAdmin, updateUserRole } from '../../../shared/api/users.api.js'
import { AdminUsersTable } from './AdminUsersTable.jsx'
import AdminUserCreateModal from './AdminUserCreateModal.jsx'
import { AdminUserEditModal } from './AdminUserEditModal.jsx'
import { AdminUserRolesModal } from './AdminUserRolesModal.jsx'

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

export function AdminUsersSection({ currentUserId }) {
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

  return (
    <div className="space-y-5">
      <DashboardSectionCard
        title="Panel de usuarios"
        subtitle="CRUD administrativo de BloodLink"
      >
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 rounded-[16px] border border-gris2 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,250,0.94))] p-4 shadow-[0_2px_12px_rgba(17,16,24,0.04)] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-rojo">Usuarios</p>
              <h3 className="mt-1 text-[18px] font-semibold text-txt">Gestiona altas, roles y datos personales</h3>
              <p className="mt-1 text-[12px] text-txt3">La tabla y los modales son responsivos y el alta se hace con el panel interno.</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label className="flex-1 min-w-[220px] flex flex-col gap-[5px]">
                <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Buscar</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nombre, usuario, correo o rol"
                  className="rounded-[10px] border border-gris2 bg-gris1 px-[15px] py-3 text-[14px] text-txt outline-none transition-all duration-200 placeholder-gris3 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)]"
                />
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Rol</span>
                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="rounded-[10px] border border-gris2 bg-gris1 px-[15px] py-3 text-[14px] text-txt outline-none transition-all duration-200 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)]"
                >
                  {allowedRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] text-txt3">
              Mostrando usuarios por rol. Puedes crear uno nuevo o cambiar el filtro activo.
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="self-start rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v"
            >
              Añadir usuario
            </button>
          </div>

          <div className="flex flex-wrap gap-2 rounded-[14px] border border-gris2 bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                {(allowedRoles.length > 0 ? allowedRoles : ROLE_FILTERS).map((role) => {
              const isActive = role === selectedRole
              const label = role.replace('_ROLE', '').toLowerCase()

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.04em] transition-all ${isActive ? 'border-rojo bg-rojo text-white shadow-[0_6px_16px_rgba(212,32,64,0.18)]' : 'border-gris2 bg-gris1 text-txt3 hover:border-rojo hover:bg-white hover:text-rojo'}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </DashboardSectionCard>

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {loading || refreshing ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-10 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          {loading ? 'Cargando usuarios...' : 'Actualizando usuarios...'}
        </div>
      ) : filteredUsers.length > 0 ? (
        <AdminUsersTable
          users={filteredUsers}
          onViewRoles={openRolesModal}
          onEditUser={openEditModal}
          onChangeSelectedRole={setSelectedRole}
        />
      ) : (
        <DashboardEmptyState
          icon="👥"
          title="Sin usuarios para mostrar"
          description="Prueba cambiando el rol seleccionado o limpiando el buscador."
        />
      )}

      <AdminUserRolesModal
        open={Boolean(rolesModalUser)}
        user={rolesModalUser}
        roles={rolesModalItems}
        loading={rolesModalLoading}
        onClose={() => setRolesModalUser(null)}
      />

      <AdminUserEditModal
        open={Boolean(editModalUser)}
        user={editModalUser}
        rolesOptions={allowedRoles}
        saving={saving}
        currentUserId={currentUserId}
        onClose={() => setEditModalUser(null)}
        onSave={handleSaveUser}
      />

      <AdminUserCreateModal
        open={createModalOpen}
        saving={saving}
        allowedRoles={allowedRoles}
        defaultRole={selectedRole}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  )
}