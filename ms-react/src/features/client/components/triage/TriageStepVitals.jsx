import { InputField } from '../../../../shared/components/InputField.jsx'

export function TriageStepVitals({ form, errors, updateField, disabled }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    updateField(name, value)
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-txt3">Ingresá tus signos vitales medidos recientemente.</p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <InputField
          label="Pulso (bpm)"
          name="pulsoBpm"
          value={form.pulsoBpm}
          onChange={handleChange}
          placeholder="Ej: 72"
          type="number"
          inputMode="numeric"
          error={errors.pulsoBpm}
          disabled={disabled}
          required
        />
        <InputField
          label="Temperatura (°C)"
          name="temperaturaC"
          value={form.temperaturaC}
          onChange={handleChange}
          placeholder="Ej: 36.5"
          type="number"
          inputMode="decimal"
          error={errors.temperaturaC}
          disabled={disabled}
          required
        />
        <InputField
          label="Presión sistólica (mmHg)"
          name="presionSistolicaMmHg"
          value={form.presionSistolicaMmHg}
          onChange={handleChange}
          placeholder="Ej: 120"
          type="number"
          inputMode="numeric"
          error={errors.presionSistolicaMmHg}
          disabled={disabled}
          required
        />
        <InputField
          label="Presión diastólica (mmHg)"
          name="presionDiastolicaMmHg"
          value={form.presionDiastolicaMmHg}
          onChange={handleChange}
          placeholder="Ej: 80"
          type="number"
          inputMode="numeric"
          error={errors.presionDiastolicaMmHg}
          disabled={disabled}
          required
        />
        <InputField
          label="Hemoglobina (g/dL)"
          name="hemoglobinaGdl"
          value={form.hemoglobinaGdl}
          onChange={handleChange}
          placeholder="Ej: 13.5"
          type="number"
          inputMode="decimal"
          error={errors.hemoglobinaGdl}
          disabled={disabled}
          required
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}
