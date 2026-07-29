export function AdminRoleFilterPills({ roles, selectedRole, onSelectRole }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[14px] border border-gris2 bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {roles.map((role) => {
        const isActive = role === selectedRole
        const label = role.replace('_ROLE', '').toLowerCase()

        return (
          <button
            key={role}
            type="button"
            onClick={() => onSelectRole(role)}
            className={`rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.04em] transition-all ${isActive ? 'border-rojo bg-rojo text-white shadow-[0_6px_16px_rgba(212,32,64,0.18)]' : 'border-gris2 bg-gris1 text-txt3 hover:border-rojo hover:bg-white hover:text-rojo'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
