import { DashboardSectionCard } from '../../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardEmptyState } from '../../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { Toast } from '../../../../shared/components/Toast.jsx'
import { useClientAppointments } from '../../hooks/useClientAppointments.js'
import { AppointmentTriageGateBanner } from './AppointmentTriageGateBanner.jsx'
import { AppointmentActiveGateBanner } from './AppointmentActiveGateBanner.jsx'
import { AppointmentBookingForm } from './AppointmentBookingForm.jsx'
import { PendingAppointmentsList } from './PendingAppointmentsList.jsx'
import { AppointmentsListSkeleton } from './AppointmentsListSkeleton.jsx'

export function ClientAppointmentsPanel() {
  const {
    loading,
    error,
    freshness,
    appointments,
    hasActiveAppointment,
    creating,
    cancelingId,
    bookAppointment,
    cancelAppointment,
    toast,
    dismissToast,
  } = useClientAppointments()

  return (
    <div>
      <div className="mb-7">
        <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">Donaciones</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Agendar cita</h2>
        <p className="text-[13px] text-txt3 font-light mt-1">Elegí fecha y hora para tu próxima donación.</p>
      </div>

      {error ? (
        <div className="mb-5 rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {loading ? (
        <AppointmentsListSkeleton />
      ) : (
        <div className="space-y-7">
          {!freshness.eligible ? (
            <AppointmentTriageGateBanner daysSinceSubmission={freshness.daysSinceSubmission} />
          ) : hasActiveAppointment ? (
            <AppointmentActiveGateBanner />
          ) : (
            <DashboardSectionCard
              title="Nueva cita"
              subtitle="Selecciona fecha y horario disponible"
              cardClassName="rounded-[14px] bg-blanco border border-gris2 p-5"
            >
              <AppointmentBookingForm creating={creating} onBook={bookAppointment} />
            </DashboardSectionCard>
          )}

          <DashboardSectionCard
            title="Mis citas pendientes"
            subtitle={`${appointments.length} cita${appointments.length === 1 ? '' : 's'}`}
            cardClassName="bg-transparent border-none shadow-none p-0"
          >
            {appointments.length > 0 ? (
              <PendingAppointmentsList
                appointments={appointments}
                cancelingId={cancelingId}
                onCancel={cancelAppointment}
              />
            ) : (
              <div className="rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                <DashboardEmptyState
                  icon="🗓️"
                  title="Sin citas agendadas"
                  description="Cuando agendes una cita, aparecerá aquí."
                  className="py-12"
                />
              </div>
            )}
          </DashboardSectionCard>
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDismiss={dismissToast} />
    </div>
  )
}
