import { useEffect, useState } from 'react'
import { InputField } from '../../../shared/components/InputField.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'

export function AdminRewardEditModal({
  open,
  reward,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({ name: '', stock: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (open && reward) {
      setForm({
        name: reward.name ?? '',
        stock: reward.stock != null ? String(reward.stock) : '',
      })
      setImageFile(null)
      setImagePreview(reward.imageUrl ?? '')
    }
  }, [open, reward])

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

    await onSave({
      name: form.name.trim(),
      stock: form.stock,
      imageFile: imageFile,
    })
  }

  return (
    <Modal
      open={open}
      title="Editar promoción"
      subtitle={reward ? `Editando: ${reward.name}` : 'Editar premio'}
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
            form="admin-reward-edit-form"
            disabled={saving}
            className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </>
      }
    >
      <form id="admin-reward-edit-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[14px] border border-[rgba(200,148,42,0.18)] bg-[rgba(200,148,42,0.06)] px-4 py-3 text-[12px] text-oro">
          Solo puedes modificar el nombre y el stock. Los puntos requeridos no se pueden cambiar.
        </div>

        {reward ? (
          <div className="rounded-[14px] border border-gris2 bg-gris1 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt3 mb-1">Puntos requeridos (no editable)</p>
            <p className="text-[16px] font-semibold text-txt">{reward.requiredPoints} pts</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-1">
          <InputField
            label="Nombre del premio"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del premio"
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

        <div className="grid gap-4 sm:grid-cols-1">
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
