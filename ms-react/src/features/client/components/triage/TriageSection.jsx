import { useState } from 'react'
import { DashboardSectionCard } from '../../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { useTriageLock } from '../../hooks/useTriageLock.js'
import { TriageLockAlert } from './TriageLockAlert.jsx'
import { TriageFormModal } from './TriageFormModal.jsx'

export function TriageSection() {
  const { loading, error, blocked, hoursRemaining, refresh } = useTriageLock()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <div className="mb-7">
        <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">Evaluación previa</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Triaje médico</h2>
        <p className="text-[13px] text-txt3 font-light mt-1">
          Completá el cuestionario clínico antes de agendar tu próxima donación.
        </p>
      </div>

      <DashboardSectionCard
        title="Cuestionario de elegibilidad"
        subtitle="Este formulario evalúa si estás en condiciones de donar sangre"
        cardClassName="rounded-[14px] bg-blanco border border-gris2 overflow-hidden"
      >
        <div className="px-5 py-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-[13px] text-txt3">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-rojo border-t-transparent" />
              Verificando tu estado de triaje...
            </div>
          ) : error ? (
            <div className="rounded-[12px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
              {error}
            </div>
          ) : blocked ? (
            <TriageLockAlert hoursRemaining={hoursRemaining} />
          ) : (
            <p className="text-[13px] text-txt3">
              Estás habilitado para completar el formulario de triaje médico.
            </p>
          )}

          <button
            type="button"
            disabled={loading || blocked}
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto rounded-[12px] border border-rojo bg-rojo px-6 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rojo"
          >
            Llenar formulario
          </button>
        </div>
      </DashboardSectionCard>

      <TriageFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={refresh}
      />
    </div>
  )
}
