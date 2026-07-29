const STATUS_STYLES = {
  PENDIENTE: 'bg-[rgba(200,148,42,0.1)] text-oro',
  APROBADO: 'bg-[rgba(40,160,96,0.1)] text-verde-v',
  RECHAZADO: 'bg-[rgba(212,32,64,0.08)] text-rojo',
}

export function TriageStatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}
