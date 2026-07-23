import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function TriageStep1Vitals({ formData, onChangeField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Paso 1: Signos Vitales y Biometría</Text>
      <Text style={styles.stepSubtitle}>Ingresa tus mediciones clínicas actuales</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Edad (Años) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej. 25"
          value={formData.edadAnios}
          onChangeText={(val) => onChangeField('edadAnios', val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Peso (Kg) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej. 70"
          value={formData.pesoKg}
          onChangeText={(val) => onChangeField('pesoKg', val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pulso (BPM) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej. 75"
          value={formData.pulsoBpm}
          onChangeText={(val) => onChangeField('pulsoBpm', val)}
        />
      </View>

      <View style={styles.rowTwo}>
        <View style={[styles.inputGroup, { flex: 0.48 }]}>
          <Text style={styles.label}>P. Sistólica (mmHg) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="120"
            value={formData.presionSistolicaMmHg}
            onChangeText={(val) => onChangeField('presionSistolicaMmHg', val)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 0.48 }]}>
          <Text style={styles.label}>P. Diastólica (mmHg) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="80"
            value={formData.presionDiastolicaMmHg}
            onChangeText={(val) => onChangeField('presionDiastolicaMmHg', val)}
          />
        </View>
      </View>

      <View style={styles.rowTwo}>
        <View style={[styles.inputGroup, { flex: 0.48 }]}>
          <Text style={styles.label}>Temperatura (°C) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="36.5"
            value={formData.temperaturaC}
            onChangeText={(val) => onChangeField('temperaturaC', val)}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 0.48 }]}>
          <Text style={styles.label}>Hemoglobina (g/dL) *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="14.2"
            value={formData.hemoglobinaGdl}
            onChangeText={(val) => onChangeField('hemoglobinaGdl', val)}
          />
        </View>
      </View>
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
  inputGroup: {
    marginBottom: 14,
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
});
