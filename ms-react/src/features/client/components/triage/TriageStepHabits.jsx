import { InputField } from '../../../../shared/components/InputField.jsx'
import { TriageToggleField } from './TriageToggleField.jsx'

export function TriageStepHabits({ form, errors, updateField, disabled }) {
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-txt3">Últimos hábitos y eventos recientes.</p>

      <TriageToggleField
        label="¿Consumiste alcohol en las últimas 24 horas?"
        value={form.consumioAlcoholUltimas24h}
        onChange={(value) => updateField('consumioAlcoholUltimas24h', value)}
        disabled={disabled}
      />

      <TriageToggleField
        label="¿Tomaste antibióticos en los últimos 7 días?"
        value={form.tomoAntibioticosUltimos7d}
        onChange={(value) => updateField('tomoAntibioticosUltimos7d', value)}
        disabled={disabled}
      />

      <TriageToggleField
        label="¿Estás embarazada o en periodo de lactancia?"
        value={form.embarazadaOLactando}
        onChange={(value) => updateField('embarazadaOLactando', value)}
        disabled={disabled}
      />

      <TriageToggleField
        label="¿Te hiciste un tatuaje o piercing recientemente?"
        value={form.tuvoTatuajeOPiercing}
        onChange={(value) => updateField('tuvoTatuajeOPiercing', value)}
        disabled={disabled}
      />
      {form.tuvoTatuajeOPiercing ? (
        <InputField
          label="Fecha del tatuaje o piercing"
          name="fechaUltimoTatuajeOPiercing"
          type="date"
          value={form.fechaUltimoTatuajeOPiercing}
          onChange={(event) => updateField('fechaUltimoTatuajeOPiercing', event.target.value)}
          error={errors.fechaUltimoTatuajeOPiercing}
          disabled={disabled}
          required
        />
      ) : null}

      <TriageToggleField
        label="¿Tuviste una cirugía reciente?"
        value={form.tuvoCirugiaReciente}
        onChange={(value) => updateField('tuvoCirugiaReciente', value)}
        disabled={disabled}
      />
      {form.tuvoCirugiaReciente ? (
        <InputField
          label="Fecha de la cirugía"
          name="fechaUltimaCirugia"
          type="date"
          value={form.fechaUltimaCirugia}
          onChange={(event) => updateField('fechaUltimaCirugia', event.target.value)}
          error={errors.fechaUltimaCirugia}
          disabled={disabled}
          required
        />
      ) : null}
    </div>
  )
}
