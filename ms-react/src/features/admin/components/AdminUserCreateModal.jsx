import { useEffect, useState } from 'react'
import { InputField } from '../../../shared/components/InputField.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'

const INITIAL_FORM = {
  name: '',
  surname: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  bloodType: 'O+',
  roleName: 'DONOR_ROLE',
  zone: '',
  municipality: '',
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function AdminUserCreateModal({
  open,
  saving,
  allowedRoles,
  defaultRole,
  onClose,
  onCreate,
  createError,
  clearCreateError,
}) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setForm({ ...INITIAL_FORM, roleName: defaultRole || 'DONOR_ROLE' })
      setError('')
      return
    }

    setForm((current) => ({
      ...current,
      roleName: defaultRole || current.roleName || 'DONOR_ROLE',
    }))
  }, [open, defaultRole])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
    clearCreateError()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onCreate({
      ...form,
      name: form.name.trim(),
      surname: form.surname.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      bloodType: form.bloodType,
      roleName: form.roleName,
      zone: form.zone.trim(),
      municipality: form.municipality.trim(),
    })
  }

  const roleOptions = allowedRoles.length > 0 ? allowedRoles : ['DONOR_ROLE', 'STAFF_ROLE', 'ADMIN_ROLE']

  return (
    <Modal
      open={open}
      title="Nuevo usuario"
      subtitle="Alta administrada desde el panel"
      onClose={onClose}
      maxWidth="max-w-[920px]"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              clearCreateError()
              onClose()
            }}
            className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="admin-user-create-form"
            disabled={saving}
            className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Creando...' : 'Crear usuario'}
          </button>
        </>
      }
    >
      <form id="admin-user-create-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[14px] border border-[rgba(32,96,160,0.12)] bg-[rgba(32,96,160,0.05)] px-4 py-3 text-[12px] text-azul-v">
          El usuario quedará activo y verificado al crearse. Zone y municipality son opcionales.
        </div>

        {(error || createError) ? (
          <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[12px] text-rojo">
            {error || createError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InputField label="Nombre" name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required disabled={saving} />
          <InputField label="Apellido" name="surname" value={form.surname} onChange={handleChange} placeholder="Apellido" required disabled={saving} />
          <InputField label="Usuario" name="username" value={form.username} onChange={handleChange} placeholder="username" required disabled={saving} />
          <InputField label="Correo" name="email" value={form.email} onChange={handleChange} placeholder="correo@dominio.com" type="email" autoComplete="email" required disabled={saving} />
          <InputField label="Contraseña" name="password" value={form.password} onChange={handleChange} placeholder="Contraseña temporal" type="password" autoComplete="new-password" required disabled={saving} />
          <InputField label="Teléfono" name="phone" value={form.phone} onChange={handleChange} placeholder="8 dígitos" inputMode="tel" autoComplete="tel" required disabled={saving} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-[5px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Tipo de sangre</span>
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              disabled={saving}
              className="rounded-[10px] border border-gris2 bg-gris1 px-[15px] py-3 text-[14px] text-txt outline-none transition-all duration-200 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {BLOOD_TYPES.map((bloodType) => (
                <option key={bloodType} value={bloodType}>{bloodType}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-[5px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Rol inicial</span>
            <select
              name="roleName"
              value={form.roleName}
              onChange={handleChange}
              disabled={saving}
              className="rounded-[10px] border border-gris2 bg-gris1 px-[15px] py-3 text-[14px] text-txt outline-none transition-all duration-200 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Zona" name="zone" value={form.zone} onChange={handleChange} placeholder="Zona" disabled={saving} />
          <InputField label="Municipio" name="municipality" value={form.municipality} onChange={handleChange} placeholder="Municipio" disabled={saving} />
        </div>
      </form>
    </Modal>
  )
}

export default AdminUserCreateModal