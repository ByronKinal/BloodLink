import { InputField } from '../../../../shared/components/InputField.jsx'

export function TriageStepPersonalInfo({ form, errors, updateField, disabled }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    updateField(name, value)
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-txt3">Contanos un poco sobre vos para comenzar la evaluación.</p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <InputField
          label="Edad (años)"
          name="edadAnios"
          value={form.edadAnios}
          onChange={handleChange}
          placeholder="Ej: 28"
          type="number"
          inputMode="numeric"
          error={errors.edadAnios}
          disabled={disabled}
          required
        />
        <InputField
          label="Peso (kg)"
          name="pesoKg"
          value={form.pesoKg}
          onChange={handleChange}
          placeholder="Ej: 68"
          type="number"
          inputMode="decimal"
          error={errors.pesoKg}
          disabled={disabled}
          required
        />
      </div>
    </div>
  )
}
