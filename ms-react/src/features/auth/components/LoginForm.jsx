import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { InputField }    from '../../../shared/components/InputField.jsx'
import { PasswordField } from '../../../shared/components/PasswordField.jsx'
import { loginUser }     from '../../../shared/api/auth.api.js'
import { saveAuth, isAdmin, isEmployee } from '../../../shared/utils/auth.store.js'

const INITIAL_FORM = { emailOrUsername: '', password: '', remember: false }

export function LoginForm() {
  const navigate          = useNavigate()
  const location          = useLocation()
  const justRegistered    = location.state?.justRegistered ?? false
  const justActivated     = location.state?.activated ?? false
  const passwordReset     = location.state?.passwordReset ?? false

  const [form, setForm]         = useState(INITIAL_FORM)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [needsVerify, setNeeds] = useState(false)
  const [success, setSuccess]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (countdown <= 0) return
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [countdown])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setError('')
    setNeeds(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (countdown > 0) return
    if (!form.emailOrUsername.trim() || !form.password) {
      setError('Completá todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    setNeeds(false)

    try {
      const res  = await loginUser(form.emailOrUsername.trim(), form.password)
      const data = res.data?.data ?? res.data
      saveAuth({
        accessToken:  data.accessToken,
        refreshToken: data.refreshToken,
        user:         data.user,
      })
      setSuccess(true)
      const authPayload = { user: data.user }
      const dest = isAdmin(authPayload) ? '/admin' : isEmployee(authPayload) ? '/employee' : '/dashboard'
      setTimeout(() => navigate(dest), 1200)
    } catch (err) {
      const status     = err.response?.status
      const message    = err.response?.data?.message || ''
      const retryAfter = err.response?.data?.retryAfter ?? 0

      if (status === 429) {
        setCountdown(retryAfter || 60)
      } else if (status === 423 || message.toLowerCase().includes('verificar')) {
        setNeeds(true)
      } else {
        setError(message || 'Credenciales inválidas. Verificá tus datos.')
      }
    } finally {
      setLoading(false)
    }
  }

  const isBlocked = countdown > 0

  return (
    <div className="relative z-10 w-full">
      <div className="absolute top-[-80px] right-[-50px] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(184,28,50,0.05) 0%,transparent 70%)' }} />
      <div className="absolute bottom-[-60px] left-[-40px] w-[160px] h-[160px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(200,148,42,0.06) 0%,transparent 70%)' }} />

      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-rojo tracking-[0.12em] uppercase mb-[10px]">
        <span className="w-5 h-0.5 bg-rojo rounded inline-block" />
        Bienvenido de nuevo
      </div>

      <h2 className="font-cormorant text-[36px] font-medium text-txt leading-[1.1] mb-[6px]">
        Iniciá sesión
      </h2>
      <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-[22px]">
        Ingresá tu correo o usuario para acceder a tu cuenta BloodLink.
      </p>

      {/* Password reset banner */}
      {passwordReset && (
        <div className="flex items-start gap-3 bg-[rgba(40,160,96,0.07)] border border-[rgba(40,160,96,0.25)] rounded-[11px] px-4 py-3 mb-5">
          <span className="text-[16px] flex-shrink-0 mt-[1px]">🔒</span>
          <div>
            <p className="text-[12px] font-semibold text-verde-v leading-[1.4] mb-[2px]">Contraseña actualizada</p>
            <p className="text-[12px] text-verde-v/70 font-light leading-[1.5]">
              Tu contraseña fue cambiada correctamente. Ya podés iniciar sesión.
            </p>
          </div>
        </div>
      )}

      {/* Just registered banner */}
      {justRegistered && !justActivated && (
        <div className="flex items-start gap-3 bg-[rgba(200,148,42,0.07)] border border-[rgba(200,148,42,0.25)] rounded-[11px] px-4 py-3 mb-5">
          <span className="text-[16px] flex-shrink-0 mt-[1px]">📬</span>
          <div>
            <p className="text-[12px] font-semibold text-oro leading-[1.4] mb-[2px]">Revisá tu correo</p>
            <p className="text-[12px] text-oro/70 font-light leading-[1.5]">
              Te enviamos un código de activación. Verificá tu cuenta antes de iniciar sesión.{' '}
              <button type="button" onClick={() => window.open('https://mail.google.com', '_blank')}
                className="font-semibold underline bg-transparent border-none cursor-pointer text-oro text-[12px] font-outfit">
                Verificar ahora
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Just activated banner */}
      {justActivated && (
        <div className="flex items-start gap-3 bg-[rgba(40,160,96,0.07)] border border-[rgba(40,160,96,0.25)] rounded-[11px] px-4 py-3 mb-5">
          <span className="text-[16px] flex-shrink-0 mt-[1px]">✅</span>
          <div>
            <p className="text-[12px] font-semibold text-verde-v leading-[1.4] mb-[2px]">Cuenta activada</p>
            <p className="text-[12px] text-verde-v/70 font-light leading-[1.5]">
              Tu cuenta fue verificada correctamente. Ahora podés iniciar sesión.
            </p>
          </div>
        </div>
      )}

      {/* Needs verify banner */}
      {needsVerify && (
        <div className="flex items-start gap-3 bg-[rgba(200,148,42,0.07)] border border-[rgba(200,148,42,0.25)] rounded-[11px] px-4 py-3 mb-5">
          <span className="text-[16px] flex-shrink-0 mt-[1px]">⚠️</span>
          <div>
            <p className="text-[12px] font-semibold text-oro leading-[1.4] mb-[2px]">Verificá tu correo primero</p>
            <p className="text-[12px] text-oro/70 font-light leading-[1.5]">
              Necesitás activar tu cuenta antes de iniciar sesión.{' '}
              <button type="button" onClick={() => navigate('/verify-email', { state: { email: form.emailOrUsername } })}
                className="font-semibold underline bg-transparent border-none cursor-pointer text-oro text-[12px] font-outfit">
                Verificar ahora
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Rate limit countdown banner */}
      {isBlocked && (
        <div className="flex items-start gap-3 bg-rojo/[0.06] border border-rojo/20 rounded-[11px] px-4 py-3 mb-5">
          <span className="text-[16px] flex-shrink-0 mt-[1px]"></span>
          <div>
            <p className="text-[12px] font-semibold text-rojo leading-[1.4] mb-[2px]">
              Demasiados intentos fallidos
            </p>
            <p className="text-[12px] text-rojo/70 font-light leading-[1.5]">
              Podés intentar de nuevo en{' '}
              <span className="font-bold text-rojo tabular-nums">
                {Math.floor(countdown / 60) > 0
                  ? `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`
                  : `${countdown}s`}
              </span>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Correo o usuario"
          name="emailOrUsername"
          value={form.emailOrUsername}
          onChange={handleChange}
          placeholder="maria@correo.com o maria123"
          autoComplete="username"
          required
          className="mb-[14px]"
          disabled={isBlocked}
        />

        <PasswordField
          label="Contraseña"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="current-password"
          className="mb-[14px]"
          disabled={isBlocked}
        />

        {/* Options row */}
        <div className="flex justify-between items-center mb-5">
          <label className="flex items-center gap-[7px] cursor-pointer select-none">
            <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange}
              className="w-[15px] h-[15px] accent-rojo cursor-pointer" />
            <span className="text-[13px] text-txt2">Recordarme</span>
          </label>
          <button type="button" onClick={() => navigate('/forgot-password')}
            className="text-[13px] text-rojo font-medium bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Generic error */}
        {error && (
          <div className="bg-rojo/[0.06] border border-rojo/25 rounded-[10px] px-4 py-3 mb-4">
            <p className="text-[12px] text-rojo leading-[1.5]">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading || isBlocked}
          className="btn-shine relative overflow-hidden w-full border-none rounded-[11px] py-[14px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-[18px] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={
            success
              ? { background: 'linear-gradient(135deg,#1A6B40,#28A060)', color: '#fff', boxShadow: '0 6px 22px rgba(40,160,96,0.38)' }
              : isBlocked
              ? { background: '#C0B8BC', color: '#fff', boxShadow: 'none' }
              : { background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.38)' }
          }
        >
          {loading
            ? 'Verificando…'
            : success
            ? '✓ Sesión iniciada'
            : isBlocked
            ? `Bloqueado — ${countdown}s`
            : 'Iniciar sesión'}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-[13px] text-txt3">
        ¿No tenés una cuenta?{' '}
        <button type="button" onClick={() => navigate('/register')}
          className="text-rojo font-semibold bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit text-[13px]">
          Regístrate gratis
        </button>
      </p>
    </div>
  )
}
