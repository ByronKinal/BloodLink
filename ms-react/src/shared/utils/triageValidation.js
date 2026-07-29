export const TRIAGE_FIELD_RULES = {
  edadAnios: { min: 0, max: 120, label: 'Edad' },
  pesoKg: { min: 0.1, max: 400, label: 'Peso' },
  pulsoBpm: { min: 20, max: 220, label: 'Pulso' },
  presionSistolicaMmHg: { min: 60, max: 260, label: 'Presión sistólica' },
  presionDiastolicaMmHg: { min: 30, max: 180, label: 'Presión diastólica' },
  temperaturaC: { min: 32, max: 43, label: 'Temperatura' },
  hemoglobinaGdl: { min: 3, max: 25, label: 'Hemoglobina' },
}

function validateNumericField(name, rawValue) {
  const { min, max, label } = TRIAGE_FIELD_RULES[name]

  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return `${label} es obligatorio`
  }

  const value = Number(rawValue)

  if (Number.isNaN(value)) {
    return `${label} debe ser un número válido`
  }

  if (value < min || value > max) {
    return `${label} debe estar entre ${min} y ${max}`
  }

  return null
}

function validateConditionalDate(hasEventField, dateField, form, eventLabel) {
  if (!form[hasEventField]) {
    return null
  }

  return form[dateField] ? null : `Indica la fecha de ${eventLabel}`
}

export function validatePersonalInfoStep(form) {
  const errors = {}

  const edadError = validateNumericField('edadAnios', form.edadAnios)
  if (edadError) errors.edadAnios = edadError

  const pesoError = validateNumericField('pesoKg', form.pesoKg)
  if (pesoError) errors.pesoKg = pesoError

  return errors
}

export function validateVitalsStep(form) {
  const errors = {}

  ;['pulsoBpm', 'presionSistolicaMmHg', 'presionDiastolicaMmHg', 'temperaturaC', 'hemoglobinaGdl'].forEach(
    (field) => {
      const error = validateNumericField(field, form[field])
      if (error) errors[field] = error
    }
  )

  return errors
}

export function validateMedicalStep() {
  return {}
}

export function validateHabitsStep(form) {
  const errors = {}

  const tattooError = validateConditionalDate(
    'tuvoTatuajeOPiercing',
    'fechaUltimoTatuajeOPiercing',
    form,
    'el tatuaje o piercing'
  )
  if (tattooError) errors.fechaUltimoTatuajeOPiercing = tattooError

  const surgeryError = validateConditionalDate(
    'tuvoCirugiaReciente',
    'fechaUltimaCirugia',
    form,
    'la cirugía'
  )
  if (surgeryError) errors.fechaUltimaCirugia = surgeryError

  return errors
}

export function buildTriagePayload(form) {
  const chronicDiseaseControlled = form.tieneEnfermedadCronica
    ? Boolean(form.enfermedadCronicaControlada)
    : true

  return {
    edadAnios: Number(form.edadAnios),
    pesoKg: Number(form.pesoKg),
    pulsoBpm: Number(form.pulsoBpm),
    presionSistolicaMmHg: Number(form.presionSistolicaMmHg),
    presionDiastolicaMmHg: Number(form.presionDiastolicaMmHg),
    temperaturaC: Number(form.temperaturaC),
    hemoglobinaGdl: Number(form.hemoglobinaGdl),
    tieneFiebre: Boolean(form.tieneFiebre),
    tieneSintomasInfeccion: Boolean(form.tieneSintomasInfeccion),
    tieneEnfermedadCronica: Boolean(form.tieneEnfermedadCronica),
    enfermedadCronicaControlada: chronicDiseaseControlled,
    consumioAlcoholUltimas24h: Boolean(form.consumioAlcoholUltimas24h),
    tomoAntibioticosUltimos7d: Boolean(form.tomoAntibioticosUltimos7d),
    embarazadaOLactando: Boolean(form.embarazadaOLactando),
    tuvoTatuajeOPiercing: Boolean(form.tuvoTatuajeOPiercing),
    fechaUltimoTatuajeOPiercing: form.tuvoTatuajeOPiercing ? form.fechaUltimoTatuajeOPiercing : null,
    tuvoCirugiaReciente: Boolean(form.tuvoCirugiaReciente),
    fechaUltimaCirugia: form.tuvoCirugiaReciente ? form.fechaUltimaCirugia : null,
  }
}
