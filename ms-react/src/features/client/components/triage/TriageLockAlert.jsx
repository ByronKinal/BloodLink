export function TriageLockAlert({ hoursRemaining }) {
  return (
    <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 flex items-start gap-3">
      <span className="text-[18px] leading-none">⏳</span>
      <div>
        <p className="text-[13px] font-semibold text-rojo">
          Debes esperar 24 horas para volver a intentar
        </p>
        <p className="text-[12px] text-txt3 mt-1">
          Ya enviaste un formulario de triaje recientemente. Podrás volver a intentarlo en aproximadamente{' '}
          {hoursRemaining} hora{hoursRemaining === 1 ? '' : 's'}.
        </p>
      </div>
    </div>
  )
}
