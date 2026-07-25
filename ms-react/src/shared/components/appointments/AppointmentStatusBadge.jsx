const STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', className: 'bg-[rgba(200,148,42,0.1)] text-oro' },
  CONFIRMED: { label: 'Confirmada', className: 'bg-[rgba(40,160,96,0.1)] text-verde-v' },
  CANCELLED: { label: 'Cancelada', className: 'bg-[rgba(212,32,64,0.08)] text-rojo' },
}

export function AppointmentStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}
