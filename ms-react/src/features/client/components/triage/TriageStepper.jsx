const STEP_LABELS = {
  personal: 'Datos personales',
  vitals: 'Signos vitales',
  medical: 'Historial médico',
  habits: 'Hábitos recientes',
}

export function TriageStepper({ steps, stepIndex }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {steps.map((stepId, index) => (
          <div key={stepId} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                index <= stepIndex ? 'bg-rojo text-white' : 'bg-gris2 text-txt3'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 ? (
              <div className={`h-[2px] flex-1 ${index < stepIndex ? 'bg-rojo' : 'bg-gris2'}`} />
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.08em] text-rojo">
        Paso {stepIndex + 1} de {steps.length} · {STEP_LABELS[steps[stepIndex]]}
      </p>
    </div>
  )
}
