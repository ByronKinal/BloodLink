export function AppointmentTriageGateBanner({ daysSinceSubmission }) {
  const hasForm = daysSinceSubmission !== null

  return (
    <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-4 flex items-start gap-3">
      <span className="text-[18px] leading-none">⚠️</span>
      <div>
        <p className="text-[13px] font-semibold text-rojo">
          Debes actualizar tu formulario de Triage médico antes de agendar una cita
        </p>
        <p className="text-[12px] text-txt3 mt-1">
          {hasForm
            ? `Tu último triaje tiene ${daysSinceSubmission} día${daysSinceSubmission === 1 ? '' : 's'} de antigüedad. Debe tener menos de 7 días para poder agendar.`
            : 'Aún no has completado ningún formulario de triaje médico.'}
        </p>
      </div>
    </div>
  )
}
