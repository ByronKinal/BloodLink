import { useEffect, useState } from 'react'
import { InputField } from '../../../shared/components/InputField.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'

const INITIAL_FORM = {
  name: '',
  surname: '',
  phone: '',
  roleName: '',
}

export function AdminUserEditModal({
  open,
  user,
  rolesOptions,
  saving,
  onClose,
  onSave,
  currentUserId,
  editError,
}) {
  const [form, setForm] = useState(INITIAL_FORM)

  useEffect(() => {
    if (!open || !user) {
      setForm(INITIAL_FORM)
      return
    }

    setForm({
      name: user.name ?? '',
      surname: user.surname ?? '',
      phone: user.phone ?? '',
      roleName: user.role ?? rolesOptions[0] ?? '',
    })
  }, [open, user, rolesOptions])

  const isEditingSelf = user?.id === currentUserId
  const isAdminTarget = user?.role === 'ADMIN_ROLE'
  const roleOptions = rolesOptions.length > 0 ? rolesOptions : ['DONOR_ROLE', 'STAFF_ROLE', 'ADMIN_ROLE']

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSave(form)
  }

  return (
    <Modal
      open={open}
      title="Editar usuario"
      subtitle={user ? `${user.name} ${user.surname ?? ''}`.trim() : ''}
      onClose={onClose}
      maxWidth="max-w-[760px]"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
          >
            Cancelar
          </button>
          <button
            type="button"
            form="admin-user-edit-form"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </>
      }
    >
      <form id="admin-user-edit-form" onSubmit={handleSubmit} className="space-y-5">
        {editError ? (
          <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
            {editError}
          </div>
        ) : null}
        {isAdminTarget && !isEditingSelf ? (
          <div className="rounded-[14px] border border-[rgba(200,148,42,0.25)] bg-[rgba(200,148,42,0.08)] px-4 py-3 text-[12px] text-oro">
            Este usuario tiene ADMIN_ROLE y no debe modificarse desde este panel.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            disabled={saving || (isAdminTarget && !isEditingSelf)}
          />
          <InputField
            label="Apellido"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            placeholder="Apellido"
            required
            disabled={saving || (isAdminTarget && !isEditingSelf)}
          />
        </div>

        <InputField
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Número de teléfono"
          inputMode="tel"
          autoComplete="tel"
          required
          disabled={saving || (isAdminTarget && !isEditingSelf)}
        />

        <div className="flex flex-col gap-[5px]">
          <label className="text-[10px] font-bold tracking-[0.07em] text-txt2 uppercase">Nuevo rol</label>
          <select
            name="roleName"
            value={form.roleName}
            onChange={handleChange}
            disabled={saving || (isAdminTarget && !isEditingSelf)}
            className="border border-gris2 rounded-[10px] px-[15px] py-3 text-[14px] text-txt bg-gris1 outline-none transition-all duration-200 focus:bg-white focus:border-rojo focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-txt3">
            El cambio de rol se ejecutará junto con la actualización del usuario.
          </p>
        </div>
      </form>
    </Modal>
  )
}