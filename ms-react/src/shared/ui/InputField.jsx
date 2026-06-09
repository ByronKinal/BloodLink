export function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  maxLength,
  type = 'text',
  inputMode,
  autoComplete = 'off',
  required,
}) {
  return (
    <div className={`flex flex-col gap-[5px] ${className}`}>
      <label className="text-[10px] font-bold text-txt2 tracking-[0.07em] uppercase">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        className={`border rounded-[10px] px-[15px] py-3 text-[14px] text-txt bg-gris1 outline-none transition-all duration-200 placeholder-gris3 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] font-outfit ${
          error ? 'border-rojo' : 'border-gris2 focus:border-rojo'
        }`}
      />
      {error && <span className="text-[11px] text-rojo mt-[-2px]">{error}</span>}
    </div>
  )
}
