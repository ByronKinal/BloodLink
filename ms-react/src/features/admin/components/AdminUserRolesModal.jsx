import { Modal } from '../../../shared/components/Modal.jsx'

export function AdminUserRolesModal({ open, user, roles, loading, onClose }) {
  const displayName = user ? `${user.name} ${user.surname ?? ''}`.trim() : 'Usuario'

  return (
    <Modal
      open={open}
      title="Roles del usuario"
      subtitle={displayName}
      onClose={onClose}
      maxWidth="max-w-[560px]"
    >
      <div className="space-y-4">
        <div className="rounded-[14px] border border-gris2 bg-gris1 px-4 py-4">
          <p className="text-[12px] font-semibold text-txt">{displayName}</p>
          <p className="mt-1 text-[12px] text-txt3">{user?.email}</p>
        </div>

        {loading ? (
          <p className="text-[13px] text-txt3">Cargando roles...</p>
        ) : roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className="inline-flex rounded-full bg-[rgba(32,96,160,0.08)] px-3 py-1 text-[11px] font-semibold text-azul-v"
              >
                {role}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-txt3">No se encontraron roles para este usuario.</p>
        )}
      </div>
    </Modal>
  )
}