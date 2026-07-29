import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function InfoRow({ icon, iconBg, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.iconSquare, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoVal}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </View>
  );
}

export default function ProfileClinicalInfoCard({ loading, profileError, phone, email, lastDonationDate, onRetry }) {
  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#D42040" />
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={styles.infoCardError}>
        <Ionicons name="information-circle-outline" size={32} color="#D97706" />
        <Text style={styles.infoErrorText}>{profileError}</Text>
        <Text style={styles.infoErrorSub}>Realiza tu primer Triage o consulta médica para actualizar tu perfil.</Text>
        {onRetry ? (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.infoCard}>
      <InfoRow icon="call" iconBg="#D42040" label="Teléfono:" value={phone} />
      <View style={styles.divider} />
      <InfoRow icon="mail" iconBg="#2563EB" label="Correo:" value={email} />
      <View style={styles.divider} />
      <InfoRow
        icon="medkit"
        iconBg="#16A34A"
        label="Última donación:"
        value={lastDonationDate ? new Date(lastDonationDate).toLocaleDateString('es-GT') : 'Sin registro'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    padding: 20,
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  infoCardError: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  infoErrorText: {
    color: '#B45309',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
  },
  infoErrorSub: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoVal: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 10,
  },
});
