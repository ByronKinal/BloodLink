import { TriageToggleField } from './TriageToggleField.jsx'

export function TriageStepMedical({ form, updateField, disabled }) {
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-txt3">Contanos sobre tu estado de salud actual.</p>

      <TriageToggleField
        label="¿Tenés fiebre en este momento?"
        value={form.tieneFiebre}
        onChange={(value) => updateField('tieneFiebre', value)}
        disabled={disabled}
      />

      <TriageToggleField
        label="¿Presentás síntomas de infección activa?"
        hint="Tos, dolor de garganta, malestar general, etc."
        value={form.tieneSintomasInfeccion}
        onChange={(value) => updateField('tieneSintomasInfeccion', value)}
        disabled={disabled}
      />

      <TriageToggleField
        label="¿Tenés alguna enfermedad crónica?"
        hint="Diabetes, hipertensión, enfermedades cardíacas, etc."
        value={form.tieneEnfermedadCronica}
        onChange={(value) => updateField('tieneEnfermedadCronica', value)}
        disabled={disabled}
      />

      {form.tieneEnfermedadCronica ? (
        <TriageToggleField
          label="¿Tu enfermedad crónica está controlada?"
          hint="Con tratamiento médico vigente y bajo control"
          value={form.enfermedadCronicaControlada}
          onChange={(value) => updateField('enfermedadCronicaControlada', value)}
          disabled={disabled}
        />
      ) : null}
    </div>
  )
}
