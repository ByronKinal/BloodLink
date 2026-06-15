export function AdminUsersToolbar({ search, selectedRole, allowedRoles, onSearchChange, onRoleChange, onCreateUser }) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-col gap-3 rounded-[16px] border border-gris2 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,250,0.94))] p-4 shadow-[0_2px_12px_rgba(17,16,24,0.04)] lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[560px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-rojo">Usuarios</p>
          <h3 className="mt-1 font-cormorant text-[26px] font-medium leading-none text-txt sm:text-[30px]">Gestiona altas, roles y datos personales</h3>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <label className="flex-1 min-w-[220px] flex flex-col gap-[5px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Buscar</span>
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Nombre, usuario, correo o rol"
              className="rounded-[10px] border border-gris2 bg-gris1 px-[15px] py-3 text-[14px] text-txt outline-none transition-all duration-200 placeholder-gris3 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)]"
            />
          </label>

          <label className="flex flex-col gap-[5px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Rol</span>
            <select
              value={selectedRole}
              onChange={(event) => onRoleChange(event.target.value)}
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
        <button
          type="button"
          onClick={onCreateUser}
          className="self-start rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v"
        >
          Añadir usuario
        </button>
      </div>
    </div>
  )
}
