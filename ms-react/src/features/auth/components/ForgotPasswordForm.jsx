import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField }    from '../../../shared/components/InputField.jsx'
import { forgotPassword } from '../../../shared/api/auth.api.js'

export function ForgotPasswordForm() {
  const navigate            = useNavigate()
  const [email, setEmail]   = useState('')
  const [loading, setLoad]  = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Ingresá tu correo electrónico.'); return }

    setLoad(true)
    setError('')
    try {
      await forgotPassword(email.trim())
      setSent(true)
    } catch {
      /* backend siempre responde 200 — este catch es solo por red */
      setSent(true)
    } finally {
      setLoad(false)
    }
  }

  /* ── Sent screen ─────────────────────────────────────────────────── */
  if (sent) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center text-center py-6">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[28px] mb-6"
          style={{ background: 'linear-gradient(135deg,rgba(212,32,64,0.15),rgba(184,28,50,0.08))', border: '1px solid rgba(212,32,64,0.3)', boxShadow: '0 0 24px rgba(212,32,64,0.15)' }}
        >
          📬
        </div>

        <div className="text-[10px] font-bold text-rojo tracking-[0.14em] uppercase mb-3">
          Correo enviado
        </div>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-[1.1] mb-4">
          Revisá tu bandeja
        </h2>
        <p className="text-[13px] text-txt3 font-light leading-[1.7] mb-2 max-w-[300px]">
          Si <strong className="text-txt font-medium">{email}</strong> está registrado, te enviamos un enlace para restablecer tu contraseña.
        </p>
        <p className="text-[12px] text-gris3 mb-7">El enlace expira en 1 hora.</p>

        <button
          type="button"
          onClick={() => window.open('https://mail.google.com', '_blank')}
          className="btn-shine w-full border-none rounded-[11px] py-[13px] text-[14px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-3 hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}
        >
          Abrir Gmail →
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full border border-gris2 rounded-[11px] py-[12px] text-[14px] text-txt2 bg-white cursor-pointer transition-all duration-200 hover:border-rojo hover:text-rojo font-outfit font-medium"
        >
          Volver al inicio de sesión
        </button>
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
      </div>

      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-rojo tracking-[0.12em] uppercase mb-[8px]">
        <span className="w-5 h-0.5 bg-rojo rounded inline-block" />
        Recuperar acceso
      </div>

      <h2 className="font-cormorant text-[34px] font-medium text-txt leading-[1.1] mb-[5px]">
        ¿Olvidaste tu contraseña?
      </h2>
      <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-[28px]">
        Ingresá tu correo y te enviamos un enlace para crear una nueva contraseña.
      </p>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Correo electrónico"
          name="email"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="maria@correo.com"
          autoComplete="email"
          error={error}
          className="mb-6"
        />

        <button type="submit" disabled={loading}
          className="btn-shine w-full border-none rounded-[11px] py-[14px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-4 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}
        >
          {loading ? 'Enviando…' : 'Enviar enlace de recuperación'}
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
