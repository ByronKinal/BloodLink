import { useEffect, useState } from 'react'
import { InputField } from '../../../shared/components/InputField.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'

const INITIAL_FORM = {
  name: '',
  requiredPoints: '',
  stock: '',
}

export function AdminRewardCreateModal({
  open,
  saving,
  onClose,
  onCreate,
}) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setImageFile(null)
      setImagePreview('')
    }
  }, [open])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onCreate({
      name: form.name.trim(),
      requiredPoints: form.requiredPoints,
      stock: form.stock,
      imageFile: imageFile,
    })
  }

  return (
    <Modal
      open={open}
      title="Nueva promoción"
      subtitle="Crear un nuevo premio o recompensa"
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
            form="admin-reward-create-form"
            disabled={saving}
            className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Creando...' : 'Crear promoción'}
          </button>
        </>
      }
    >
      <form id="admin-reward-create-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[14px] border border-[rgba(32,96,160,0.12)] bg-[rgba(32,96,160,0.05)] px-4 py-3 text-[12px] text-azul">
          Todos los campos son obligatorios. Los puntos requeridos y el stock deben ser números enteros ≥ 1.
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          <InputField
            label="Nombre del premio"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Gorra BloodLink, Taza conmemorativa"
            required
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-txt">Imagen del premio (opcional)</label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-gris2 bg-gris1">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </div>
            <label className="flex cursor-pointer items-center justify-center rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[12px] font-semibold text-txt transition-colors hover:border-rojo hover:text-rojo">
              <span>Seleccionar imagen</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={saving}
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview('')
                }}
                className="text-[12px] text-rojo hover:underline"
                disabled={saving}
              >
                Quitar
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Puntos requeridos"
            name="requiredPoints"
            value={form.requiredPoints}
            onChange={handleChange}
            placeholder="Ej: 100"
            type="number"
            inputMode="numeric"
            required
            disabled={saving}
          />
          <InputField
            label="Stock disponible"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Ej: 50"
            type="number"
            inputMode="numeric"
            required
            disabled={saving}
          />
        </div>
      </form>
    </Modal>
  )
}
