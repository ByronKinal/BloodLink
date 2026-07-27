const STATUS_CONFIG = {
  apto: { color: '#28A060', bg: 'rgba(40,160,96,0.08)', label: 'Apto para donar', icon: '🟢' },
  'no-apto': {
    color: '#B81C32',
    bg: 'rgba(184,28,50,0.08)',
    label: 'No apto según tu último triaje',
    icon: '🔴',
  },
  vencido: {
    color: '#C8942A',
    bg: 'rgba(200,148,42,0.08)',
    label: 'Tu triaje venció, actualízalo',
    icon: '🟡',
  },
  'sin-triaje': {
    color: '#8A7070',
    bg: 'rgba(138,112,112,0.08)',
    label: 'Aún no completaste tu triaje médico',
    icon: '⚪',
  },
}

export function ClientEligibilitySemaphore({ status, daysSinceSubmission }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['sin-triaje']

  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-gris2 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[22px]"
        style={{ background: config.bg }}
      >
        {config.icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: config.color }}>
          Elegibilidad para donar
        </p>
        <p className="text-[14px] font-semibold text-txt mt-[2px]">{config.label}</p>
        {daysSinceSubmission !== null ? (
          <p className="text-[11px] text-txt3 mt-[2px]">
            Último triaje hace {daysSinceSubmission} día{daysSinceSubmission === 1 ? '' : 's'}.
          </p>
        ) : null}
      </div>
    </div>
  )
}
