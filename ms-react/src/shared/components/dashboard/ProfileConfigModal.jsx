import { useState, useRef, useEffect } from 'react'
import { Modal } from '../Modal.jsx'
import { UserAvatar } from '../UserAvatar.jsx'
import { updateMyProfile } from '../../api/ProfileApi.js'
import { saveAuth, getStoredAuth } from '../../utils/auth.store.js'

export function ProfileConfigModal({ open, onClose, user, onUpdate }) {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const fileInputRef = useRef(null)

  // Sincronizar el estado local cuando el modal se abre o cambia el usuario
  useEffect(() => {
    if (open && user) {
      setName(user.name || '')
      setSurname(user.surname || '')
      setPhone(user.phone || '')
      setPreviewUrl(user.profilePicture || '')
      setProfilePicture(null)
      setMessage({ text: '', type: '' })
    }
  }, [open, user])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setMessage({ text: 'El nombre es obligatorio', type: 'error' })
      return
    }

    if (!surname.trim()) {
      setMessage({ text: 'El apellido es obligatorio', type: 'error' })
      return
    }

    if (phone && !/^\d{8}$/.test(phone.trim())) {
      setMessage({ text: 'El número de teléfono debe tener exactamente 8 dígitos', type: 'error' })
      return
    }

    try {
      setSaving(true)
      setMessage({ text: '', type: '' })

      const payload = {
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim()
      }

      if (profilePicture) {
        payload.profilePicture = profilePicture
      }

      const response = await updateMyProfile(user.id, payload)
      
      if (response.data?.success) {
        const updatedUser = response.data.data
        
        // Actualizar datos de sesión local
        const auth = getStoredAuth()
        saveAuth({
          ...auth,
          user: updatedUser
        })

        // Notificar al componente padre del cambio
        if (onUpdate) {
          onUpdate()
        }

        setMessage({ text: 'Configuración de cuenta actualizada exitosamente', type: 'success' })
        setProfilePicture(null)

        // Cerrar modal automáticamente después de 1.5 segundos
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setMessage({ text: response.data?.message || 'Error al actualizar la configuración', type: 'error' })
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMsg = err.response?.data?.message || 'Error de red. Por favor, intenta de nuevo.'
      setMessage({ text: errorMsg, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configuración de Cuenta"
      subtitle="Actualiza tu información personal y foto de perfil"
      maxWidth="max-w-[640px]"
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        
        {/* Banner de Mensajes */}
        {message.text ? (
          <div className={`rounded-[10px] px-4 py-3 text-[13px] font-medium border ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-red-50 text-rojo border-red-100'
          }`}>
            {message.text}
          </div>
        ) : null}

        {/* Contenedor de Edición de Foto de Perfil */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-4 border-b border-gris2">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-gris2 bg-gris1 flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
            <UserAvatar
              src={previewUrl}
              displayName={name}
              className="w-full h-full"
            />
            <div 
              onClick={triggerFileInput}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
            >
              <span className="text-[10px] text-white font-bold uppercase tracking-wider text-center px-1">
                Cambiar
              </span>
            </div>
          </div>
          
          <div className="text-center sm:text-left space-y-2">
            <h5 className="text-[13px] font-bold text-txt">Foto de Perfil</h5>
            <p className="text-[11px] text-txt3 font-light">
              Sube una imagen cuadrada (PNG, JPG o WEBP) de hasta 5MB.
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              className="inline-flex items-center px-3 py-1.5 rounded-[8px] bg-gris1 border border-gris2 text-[11px] font-bold text-txt hover:bg-gris2 transition-colors duration-200 cursor-pointer"
            >
              Seleccionar archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Campos de Texto del Formulario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[11px] font-bold text-txt3 uppercase tracking-wider">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-[10px] bg-gris1 border border-gris2 text-[13px] text-txt placeholder-txt3 focus:outline-none focus:border-rojo focus:ring-1 focus:ring-rojo transition-all duration-200"
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="surname" className="text-[11px] font-bold text-txt3 uppercase tracking-wider">
              Apellido
            </label>
            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-[10px] bg-gris1 border border-gris2 text-[13px] text-txt placeholder-txt3 focus:outline-none focus:border-rojo focus:ring-1 focus:ring-rojo transition-all duration-200"
              placeholder="Ingresa tu apellido"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[11px] font-bold text-txt3 uppercase tracking-wider block">
              Correo Electrónico (No editable)
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-[10px] bg-gris2 border border-gris2 text-[13px] text-txt3 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-[11px] font-bold text-txt3 uppercase tracking-wider">
              Teléfono (8 dígitos)
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-[10px] bg-gris1 border border-gris2 text-[13px] text-txt placeholder-txt3 focus:outline-none focus:border-rojo focus:ring-1 focus:ring-rojo transition-all duration-200"
              placeholder="Ej. 12345678"
              maxLength={8}
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gris2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-[10px] bg-transparent border border-gris3 text-txt hover:bg-gris1 disabled:text-txt3 font-bold text-[13px] transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-[10px] bg-rojo hover:bg-[rgba(212,32,64,0.9)] disabled:bg-gris2 text-white font-bold text-[13px] tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center min-w-[140px] cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>

      </form>
    </Modal>
  )
}
