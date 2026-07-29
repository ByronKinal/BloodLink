import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import YesNoToggle from './YesNoToggle';

export default function TriageStep3Habits({ formData, onChangeField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Paso 3: Hábitos y Factores de Riesgo</Text>
      <Text style={styles.stepSubtitle}>Último paso para determinar tu elegibilidad</Text>

      <YesNoToggle
        icon="wine-outline"
        label="¿Consumiste alcohol en las últimas 24 horas?"
        value={formData.consumioAlcoholUltimas24h}
        onChange={(val) => onChangeField('consumioAlcoholUltimas24h', val)}
      />

      <YesNoToggle
        icon="medkit-outline"
        label="¿Has tomado antibióticos en los últimos 7 días?"
        value={formData.tomoAntibioticosUltimos7d}
        onChange={(val) => onChangeField('tomoAntibioticosUltimos7d', val)}
      />

      <YesNoToggle
        icon="woman-outline"
        label="¿Estás embarazada o en periodo de lactancia?"
        value={formData.embarazadaOLactando}
        onChange={(val) => onChangeField('embarazadaOLactando', val)}
      />

      <YesNoToggle
        icon="body-outline"
        label="¿Te has hecho un tatuaje o piercing recientemente?"
        value={formData.tuvoTatuajeOPiercing}
        onChange={(val) => onChangeField('tuvoTatuajeOPiercing', val)}
      />

      <YesNoToggle
        icon="cut-outline"
        label="¿Tuviste alguna cirugía o procedimiento reciente?"
        value={formData.tuvoCirugiaReciente}
        onChange={(val) => onChangeField('tuvoCirugiaReciente', val)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
    marginTop: 2,
  },
});
