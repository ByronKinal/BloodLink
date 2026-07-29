export function StaffAgendaDatePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-txt3">Fecha</label>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[10px] border border-gris2 bg-white px-3 py-2 text-[13px] text-txt outline-none focus:border-rojo focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)]"
      />
    </div>
  )
}
