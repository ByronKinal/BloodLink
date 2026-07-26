import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

export default function TriageStep2Health({ formData, onChangeField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Paso 2: Infecciones y Salud General</Text>
      <Text style={styles.stepSubtitle}>Responde con precisión a las siguientes preguntas</Text>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Tienes o has tenido fiebre en los últimos días?</Text>
        </View>
        <Switch
          value={formData.tieneFiebre}
          onValueChange={(val) => onChangeField('tieneFiebre', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.tieneFiebre ? '#D42040' : '#F8FAFC'}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Presentas síntomas de infección activa (tos, dolor, etc.)?</Text>
        </View>
        <Switch
          value={formData.tieneSintomasInfeccion}
          onValueChange={(val) => onChangeField('tieneSintomasInfeccion', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.tieneSintomasInfeccion ? '#D42040' : '#F8FAFC'}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Padeces alguna enfermedad crónica?</Text>
        </View>
        <Switch
          value={formData.tieneEnfermedadCronica}
          onValueChange={(val) => onChangeField('tieneEnfermedadCronica', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.tieneEnfermedadCronica ? '#D42040' : '#F8FAFC'}
        />
      </View>

      {formData.tieneEnfermedadCronica && (
        <View style={styles.switchRow}>
          <View style={styles.switchTextCol}>
            <Text style={styles.switchLabel}>¿Tu enfermedad crónica se encuentra controlada?</Text>
          </View>
          <Switch
            value={formData.enfermedadCronicaControlada}
            onValueChange={(val) => onChangeField('enfermedadCronicaControlada', val)}
            trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
            thumbColor={formData.enfermedadCronicaControlada ? '#16A34A' : '#F8FAFC'}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
});
