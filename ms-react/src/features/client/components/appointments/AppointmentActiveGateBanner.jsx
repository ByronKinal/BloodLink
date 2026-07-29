export function AppointmentActiveGateBanner() {
  return (
    <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-4 flex items-start gap-3">
      <span className="text-[18px] leading-none">🗓️</span>
      <div>
        <p className="text-[13px] font-semibold text-rojo">
          Ya tienes una donación programada. Cancélala antes de agendar otra.
        </p>
        <p className="text-[12px] text-txt3 mt-1">
          Revisá "Mis citas pendientes" más abajo para cancelarla si querés elegir otra fecha u horario.
        </p>
      </div>
    </div>
  )
}
