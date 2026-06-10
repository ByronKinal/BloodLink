import { useState } from 'react'

export function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  className = '',
  autoComplete = 'off',
  disabled = false,
}) {
  const [show, setShow] = useState(false)

  return (
    <div className={`flex flex-col gap-[5px] ${className}`}>
      <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full border rounded-[10px] pl-[15px] pr-11 py-3 text-[14px] text-txt bg-gris1 outline-none transition-all duration-200 placeholder-gris3 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] font-outfit disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-rojo' : 'border-gris2 focus:border-rojo'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-[13px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[15px] text-gris3 hover:text-rojo transition-colors p-1"
        >
          {show ? '🙈' : '👁'}
        </button>
      </div>
      {error && <span className="text-[11px] text-rojo mt-[-2px]">{error}</span>}
    </div>
  )
}
