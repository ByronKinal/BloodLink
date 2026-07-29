import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import YesNoToggle from './YesNoToggle';

export default function TriageStep2Health({ formData, onChangeField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Paso 2: Infecciones y Salud General</Text>
      <Text style={styles.stepSubtitle}>Responde con precisión a las siguientes preguntas</Text>

      <YesNoToggle
        icon="thermometer-outline"
        label="¿Tienes o has tenido fiebre en los últimos días?"
        value={formData.tieneFiebre}
        onChange={(val) => onChangeField('tieneFiebre', val)}
      />

      <YesNoToggle
        icon="bandage-outline"
        label="¿Presentas síntomas de infección activa (tos, dolor, etc.)?"
        value={formData.tieneSintomasInfeccion}
        onChange={(val) => onChangeField('tieneSintomasInfeccion', val)}
      />

      <YesNoToggle
        icon="fitness-outline"
        label="¿Padeces alguna enfermedad crónica?"
        value={formData.tieneEnfermedadCronica}
        onChange={(val) => onChangeField('tieneEnfermedadCronica', val)}
      />

      {formData.tieneEnfermedadCronica ? (
        <YesNoToggle
          icon="checkmark-done-outline"
          label="¿Tu enfermedad crónica se encuentra controlada?"
          value={formData.enfermedadCronicaControlada}
          onChange={(val) => onChangeField('enfermedadCronicaControlada', val)}
        />
      ) : null}
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
