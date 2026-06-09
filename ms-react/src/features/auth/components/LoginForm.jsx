import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField }    from '../../../shared/ui/InputField.jsx'
import { PasswordField } from '../../../shared/ui/PasswordField.jsx'

const INITIAL_FORM = { email: '', password: '', remember: false }

export function LoginForm() {
  const navigate          = useNavigate()
  const [form, setForm]   = useState(INITIAL_FORM)
  const [loading, setLoad] = useState(false)
  const [done, setDone]   = useState(false)

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
        <InputField
          label="Correo electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="maria@correo.com"
          autoComplete="email"
          required
          className="mb-[14px]"
        />

        <PasswordField
          label="Contraseña"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="current-password"
          className="mb-[14px]"
        />

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
          onClick={() => navigate('/register')}
          className="text-rojo font-semibold bg-transparent border-none cursor-pointer hover:text-rojo-v transition-colors font-outfit text-[13px]"
        >
          Regístrate gratis
        </button>
      </p>
    </div>
  )
}
