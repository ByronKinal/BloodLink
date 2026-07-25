import { Modal } from '../../../../shared/components/Modal.jsx'
import { TriageResultBanner } from '../../../../shared/components/triage/TriageResultBanner.jsx'
import { TriageDetailField } from './TriageDetailField.jsx'
import { formatBoolean, formatDate } from './triageDisplay.utils.js'

function VitalsSection({ form }) {
  return (
    <div>
      <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-txt3">Signos vitales</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <TriageDetailField label="Edad" value={`${form.edadAnios} años`} />
        <TriageDetailField label="Peso" value={`${form.pesoKg} kg`} />
        <TriageDetailField label="Pulso" value={`${form.pulsoBpm} bpm`} />
        <TriageDetailField label="Temperatura" value={`${form.temperaturaC} °C`} />
        <TriageDetailField label="Presión sistólica" value={`${form.presionSistolicaMmHg} mmHg`} />
        <TriageDetailField label="Presión diastólica" value={`${form.presionDiastolicaMmHg} mmHg`} />
        <TriageDetailField label="Hemoglobina" value={`${form.hemoglobinaGdl} g/dL`} />
      </div>
    </div>
  )
}

function HabitsSection({ form }) {
  return (
    <div>
      <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-txt3">Hábitos y riesgos</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <TriageDetailField label="Fiebre" value={formatBoolean(form.tieneFiebre)} />
        <TriageDetailField label="Síntomas de infección" value={formatBoolean(form.tieneSintomasInfeccion)} />
        <TriageDetailField label="Enfermedad crónica" value={formatBoolean(form.tieneEnfermedadCronica)} />
        <TriageDetailField label="Enf. crónica controlada" value={formatBoolean(form.enfermedadCronicaControlada)} />
        <TriageDetailField label="Alcohol últimas 24h" value={formatBoolean(form.consumioAlcoholUltimas24h)} />
        <TriageDetailField label="Antibióticos últimos 7d" value={formatBoolean(form.tomoAntibioticosUltimos7d)} />
        <TriageDetailField label="Embarazo/lactancia" value={formatBoolean(form.embarazadaOLactando)} />
        <TriageDetailField
          label="Tatuaje/piercing"
          value={form.tuvoTatuajeOPiercing ? formatDate(form.fechaUltimoTatuajeOPiercing) : 'No'}
        />
        <TriageDetailField
          label="Cirugía reciente"
          value={form.tuvoCirugiaReciente ? formatDate(form.fechaUltimaCirugia) : 'No'}
        />
      </div>
    </div>
  )
}

export function TriageDetailModal({ form, reviewing, onClose, onReview }) {
  const isPending = form?.reviewStatus === 'PENDIENTE'

  return (
    <Modal
      open={Boolean(form)}
      title="Detalle del triaje"
      subtitle={form ? form.donorEmail || `Donante ${form.accountId.slice(0, 8)}…` : ''}
      onClose={onClose}
      maxWidth="max-w-[680px]"
      footer={
        isPending ? (
          <>
            <button
              type="button"
              onClick={() => onReview(form.id, 'RECHAZADO')}
              disabled={reviewing}
              className="rounded-[10px] border border-[rgba(212,32,64,0.3)] bg-white px-4 py-2 text-[13px] font-semibold text-rojo transition-colors hover:bg-[rgba(212,32,64,0.06)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => onReview(form.id, 'APROBADO')}
              disabled={reviewing}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-verde-v bg-verde-v px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#239054] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reviewing ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              Aprobar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt hover:border-rojo hover:text-rojo"
          >
            Cerrar
          </button>
        )
      }
    >
      {form ? (
        <div className="space-y-5">
          <TriageResultBanner evaluation={form.evaluation} />
          <VitalsSection form={form} />
          <HabitsSection form={form} />
        </div>
      ) : null}
    </Modal>
  )
}
