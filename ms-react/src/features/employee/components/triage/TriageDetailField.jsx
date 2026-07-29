export function TriageDetailField({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] bg-gris1 px-4 py-2.5">
      <span className="text-[12px] text-txt3">{label}</span>
      <span className="text-[13px] font-semibold text-txt">{value}</span>
    </div>
  )
}
