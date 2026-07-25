export function TriageToggleField({ label, hint, value, onChange, disabled = false }) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-gris2 bg-gris1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] font-medium text-txt">{label}</p>
        {hint ? <p className="text-[11px] text-txt3 mt-[2px]">{hint}</p> : null}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(true)}
          className={`flex-1 sm:flex-none rounded-[10px] px-4 py-2 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === true
              ? 'border border-rojo bg-rojo text-white'
              : 'border border-gris2 bg-white text-txt3 hover:border-rojo hover:text-rojo'
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(false)}
          className={`flex-1 sm:flex-none rounded-[10px] px-4 py-2 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === false
              ? 'border border-txt bg-txt text-white'
              : 'border border-gris2 bg-white text-txt3 hover:border-txt hover:text-txt'
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}
