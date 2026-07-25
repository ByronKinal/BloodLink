import { DashboardSectionCard } from '../../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardEmptyState } from '../../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { Toast } from '../../../../shared/components/Toast.jsx'
import { useStaffAgenda } from '../../hooks/useStaffAgenda.js'
import { StaffAgendaDatePicker } from './StaffAgendaDatePicker.jsx'
import { StaffAgendaTable } from './StaffAgendaTable.jsx'
import { StaffAgendaSkeleton } from './StaffAgendaSkeleton.jsx'

export function StaffAgendaPanel() {
  const {
    selectedDate,
    setSelectedDate,
    appointments,
    loading,
    error,
    confirmingId,
    confirmAttendance,
    toast,
    dismissToast,
  } = useStaffAgenda()

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">Agenda</p>
          <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Citas del día</h2>
          <p className="text-[13px] text-txt3 font-light mt-1">Revisá y confirmá la asistencia de los donantes.</p>
        </div>

        <StaffAgendaDatePicker value={selectedDate} onChange={setSelectedDate} />
      </div>

      {error ? (
        <div className="mb-5 rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {loading ? (
        <StaffAgendaSkeleton />
      ) : appointments.length > 0 ? (
        <DashboardSectionCard
          title="Citas programadas"
          subtitle={`${appointments.length} cita${appointments.length === 1 ? '' : 's'}`}
          cardClassName="bg-transparent border-none shadow-none p-0"
        >
          <StaffAgendaTable appointments={appointments} confirmingId={confirmingId} onConfirm={confirmAttendance} />
        </DashboardSectionCard>
      ) : (
        <div className="rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <DashboardEmptyState
            icon="🗓️"
            title="Sin citas para este día"
            description="Cambiá la fecha para revisar otro día."
            className="py-12"
          />
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDismiss={dismissToast} />
    </div>
  )
}
