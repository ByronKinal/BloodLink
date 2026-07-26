import { useEffect, useState } from 'react'
import { InputField } from '../../../shared/components/InputField.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'

const BLOOD_TYPE_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function EmployeeInventoryEditModal({
  open,
  bag,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    bloodType: '',
    quantity: '',
    donorId: '',
    collectionDate: '',
    expiryDate: '',
  })

  useEffect(() => {
    if (open && bag) {
      setForm({
        bloodType: bag.bloodType ?? '',
        quantity: bag.volumeMl != null ? String(bag.volumeMl) : '',
        donorId: bag.donorUserId ?? '',
        collectionDate: bag.extractionDate ? bag.extractionDate.slice(0, 10) : '',
        expiryDate: bag.expirationDate ? bag.expirationDate.slice(0, 10) : '',
      })
    }
  }, [open, bag])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onSave({
      bloodType: form.bloodType,
      quantity: form.quantity,
      donorId: form.donorId.trim(),
      collectionDate: form.collectionDate,
      expiryDate: form.expiryDate,
    })
  }

  return (
    <Modal
      open={open}
      title="Editar bolsa"
      subtitle={bag ? `Actualizando ${bag.bagIdentifier}` : 'Editar bolsa del inventario'}
      onClose={onClose}
      maxWidth="max-w-[640px]"
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
            type="submit"
            form="employee-inventory-edit-form"
            disabled={saving}
            className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </>
      }
    >
      <form id="employee-inventory-edit-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-[5px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Tipo de sangre</span>
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              required
              disabled={saving}
              className="border rounded-[10px] px-[15px] py-3 text-[14px] text-txt bg-gris1 outline-none transition-all duration-200 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] border-gris2"
            >
              <option value="">Seleccionar tipo</option>
              {BLOOD_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <InputField
            label="Volumen (ml)"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Ej: 450"
            type="number"
            inputMode="numeric"
            required
            disabled={saving}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="ID del donante"
            name="donorId"
            value={form.donorId}
            onChange={handleChange}
            placeholder="Opcional: ID de usuario"
            disabled={saving}
          />
          <InputField
            label="Fecha de colección"
            name="collectionDate"
            value={form.collectionDate}
            onChange={handleChange}
            type="date"
            required
            disabled={saving}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Fecha de vencimiento"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            type="date"
            required
            disabled={saving}
          />
          <div className="flex flex-col gap-2 rounded-[14px] border border-[rgba(32,96,160,0.12)] bg-[rgba(32,96,160,0.05)] px-4 py-3 text-[12px] text-azul">
            <p className="font-semibold">Importante</p>
            <p>La fecha de vencimiento debe ser posterior a la fecha de colección.</p>
          </div>
        </div>
      </form>
    </Modal>
  )
}
