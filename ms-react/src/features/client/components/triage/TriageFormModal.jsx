import { Modal } from '../../../../shared/components/Modal.jsx'
import { TRIAGE_STEPS, useTriageForm } from '../../hooks/useTriageForm.js'
import { TriageStepper } from './TriageStepper.jsx'
import { TriageStepPersonalInfo } from './TriageStepPersonalInfo.jsx'
import { TriageStepVitals } from './TriageStepVitals.jsx'
import { TriageStepMedical } from './TriageStepMedical.jsx'
import { TriageStepHabits } from './TriageStepHabits.jsx'
import { TriageResultBanner } from '../../../../shared/components/triage/TriageResultBanner.jsx'

const STEP_COMPONENTS = {
  personal: TriageStepPersonalInfo,
  vitals: TriageStepVitals,
  medical: TriageStepMedical,
  habits: TriageStepHabits,
}

export function TriageFormModal({ open, onClose, onSubmitted }) {
  const {
    stepIndex,
    currentStepId,
    form,
    errors,
    submitting,
    submitError,
    result,
    updateField,
    goNext,
    goBack,
    submit,
    reset,
    isLastStep,
  } = useTriageForm()

  const handleClose = () => {
    const hadResult = Boolean(result)
    reset()
    onClose()
    if (hadResult) {
      onSubmitted()
    }
  }

  const StepComponent = STEP_COMPONENTS[currentStepId]

  return (
    <Modal
      open={open}
      title="Formulario de triaje médico"
      subtitle="Respondé con sinceridad, esto garantiza una donación segura."
      onClose={handleClose}
      maxWidth="max-w-[640px]"
      footer={
        result ? (
          <button
            type="button"
            onClick={handleClose}
            className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white hover:bg-rojo-v transition-colors"
          >
            Cerrar
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
              className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt hover:border-rojo hover:text-rojo transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={isLastStep ? submit : goNext}
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white hover:bg-rojo-v transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              {submitting ? 'Enviando...' : isLastStep ? 'Enviar' : 'Siguiente'}
            </button>
          </>
        )
      }
    >
      {result ? (
        <TriageResultBanner evaluation={result.evaluation} />
      ) : (
        <>
          <TriageStepper steps={TRIAGE_STEPS} stepIndex={stepIndex} />

          {submitError ? (
            <div className="mb-4 rounded-[12px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
              {submitError}
            </div>
          ) : null}

          <StepComponent form={form} errors={errors} updateField={updateField} disabled={submitting} />
        </>
      )}
    </Modal>
  )
}
