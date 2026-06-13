import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PasswordField }  from '../../../shared/components/PasswordField.jsx'
import { resetPassword }  from '../../../shared/api/auth.api.js'

const RULES = [
  { id: 'len',   label: 'Mínimo 8 caracteres',   test: (p) => p.length >= 8 },
  { id: 'upper', label: 'Una letra mayúscula',    test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Una letra minúscula',    test: (p) => /[a-z]/.test(p) },
  { id: 'num',   label: 'Un número',              test: (p) => /[0-9]/.test(p) },
]

export function ResetPasswordForm() {
  const navigate          = useNavigate()
  const [searchParams]    = useSearchParams()
  const token             = searchParams.get('token')

  const [form, setForm]   = useState({ password: '', confirm: '' })
  const [loading, setLoad]= useState(false)
  const [error, setError] = useState('')
  const [success, setSucc]= useState(false)

  const handle = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setError('')
  }

  const strength = RULES.filter(r => r.test(form.password)).length

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) { setError('Enlace inválido o expirado. Solicitá uno nuevo.'); return }

    const failedRules = RULES.filter(r => !r.test(form.password))
    if (failedRules.length > 0) {
      setError(failedRules.map(r => r.label).join(', ') + '.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoad(true)
    setError('')
    try {
      await resetPassword(token, form.password)
      setSucc(true)
      setTimeout(() => navigate('/login', { state: { passwordReset: true } }), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace es inválido o ya expiró.')
    } finally {
      setLoad(false)
    }
  }

  /* ── Invalid token ───────────────────────────────────────────────── */
  if (!token) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center text-center py-8">
        <div className="text-[40px] mb-5">🔗</div>
        <h2 className="font-cormorant text-[28px] font-medium text-txt mb-3">Enlace inválido</h2>
        <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-6 max-w-[280px]">
          Este enlace no es válido. Solicitá uno nuevo desde la página de inicio de sesión.
        </p>
        <button type="button" onClick={() => navigate('/forgot-password')}
          className="btn-shine border-none rounded-[11px] px-8 py-[13px] text-[14px] font-semibold cursor-pointer font-outfit transition-all duration-300 hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}>
          Solicitar nuevo enlace
        </button>
      </div>
    )
  }

  /* ── Success ─────────────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center text-center py-8">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[28px] mb-6"
          style={{ background: 'linear-gradient(135deg,#28A060,#166534)', boxShadow: '0 0 28px rgba(40,160,96,0.4)' }}
        >
          ✓
        </div>
        <div className="text-[10px] font-bold text-verde-v tracking-[0.14em] uppercase mb-3">Contraseña actualizada</div>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-[1.1] mb-3">¡Listo!</h2>
        <p className="text-[13px] text-txt3 font-light leading-[1.7] max-w-[280px] mb-2">
          Tu contraseña fue cambiada correctamente. Ya podés iniciar sesión.
        </p>
        <p className="text-[12px] text-gris3">Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  /* ── Form ─────────────────────────────────────────────────────────── */
  return (
    <div className="relative z-10 w-full">

      <div className="absolute top-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(184,28,50,0.05) 0%,transparent 70%)' }} />

      {/* Icon */}
      <div
        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[22px] mb-6"
        style={{ background: 'linear-gradient(135deg,rgba(212,32,64,0.12),rgba(184,28,50,0.06))', border: '1px solid rgba(212,32,64,0.2)' }}
      >
        🔑
      </div>

      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-rojo tracking-[0.12em] uppercase mb-[8px]">
        <span className="w-5 h-0.5 bg-rojo rounded inline-block" />
        Nueva contraseña
      </div>

      <h2 className="font-cormorant text-[34px] font-medium text-txt leading-[1.1] mb-[5px]">
        Restablecé tu acceso
      </h2>
      <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-[26px]">
        Creá una nueva contraseña segura para tu cuenta BloodLink.
      </p>

      <form onSubmit={handleSubmit}>

        <PasswordField
          label="Nueva contraseña"
          name="password"
          value={form.password}
          onChange={handle}
          placeholder="Mínimo 8 caracteres"
          className="mb-3"
        />

        {/* Strength indicator */}
        {form.password.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-[5px] mb-[10px]">
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className="flex-1 h-[4px] rounded-full transition-all duration-300"
                  style={{
                    background: i < strength
                      ? strength <= 1 ? '#D42040'
                        : strength <= 2 ? '#E8B040'
                        : strength <= 3 ? '#4A8ACC'
                        : '#28A060'
                      : '#E5E7EB'
                  }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-[5px]">
              {RULES.map(r => (
                <div key={r.id} className="flex items-center gap-[6px]">
                  <div className={`w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 transition-all duration-200 ${r.test(form.password) ? 'bg-verde-v text-white' : 'bg-gris1 border border-gris2 text-transparent'}`}>
                    ✓
                  </div>
                  <span className={`text-[11px] transition-colors duration-200 ${r.test(form.password) ? 'text-verde-v' : 'text-gris3'}`}>
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <PasswordField
          label="Confirmar contraseña"
          name="confirm"
          value={form.confirm}
          onChange={handle}
          placeholder="Repetí la contraseña"
          className="mb-5"
        />

        {error && (
          <div className="bg-rojo/[0.06] border border-rojo/25 rounded-[10px] px-4 py-3 mb-4">
            <p className="text-[12px] text-rojo leading-[1.5]">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="btn-shine w-full border-none rounded-[11px] py-[14px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-4 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}
        >
          {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
        </button>

      </form>

      <div className="pt-5 border-t border-gris2 text-center">
        <button type="button" onClick={() => navigate('/login')}
          className="text-[13px] text-txt3 bg-transparent border-none cursor-pointer hover:text-txt transition-colors font-outfit">
          ← Volver al inicio de sesión
        </button>
      </div>

    </div>
  )
}
