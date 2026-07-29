import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function VitalInput({ icon, label, ...inputProps }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={16} color="#D42040" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...inputProps} />
      </View>
    </View>
  );
}

export default function TriageStep1Vitals({ formData, onChangeField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Paso 1: Signos Vitales y Biometría</Text>
      <Text style={styles.stepSubtitle}>Ingresa tus mediciones clínicas actuales</Text>

      <VitalInput
        icon="calendar-outline"
        label="Edad (Años) *"
        keyboardType="numeric"
        placeholder="Ej. 25"
        value={formData.edadAnios}
        onChangeText={(val) => onChangeField('edadAnios', val)}
      />

      <VitalInput
        icon="barbell-outline"
        label="Peso (Kg) *"
        keyboardType="numeric"
        placeholder="Ej. 70"
        value={formData.pesoKg}
        onChangeText={(val) => onChangeField('pesoKg', val)}
      />

      <VitalInput
        icon="pulse"
        label="Pulso (BPM) *"
        keyboardType="numeric"
        placeholder="Ej. 75"
        value={formData.pulsoBpm}
        onChangeText={(val) => onChangeField('pulsoBpm', val)}
      />

      <View style={styles.rowTwo}>
        <View style={styles.halfField}>
          <VitalInput
            icon="speedometer-outline"
            label="P. Sistólica *"
            keyboardType="numeric"
            placeholder="120"
            value={formData.presionSistolicaMmHg}
            onChangeText={(val) => onChangeField('presionSistolicaMmHg', val)}
          />
        </View>

        <View style={styles.halfField}>
          <VitalInput
            icon="speedometer-outline"
            label="P. Diastólica *"
            keyboardType="numeric"
            placeholder="80"
            value={formData.presionDiastolicaMmHg}
            onChangeText={(val) => onChangeField('presionDiastolicaMmHg', val)}
          />
        </View>
      </View>

      <View style={styles.rowTwo}>
        <View style={styles.halfField}>
          <VitalInput
            icon="thermometer-outline"
            label="Temp. (°C) *"
            keyboardType="numeric"
            placeholder="36.5"
            value={formData.temperaturaC}
            onChangeText={(val) => onChangeField('temperaturaC', val)}
          />
        </View>

        <View style={styles.halfField}>
          <VitalInput
            icon="water"
            label="Hemoglobina *"
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
  halfField: {
    flex: 0.48,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248,250,252,0.9)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
});
