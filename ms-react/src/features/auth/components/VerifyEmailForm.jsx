import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { InputField } from '../../../shared/components/InputField.jsx'
import { verifyEmailByToken, verifyEmailByCode, resendVerification } from '../../../shared/api/auth.api.js'

const OTP_LEN = 6

export function VerifyEmailForm() {
  const navigate                        = useNavigate()
  const location                        = useLocation()
  const [searchParams]                  = useSearchParams()
  const token                           = searchParams.get('token')
  const preEmail                        = location.state?.email ?? ''

  const [email, setEmail]               = useState(preEmail)
  const [digits, setDigits]             = useState(Array(OTP_LEN).fill(''))
  const [loading, setLoading]           = useState(false)
  const [autoLoading, setAutoLoading]   = useState(!!token)
  const [verified, setVerified]         = useState(false)
  const [error, setError]               = useState('')
  const [resendLoading, setResendLoad]  = useState(false)
  const [resendMsg, setResendMsg]       = useState('')
  const inputRefs                       = useRef([])

  /* ── Auto-verify from URL token ─────────────────────────────────── */
  useEffect(() => {
    if (!token) return
    verifyEmailByToken(token)
      .then(() => {
        setVerified(true)
        setTimeout(() => navigate('/login', { state: { activated: true } }), 3000)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'El enlace es inválido o ya expiró.')
        setAutoLoading(false)
      })
  }, [token]) // eslint-disable-line

  /* ── OTP helpers ─────────────────────────────────────────────────── */
  const handleDigit = (i, val) => {
    const ch = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = ch
    setDigits(next)
    setError('')
    if (ch && i < OTP_LEN - 1) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN)
    if (!pasted) return
    const next = Array(OTP_LEN).fill('')
    pasted.split('').forEach((c, i) => { next[i] = c })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, OTP_LEN - 1)]?.focus()
  }

  /* ── Submit ──────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (!email.trim())      { setError('Ingresá tu correo electrónico.'); return }
    if (code.length < OTP_LEN) { setError('Completá los 6 dígitos del código.'); return }

    setLoading(true)
    setError('')
    try {
      await verifyEmailByCode(email.trim(), code)
      setVerified(true)
      setTimeout(() => navigate('/login', { state: { activated: true } }), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto o expirado.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Resend ──────────────────────────────────────────────────────── */
  const handleResend = async () => {
    if (!email.trim()) { setError('Ingresá tu correo para reenviar el código.'); return }
    setResendLoad(true)
    setResendMsg('')
    try {
      await resendVerification(email.trim())
      setResendMsg('✓ Código reenviado. Revisá tu correo.')
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'No se pudo reenviar.')
    } finally {
      setResendLoad(false)
    }
  }

  /* ── Success ─────────────────────────────────────────────────────── */
  if (verified) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center text-center py-8">
        <div
          className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-[32px] mb-6"
          style={{ background: 'linear-gradient(135deg,#28A060,#166534)', boxShadow: '0 0 32px rgba(40,160,96,0.45)' }}
        >
          ✓
        </div>
        <div className="text-[10px] font-bold text-verde-v tracking-[0.14em] uppercase mb-3">Cuenta activada</div>
        <h2 className="font-cormorant text-[34px] font-medium text-txt leading-[1.1] mb-4">¡Todo listo!</h2>
        <p className="text-[13px] text-txt3 font-light leading-[1.7] mb-2 max-w-[300px]">
          Tu cuenta fue verificada. Ya podés iniciar sesión en BloodLink.
        </p>
        <p className="text-[12px] text-gris3 mb-6">Redirigiendo al inicio de sesión...</p>
        <button type="button" onClick={() => navigate('/login', { state: { activated: true } })}
          className="text-[13px] text-rojo font-semibold bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit">
          Ir ahora →
        </button>
      </div>
    )
  }

  /* ── Auto-verifying spinner ──────────────────────────────────────── */
  if (autoLoading) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center text-center py-10">
        <div className="w-[60px] h-[60px] rounded-full border-[3px] border-rojo/20 border-t-rojo animate-spin mb-6" />
        <h2 className="font-cormorant text-[28px] font-medium text-txt mb-2">Verificando tu cuenta…</h2>
        <p className="text-[13px] text-txt3 font-light">Esto solo tarda un momento.</p>
        {error && (
          <div className="mt-6 bg-rojo/[0.06] border border-rojo/25 rounded-[12px] px-5 py-4 max-w-[340px] text-left">
            <p className="text-[12px] text-rojo leading-[1.5] mb-3">{error}</p>
            <button type="button" onClick={() => setAutoLoading(false)}
              className="text-[12px] text-rojo font-semibold bg-transparent border-none cursor-pointer underline font-outfit">
              Ingresar código manualmente
            </button>
          </div>
        )}
      </div>
    )
  }

  /* ── Manual form ─────────────────────────────────────────────────── */
  return (
    <div className="relative z-10 w-full">

      {/* Glow blob */}
      <div className="absolute top-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(184,28,50,0.05) 0%,transparent 70%)' }} />

      {/* Icon */}
      <div
        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[22px] mb-6"
        style={{ background: 'linear-gradient(135deg,rgba(212,32,64,0.12),rgba(184,28,50,0.06))', border: '1px solid rgba(212,32,64,0.2)' }}
      >
        📬
      </div>

      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-rojo tracking-[0.12em] uppercase mb-[8px]">
        <span className="w-5 h-0.5 bg-rojo rounded inline-block" />
        Verificación
      </div>

      <h2 className="font-cormorant text-[34px] font-medium text-txt leading-[1.1] mb-[5px]">
        Activá tu cuenta
      </h2>
      <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-[26px]">
        Revisá tu correo y pegá los <strong className="text-txt font-medium">6 dígitos</strong> que recibiste de BloodLink.
      </p>

      <form onSubmit={handleSubmit}>

        <InputField
          label="Correo electrónico"
          name="email"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="maria@correo.com"
          className="mb-6"
        />

        {/* OTP grid */}
        <div className="flex flex-col gap-[8px] mb-6">
          <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">
            Código de activación
          </label>

          <div
            className="grid gap-[10px]"
            style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
            onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-full aspect-square text-center text-[24px] font-bold rounded-[12px] border-2 outline-none transition-all duration-200 font-outfit bg-gris1 text-txt cursor-text"
                style={
                  d
                    ? { borderColor: '#D42040', background: 'rgba(212,32,64,0.04)', color: '#D42040', boxShadow: '0 0 0 3px rgba(184,28,50,0.1)' }
                    : { borderColor: '#E5E7EB' }
                }
                onFocus={e => { if (!d) e.target.style.borderColor = '#D42040' }}
                onBlur={e => { if (!digits[i]) e.target.style.borderColor = '#E5E7EB' }}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-[6px] mt-[2px]">
              <span className="text-[11px] text-rojo">{error}</span>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="btn-shine w-full border-none rounded-[11px] py-[14px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-4 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.35)' }}
        >
          {loading ? 'Verificando…' : 'Verificar cuenta'}
        </button>

      </form>

      {/* Resend */}
      <div className="text-center mb-5">
        <p className="text-[13px] text-txt3">
          ¿No recibiste el código?{' '}
          <button type="button" onClick={handleResend} disabled={resendLoading}
            className="text-rojo font-semibold bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit text-[13px] disabled:opacity-50">
            {resendLoading ? 'Reenviando…' : 'Reenviar código'}
          </button>
        </p>
        {resendMsg && (
          <p className={`text-[12px] mt-2 font-medium ${resendMsg.startsWith('✓') ? 'text-verde-v' : 'text-rojo'}`}>
            {resendMsg}
          </p>
        )}
      </div>

      <div className="pt-5 border-t border-gris2 text-center">
        <button type="button" onClick={() => navigate('/login')}
          className="text-[13px] text-txt3 bg-transparent border-none cursor-pointer hover:text-txt transition-colors font-outfit">
          ← Volver al inicio de sesión
        </button>
      </div>

    </div>
  )
}
