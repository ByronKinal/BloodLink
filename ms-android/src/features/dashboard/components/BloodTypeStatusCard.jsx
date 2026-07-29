import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function getEligibilitySubtitle(eligibility) {
  switch (eligibility?.text) {
    case 'Elegible para Donar':
      return '¡Gracias por estar listo para salvar vidas!';
    case 'No Elegible por el momento':
      return 'Revisa tu Triage para más detalles.';
    case 'Realiza tu Triage clínico':
      return 'Completa tu evaluación médica para conocer tu estado.';
    case 'Triage pendiente de realizar':
      return 'Vuelve a intentarlo en unos momentos.';
    default:
      return 'Verificando tu estado de elegibilidad...';
  }
}

export default function BloodTypeStatusCard({ bloodType, eligibility, onPress }) {
  const subtitle = getEligibilitySubtitle(eligibility);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
    >
      <View style={styles.column}>
        <View style={styles.labelRow}>
          <View style={styles.dropIconWrap}>
            <Ionicons name="water" size={14} color="#D42040" />
          </View>
          <Text style={styles.label}>Tu Estado</Text>
        </View>
        <Text style={styles.bloodType}>{bloodType || '—'}</Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.column, styles.statusColumn]}>
        <View style={[styles.statusIconWrap, { backgroundColor: eligibility?.bg || '#DCFCE7' }]}>
          <Ionicons
            name={eligibility?.icon || 'checkmark-circle-outline'}
            size={26}
            color={eligibility?.color || '#16A34A'}
          />
        </View>
        <Text style={[styles.statusTitle, { color: eligibility?.color || '#16A34A' }]} numberOfLines={1}>
          {eligibility?.text || 'Elegible para Donar'}
        </Text>
        <Text style={styles.statusSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  column: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  bloodType: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1E293B',
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 18,
  },
  statusColumn: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});
