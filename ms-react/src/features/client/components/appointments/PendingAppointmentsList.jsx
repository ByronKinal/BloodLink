import { AppointmentStatusBadge } from '../../../../shared/components/appointments/AppointmentStatusBadge.jsx'

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${value}T00:00:00`))
  } catch {
    return value
  }
}

function CancelButton({ appointmentId, cancelingId, onCancel, className }) {
  const isCanceling = cancelingId === appointmentId

  return (
    <button
      type="button"
      disabled={isCanceling}
      onClick={() => onCancel(appointmentId)}
      className={`rounded-[10px] border border-[rgba(212,32,64,0.3)] bg-white px-3 py-2 text-[12px] font-medium text-rojo transition-colors hover:bg-[rgba(212,32,64,0.06)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isCanceling ? 'Cancelando...' : 'Cancelar'}
    </button>
  )
}

export function PendingAppointmentsList({ appointments, cancelingId, onCancel }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gris2">
          <thead className="bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Hora</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris2 bg-white">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-5 py-4 text-[13px] font-medium text-txt">{formatDate(appointment.date)}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{appointment.time}</td>
                <td className="px-5 py-4"><AppointmentStatusBadge status={appointment.status} /></td>
                <td className="px-5 py-4 text-right">
                  <CancelButton appointmentId={appointment.id} cancelingId={cancelingId} onCancel={onCancel} />
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
                <p className="text-[14px] font-semibold text-txt">{formatDate(appointment.date)}</p>
                <p className="text-[11px] text-txt3">{appointment.time}</p>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>

            <CancelButton appointmentId={appointment.id} cancelingId={cancelingId} onCancel={onCancel} className="mt-4 w-full" />
          </article>
        ))}
      </div>
    </div>
  )
}
