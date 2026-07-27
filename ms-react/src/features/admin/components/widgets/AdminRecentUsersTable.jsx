const ROLE_LABELS = {
  ADMIN_ROLE: 'Administrador',
  DONOR_ROLE: 'Donante',
  STAFF_ROLE: 'Personal',
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return '—'
  }
}

export function AdminRecentUsersTable({ users }) {
  if (users.length === 0) {
    return null
  }

  return (
    <div>
      <div className="hidden md:grid md:grid-cols-4 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-txt3 border-b border-gris2 bg-[#FAFAF8]">
        <span>Nombre</span>
        <span>Correo</span>
        <span>Rol</span>
        <span>Registro</span>
      </div>

      <div className="divide-y divide-gris2">
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-1 gap-1 px-5 py-3 md:grid-cols-4 md:items-center md:gap-0">
            <span className="text-[13px] font-medium text-txt">
              {user.name} {user.surname ?? ''}
            </span>
            <span className="text-[12px] text-txt3">{user.email}</span>
            <span className="text-[11px] font-semibold text-azul">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
            <span className="text-[11px] text-txt3">{formatDate(user.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
