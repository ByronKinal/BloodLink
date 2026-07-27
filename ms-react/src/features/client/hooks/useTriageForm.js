import { useState } from 'react'
import { createTriage } from '../../../shared/api/triage.api.js'
import {
  buildTriagePayload,
  validateHabitsStep,
  validateMedicalStep,
  validatePersonalInfoStep,
  validateVitalsStep,
} from '../../../shared/utils/triageValidation.js'

export const TRIAGE_STEPS = ['personal', 'vitals', 'medical', 'habits']

const INITIAL_FORM = {
  edadAnios: '',
  pesoKg: '',
  pulsoBpm: '',
  presionSistolicaMmHg: '',
  presionDiastolicaMmHg: '',
  temperaturaC: '',
  hemoglobinaGdl: '',
  tieneFiebre: false,
  tieneSintomasInfeccion: false,
  tieneEnfermedadCronica: false,
  enfermedadCronicaControlada: false,
  consumioAlcoholUltimas24h: false,
  tomoAntibioticosUltimos7d: false,
  embarazadaOLactando: false,
  tuvoTatuajeOPiercing: false,
  fechaUltimoTatuajeOPiercing: '',
  tuvoCirugiaReciente: false,
  fechaUltimaCirugia: '',
}

const STEP_VALIDATORS = {
  personal: validatePersonalInfoStep,
  vitals: validateVitalsStep,
  medical: validateMedicalStep,
  habits: validateHabitsStep,
}

function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message ?? item.msg).join(' · ')
  }

  return error?.response?.data?.message || error?.message || 'No se pudo enviar el formulario de triaje.'
}

export function useTriageForm() {
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState(null)

  const currentStepId = TRIAGE_STEPS[stepIndex]

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const goNext = () => {
    const stepErrors = STEP_VALIDATORS[currentStepId](form)

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return false
    }

    setErrors({})
    setStepIndex((current) => Math.min(current + 1, TRIAGE_STEPS.length - 1))
    return true
  }

  const goBack = () => {
    setSubmitError('')
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  const reset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setStepIndex(0)
    setSubmitError('')
    setResult(null)
  }

  const submit = async () => {
    const stepErrors = STEP_VALIDATORS[currentStepId](form)

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = buildTriagePayload(form)
      const response = await createTriage(payload)
      setResult(response.data?.data ?? null)
    } catch (submitErr) {
      setSubmitError(getErrorMessage(submitErr))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    stepIndex,
    currentStepId,
    totalSteps: TRIAGE_STEPS.length,
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
    isLastStep: stepIndex === TRIAGE_STEPS.length - 1,
  }
}
