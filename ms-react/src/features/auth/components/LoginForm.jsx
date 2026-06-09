import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INITIAL_FORM = { email: '', password: '', remember: false }

export function LoginForm() {
  const navigate            = useNavigate()
  const [form, setForm]     = useState(INITIAL_FORM)
  const [showPass, setShow] = useState(false)
  const [loading, setLoad]  = useState(false)
  const [done, setDone]     = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoad(true)
    setTimeout(() => { setLoad(false); setDone(true) }, 1200)
  }

  return (
    <div className="relative z-10 w-full">
      {/* Decorative blobs */}
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
      <p className="text-[13px] text-txt3 font-light leading-[1.6] mb-[30px]">
        Ingresá tus datos para acceder a tu cuenta HemoVida.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="flex flex-col gap-[5px] mb-[14px]">
          <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="maria@correo.com"
            autoComplete="email"
            required
            className="border border-gris2 rounded-[10px] px-[15px] py-3 text-[14px] text-txt bg-gris1 outline-none transition-all duration-200 placeholder-gris3 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] font-outfit"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-[5px] mb-[14px]">
          <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full border border-gris2 rounded-[10px] pl-[15px] pr-11 py-3 text-[14px] text-txt bg-gris1 outline-none transition-all duration-200 placeholder-gris3 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] font-outfit"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-[13px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[15px] text-gris3 hover:text-rojo transition-colors p-1"
            >
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex justify-between items-center mb-5">
          <label className="flex items-center gap-[7px] cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="w-[15px] h-[15px] accent-rojo cursor-pointer"
            />
            <span className="text-[13px] text-txt2">Recordarme</span>
          </label>
          <a href="#" className="text-[13px] text-rojo font-medium no-underline hover:text-rojo-v transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-shine relative overflow-hidden w-full border-none rounded-[11px] py-[14px] text-[15px] font-semibold cursor-pointer font-outfit transition-all duration-300 mb-[18px] hover:-translate-y-px disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={
            done
              ? { background: 'linear-gradient(135deg,#1A6B40,#28A060)', color: '#fff', boxShadow: '0 6px 22px rgba(40,160,96,0.38)' }
              : { background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 22px rgba(184,28,50,0.38)' }
          }
        >
          {loading ? 'Verificando…' : done ? '✓ Sesión iniciada' : 'Iniciar sesión'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-[10px] mb-[14px]">
        <div className="flex-1 h-px bg-gris2" />
        <span className="text-[12px] text-gris3 whitespace-nowrap">o continuá con</span>
        <div className="flex-1 h-px bg-gris2" />
      </div>

      {/* Social */}
      <div className="flex gap-[9px] mb-[22px]">
        {['G  Google', 'f  Facebook'].map((label) => (
          <button
            key={label}
            type="button"
            className="flex-1 flex items-center justify-center border border-gris2 rounded-[10px] py-[10px] text-[13px] text-txt font-medium bg-white cursor-pointer transition-all duration-200 hover:border-rojo hover:text-rojo hover:bg-rojo-pal font-outfit"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-[13px] text-txt3">
        ¿No tenés una cuenta?{' '}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-rojo font-semibold bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit text-[13px]"
        >
          Regístrate gratis
        </button>
      </p>
    </div>
  )
}
