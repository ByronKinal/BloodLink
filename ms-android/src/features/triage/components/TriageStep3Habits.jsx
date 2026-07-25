import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

export default function TriageStep3Habits({ formData, onChangeField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Paso 3: Hábitos y Factores de Riesgo</Text>
      <Text style={styles.stepSubtitle}>Último paso para determinar tu elegibilidad</Text>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Consumiste alcohol en las últimas 24 horas?</Text>
        </View>
        <Switch
          value={formData.consumioAlcoholUltimas24h}
          onValueChange={(val) => onChangeField('consumioAlcoholUltimas24h', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.consumioAlcoholUltimas24h ? '#D42040' : '#F8FAFC'}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Has tomado antibióticos en los últimos 7 días?</Text>
        </View>
        <Switch
          value={formData.tomoAntibioticosUltimos7d}
          onValueChange={(val) => onChangeField('tomoAntibioticosUltimos7d', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.tomoAntibioticosUltimos7d ? '#D42040' : '#F8FAFC'}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Estás embarazada o en periodo de lactancia?</Text>
        </View>
        <Switch
          value={formData.embarazadaOLactando}
          onValueChange={(val) => onChangeField('embarazadaOLactando', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.embarazadaOLactando ? '#D42040' : '#F8FAFC'}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Te has hecho un tatuaje o piercing recientemente?</Text>
        </View>
        <Switch
          value={formData.tuvoTatuajeOPiercing}
          onValueChange={(val) => onChangeField('tuvoTatuajeOPiercing', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.tuvoTatuajeOPiercing ? '#D42040' : '#F8FAFC'}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextCol}>
          <Text style={styles.switchLabel}>¿Tuviste alguna cirugía o procedimiento reciente?</Text>
        </View>
        <Switch
          value={formData.tuvoCirugiaReciente}
          onValueChange={(val) => onChangeField('tuvoCirugiaReciente', val)}
          trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
          thumbColor={formData.tuvoCirugiaReciente ? '#D42040' : '#F8FAFC'}
        />
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
