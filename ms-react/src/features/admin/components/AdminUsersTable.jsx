function formatUserStatus(status) {
  return status ? 'Activo' : 'Suspendido'
}

function getInitials(user) {
  const firstLetter = user.name?.[0] ?? user.username?.[0] ?? 'U'
  const secondLetter = user.surname?.[0] ?? user.email?.[0] ?? ''
  return `${firstLetter}${secondLetter}`.toUpperCase()
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

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

export function AdminUsersTable({ users, onViewRoles, onEditUser, onToggleStatus, currentUserId }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between border-b border-gris2 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[13px] font-semibold text-txt">Usuarios del sistema</p>
        </div>
        <div className="hidden rounded-full bg-[rgba(184,28,50,0.08)] px-3 py-1 text-[11px] font-medium text-rojo sm:inline-flex">
          {users.length} usuarios
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gris2">
          <thead className="bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">Contacto</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Registro</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris2 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="align-top">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(184,28,50,0.08)] text-[12px] font-bold text-rojo">
                      {getInitials(user)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-txt">
                        {user.name} {user.surname ?? ''}
                      </p>
                      <p className="text-[11px] text-txt3">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[12px] text-txt3">
                  <p>{user.email}</p>
                  <p>{user.phone || 'Sin teléfono'}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[rgba(32,96,160,0.08)] px-3 py-1 text-[11px] font-semibold text-azul-v">
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${user.status ? 'bg-[rgba(40,160,96,0.1)] text-verde-v' : 'bg-[rgba(200,148,42,0.1)] text-oro'}`}>
                    {formatUserStatus(user.status)}
                  </span>
                </td>
                <td className="px-5 py-4 text-[12px] text-txt3">{formatDate(user.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onViewRoles(user)}
                      className="rounded-[10px] border border-gris2 bg-white px-3 py-2 text-[12px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
                    >
                      Ver roles
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditUser(user)}
                      className="rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v"
                    >
                      Editar
                    </button>
                    {user.role !== 'ADMIN_ROLE' && user.id !== currentUserId ? (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user)}
                        className={`rounded-[10px] border px-3 py-2 text-[12px] font-medium transition-colors ${user.status ? 'border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] text-rojo hover:border-rojo hover:bg-[rgba(212,32,64,0.1)]' : 'border-[rgba(40,160,96,0.2)] bg-[rgba(40,160,96,0.08)] text-verde-v hover:border-verde-v hover:bg-[rgba(40,160,96,0.14)]'}`}
                      >
                        {user.status ? 'Suspender' : 'Reactivar'}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden sm:p-5">
        {users.map((user) => (
          <article key={user.id} className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(184,28,50,0.08)] text-[12px] font-bold text-rojo">
                {getInitials(user)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-txt">
                      {user.name} {user.surname ?? ''}
                    </p>
                    <p className="text-[11px] text-txt3">@{user.username}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${user.status ? 'bg-[rgba(40,160,96,0.1)] text-verde-v' : 'bg-[rgba(200,148,42,0.1)] text-oro'}`}>
                    {formatUserStatus(user.status)}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-[12px] text-txt3">
                  <p>{user.email}</p>
                  <p>{user.phone || 'Sin teléfono'}</p>
                  <p>{user.role}</p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onViewRoles(user)}
                className="flex-1 rounded-[10px] border border-gris2 bg-white px-3 py-2 text-[12px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
              >
                Ver roles
              </button>
              <button
                type="button"
                onClick={() => onEditUser(user)}
                className="flex-1 rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v"
              >
                Editar
              </button>
              {user.role !== 'ADMIN_ROLE' && user.id !== currentUserId ? (
                <button
                  type="button"
                  onClick={() => onToggleStatus(user)}
                  className={`flex-1 rounded-[10px] border px-3 py-2 text-[12px] font-medium transition-colors ${user.status ? 'border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] text-rojo hover:border-rojo hover:bg-[rgba(212,32,64,0.1)]' : 'border-[rgba(40,160,96,0.2)] bg-[rgba(40,160,96,0.08)] text-verde-v hover:border-verde-v hover:bg-[rgba(40,160,96,0.14)]'}`}
                >
                  {user.status ? 'Suspender' : 'Reactivar'}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}