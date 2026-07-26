import { AppointmentStatusBadge } from '../../../../shared/components/appointments/AppointmentStatusBadge.jsx'

function getDonorLabel(appointment) {
  const donor = appointment.donor

  if (!donor) {
    return 'Donante desconocido'
  }

  const fullName = `${donor.name ?? ''} ${donor.surname ?? ''}`.trim()
  return fullName || donor.username || donor.email || 'Donante'
}

function ConfirmButton({ appointment, confirmingId, onConfirm, className = '' }) {
  if (appointment.status === 'CONFIRMED') {
    return <span className={`text-[12px] font-medium text-verde-v ${className}`}>Ya confirmada</span>
  }

  if (appointment.status === 'CANCELLED') {
    return <span className={`text-[12px] font-medium text-rojo ${className}`}>Cancelada por el donante</span>
  }

  const isConfirming = confirmingId === appointment.id

  return (
    <button
      type="button"
      disabled={isConfirming}
      onClick={() => onConfirm(appointment.id)}
      className={`flex items-center justify-center gap-2 rounded-[10px] border border-verde-v bg-verde-v px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#239054] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isConfirming ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      Confirmar asistencia
    </button>
  )
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = WEEKDAYS[dateObj.getDay()]
  return `${dayName} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
}

export function StaffAgendaTable({ appointments, confirmingId, onConfirm }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gris2">
          <thead className="bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
              <th className="px-5 py-3">Donante</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Hora</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris2 bg-white">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-5 py-4 text-[13px] font-medium text-txt">{getDonorLabel(appointment)}</td>
                <td className="px-5 py-4 text-[12px] text-txt2 font-medium">{formatDate(appointment.date)}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{appointment.time}</td>
                <td className="px-5 py-4"><AppointmentStatusBadge status={appointment.status} /></td>
                <td className="px-5 py-4 text-right">
                  <ConfirmButton appointment={appointment} confirmingId={confirmingId} onConfirm={onConfirm} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden sm:p-5">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-txt">{getDonorLabel(appointment)}</p>
                <p className="text-[11px] text-txt3">{formatDate(appointment.date)} a las {appointment.time}</p>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>

            <ConfirmButton
              appointment={appointment}
              confirmingId={confirmingId}
              onConfirm={onConfirm}
              className="mt-4 w-full"
            />
          </article>
        ))}
      </div>
    </div>
  )
}
