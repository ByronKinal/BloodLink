import { useEffect, useState } from 'react'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { AdminUsersTable } from './AdminUsersTable.jsx'
import AdminUserCreateModal from './AdminUserCreateModal.jsx'
import { AdminUserEditModal } from './AdminUserEditModal.jsx'
import { AdminUserRolesModal } from './AdminUserRolesModal.jsx'
import { AdminRoleFilterPills } from './AdminRoleFilterPills.jsx'
import { AdminUsersToolbar } from './AdminUsersToolbar.jsx'
import { useAdminUsersSection } from '../hooks/useAdminUsersSection.js'

export function AdminUsersSection({ currentUserId }) {
  const {
    allowedRoles,
    selectedRole,
    setSelectedRole,
    search,
    setSearch,
    filteredUsers,
    loading,
    refreshing,
    error,
    createError,
    editError,
    createSuccessMessage,
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
    clearCreateError,
    clearCreateSuccessMessage,
    clearEditError,
    setRolesModalUser,
    setEditModalUser,
    setCreateModalOpen,
  } = useAdminUsersSection()

  const [toastMessage, setToastMessage] = useState('')
  useEffect(() => {
    if (createSuccessMessage) {
      setToastMessage(createSuccessMessage)
      const t = setTimeout(() => {
        setToastMessage('')
        clearCreateSuccessMessage()
      }, 4000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [createSuccessMessage, clearCreateSuccessMessage])

  return (
    <div className="space-y-5">
      <DashboardSectionCard title="Panel de usuarios">
        <div className="px-4 pt-4 sm:px-5 sm:pt-5">
          <AdminUsersToolbar
            search={search}
            selectedRole={selectedRole}
            allowedRoles={allowedRoles}
            onSearchChange={setSearch}
            onRoleChange={setSelectedRole}
            onCreateUser={openCreateModal}
          />

          <AdminRoleFilterPills
            roles={allowedRoles}
       onSave={(form) => handleSaveUser(form, currentUserId)}
            onSelectRole={setSelectedRole}
          />
        </div>
      </DashboardSectionCard>

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-[10px] border border-[rgba(22,163,74,0.2)] bg-[rgba(22,163,74,0.06)] px-4 py-3 text-[13px] text-emerald-700 shadow">
          {toastMessage}
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
          onToggleStatus={handleToggleStatus}
          currentUserId={currentUserId}
        />
      ) : (
        <DashboardEmptyState
          icon="👥"
          title="Sin usuarios para mostrar"
          description="Prueba cambiando el rol seleccionado o limpiando el buscador."
        />
      )}

      {/* success messages are shown as transient toasts via Notyf */}

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
        editError={editError}
        onClose={() => {
          clearEditError()
          setEditModalUser(null)
        }}
          onSave={(form) => handleSaveUser(form, currentUserId)}
      />

      <AdminUserCreateModal
        open={createModalOpen}
        saving={saving}
        allowedRoles={allowedRoles}
        defaultRole={selectedRole}
        onClose={() => {
          clearCreateError()
          setCreateModalOpen(false)
        }}
        onCreate={handleCreateUser}
        createError={createError}
        clearCreateError={clearCreateError}
      />
    </div>
  )
}
