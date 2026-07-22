import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField }    from '../../../shared/components/InputField.jsx'
import { PasswordField } from '../../../shared/components/PasswordField.jsx'
import { registerUser }  from '../../../shared/api/auth.api.js'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const INITIAL = {
  name: '', surname: '', username: '', email: '',
  password: '', confirmPassword: '',
  phone: '', bloodType: '', zone: '', municipality: '',
  profilePicture: null,
}

export function RegisterForm() {
  const navigate                = useNavigate()
  const [step, setStep]         = useState(1)
  const [form, setForm]         = useState(INITIAL)
  const [errors, setErrors]     = useState({})
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess]   = useState(false)
  const fileRef                 = useRef(null)

  const handle = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(p => ({ ...p, profilePicture: file }))
    setPreview(URL.createObjectURL(file))
    if (errors.profilePicture) setErrors(p => ({ ...p, profilePicture: '' }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setForm(p => ({ ...p, profilePicture: file }))
    setPreview(URL.createObjectURL(file))
    if (errors.profilePicture) setErrors(p => ({ ...p, profilePicture: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim())        e.name = 'Requerido'
    if (!form.surname.trim())     e.surname = 'Requerido'
    if (!form.username.trim())    e.username = 'Requerido'
    if (!form.email.trim())       e.email = 'Requerido'
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!/^\d{8}$/.test(form.phone))     e.phone = 'Exactamente 8 dígitos numéricos'
    if (!form.bloodType)                  e.bloodType = 'Seleccioná tu tipo de sangre'
    if (!form.zone && !form.municipality) e.zone = 'Ingresá al menos zona o municipio'
    if (!form.profilePicture)             e.profilePicture = 'La foto de perfil es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => { if (validateStep1()) setStep(2) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return

    setLoading(true)
    setApiError('')

    const fd = new FormData()
    fd.append('name',         form.name.trim())
    fd.append('surname',      form.surname.trim())
    fd.append('username',     form.username.trim())
    fd.append('email',        form.email.trim())
    fd.append('password',     form.password)
    fd.append('phone',        form.phone)
    fd.append('bloodType',    form.bloodType)
    if (form.zone.trim())         fd.append('zone',         form.zone.trim())
    if (form.municipality.trim()) fd.append('municipality', form.municipality.trim())
    fd.append('profilePicture', form.profilePicture)

    try {
      await registerUser(fd)
      setSuccess(true)
      setTimeout(() => navigate('/login', { state: { justRegistered: true, email: form.email.trim() } }), 3000)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors?.length) {
        setApiError(data.errors.map(v => v.message).join('. '))
      } else {
        setApiError(data?.message || 'Error al registrar. Intentá de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ── Success screen ───────────────────────────────────────────── */
  if (success) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white mb-5"
          style={{ background: 'linear-gradient(135deg,#28A060,#166534)', boxShadow: '0 0 24px rgba(40,160,96,0.4)' }}
        >
          ✓
        </div>
        <h2 className="font-cormorant text-[30px] font-medium text-txt mb-2">¡Cuenta creada!</h2>
        <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-1">
          Revisá tu correo para activar tu cuenta.
        </p>
        <p className="text-[12px] text-gris3">Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  return (
    <div className="relative z-10 w-full">

      <div className="absolute top-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(184,28,50,0.05) 0%,transparent 70%)' }} />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
              step > s
                ? 'bg-verde-v text-white'
                : step === s
                  ? 'bg-rojo text-white shadow-[0_0_12px_rgba(184,28,50,0.4)]'
                  : 'bg-gris1 text-gris3 border border-gris2'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 2 && <div className={`w-10 h-0.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-rojo' : 'bg-gris2'}`} />}
          </div>
        ))}
        <span className="ml-2 text-[11px] text-txt3 font-medium">
          {step === 1 ? 'Datos de cuenta' : 'Perfil médico'}
        </span>
      </div>

      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-rojo tracking-[0.12em] uppercase mb-[8px]">
        <span className="w-5 h-0.5 bg-rojo rounded inline-block" />
        {step === 1 ? 'Nueva cuenta' : 'Tu perfil'}
      </div>

      <h2 className="font-cormorant text-[34px] font-medium text-txt leading-[1.1] mb-[5px]">
        {step === 1 ? 'Registrate' : 'Casi listo'}
      </h2>
      <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-[22px]">
        {step === 1 ? 'Creá tu cuenta BloodLink. Es gratis.' : 'Completá tu perfil médico para finalizar.'}
      </p>

      {/* ─── STEP 1 ─── */}
      {step === 1 && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InputField label="Nombre" name="name" value={form.name} onChange={handle}
              placeholder="María" error={errors.name} maxLength={25} />
            <InputField label="Apellido" name="surname" value={form.surname} onChange={handle}
              placeholder="López" error={errors.surname} maxLength={25} />
          </div>

          <InputField label="Usuario" name="username" value={form.username} onChange={handle}
            placeholder="maria_dona" error={errors.username} maxLength={50} className="mb-3" />

          <InputField label="Correo electrónico" name="email" type="email" value={form.email}
            onChange={handle} placeholder="maria@correo.com" error={errors.email} className="mb-3" />

          <PasswordField label="Contraseña" name="password" value={form.password}
            onChange={handle} error={errors.password} placeholder="Mínimo 8 caracteres" className="mb-3" />

          <PasswordField label="Confirmar contraseña" name="confirmPassword" value={form.confirmPassword}
            onChange={handle} error={errors.confirmPassword} placeholder="Repetí la contraseña" className="mb-5" />

          <button type="button" onClick={goNext}
            className="btn-shine w-full border-none rounded-[11px] py-[13px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-4 hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}>
            Continuar →
          </button>

          <p className="text-center text-[13px] text-txt3">
            ¿Ya tenés cuenta?{' '}
            <button type="button" onClick={() => navigate('/login')}
              className="text-rojo font-semibold bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit text-[13px]">
              Iniciá sesión
            </button>
          </p>
        </div>
      )}

      {/* ─── STEP 2 ─── */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <InputField label="Teléfono (8 dígitos)" name="phone" type="tel" value={form.phone}
            onChange={handle} placeholder="12345678" error={errors.phone} maxLength={8}
            inputMode="numeric" className="mb-3" />

          {/* Blood type */}
          <div className="flex flex-col gap-[5px] mb-3">
            <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">Tipo de sangre</label>
            <div className="grid grid-cols-4 gap-[7px]">
              {BLOOD_TYPES.map(bt => (
                <button key={bt} type="button"
                  onClick={() => { setForm(p => ({ ...p, bloodType: bt })); setErrors(p => ({ ...p, bloodType: '' })) }}
                  className={`rounded-[9px] py-[10px] text-[13px] font-semibold border transition-all duration-200 font-outfit ${
                    form.bloodType === bt
                      ? 'bg-rojo text-white border-rojo shadow-[0_4px_12px_rgba(184,28,50,0.35)]'
                      : 'bg-gris1 text-txt2 border-gris2 hover:border-rojo hover:text-rojo'
                  }`}>
                  {bt}
                </button>
              ))}
            </div>
            {errors.bloodType && <span className="text-[11px] text-rojo">{errors.bloodType}</span>}
          </div>

          {/* Zone + municipality */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InputField label="Zona" name="zone" value={form.zone} onChange={handle}
              placeholder="Zona 1" error={errors.zone} maxLength={100} />
            <InputField label="Municipio" name="municipality" value={form.municipality}
              onChange={handle} placeholder="Guatemala" maxLength={100} />
          </div>

          {/* Profile picture */}
          <div className="flex flex-col gap-[5px] mb-4">
            <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">Foto de perfil</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[12px] cursor-pointer transition-all duration-200 hover:border-rojo hover:bg-rojo/[0.02] flex items-center gap-4 px-4 py-4 ${
                errors.profilePicture ? 'border-rojo bg-rojo/[0.02]' : 'border-gris2'
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-rojo/30 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-[13px] text-txt font-medium truncate">{form.profilePicture?.name}</div>
                    <div className="text-[11px] text-txt3 mt-0.5">Click para cambiar</div>
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-2">
                  <div className="text-[26px] mb-1">📷</div>
                  <div className="text-[13px] text-txt2 font-medium">Click o arrastrá tu foto</div>
                  <div className="text-[11px] text-gris3 mt-0.5">JPG · PNG · WEBP</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {errors.profilePicture && <span className="text-[11px] text-rojo">{errors.profilePicture}</span>}
          </div>

          {/* API error */}
          {apiError && (
            <div className="bg-rojo/[0.06] border border-rojo/25 rounded-[10px] px-4 py-3 mb-4">
              <p className="text-[12px] text-rojo leading-[1.5]">{apiError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => { setStep(1); setApiError('') }}
              className="flex-1 border border-gris2 rounded-[11px] py-[13px] text-[14px] text-txt2 bg-white cursor-pointer transition-all duration-200 hover:border-rojo hover:text-rojo font-outfit font-medium"
              disabled={loading}>
              ← Volver
            </button>
            <button type="submit" disabled={loading}
              className="btn-shine flex-[2] border-none rounded-[11px] py-[13px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
