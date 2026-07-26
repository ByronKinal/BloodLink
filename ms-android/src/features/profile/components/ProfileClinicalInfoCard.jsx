import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={20} color="#64748B" />
        <Text style={styles.infoLabel}>Teléfono:</Text>
        <Text style={styles.infoVal}>{phone}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={20} color="#64748B" />
        <Text style={styles.infoLabel}>Correo:</Text>
        <Text style={styles.infoVal}>{email}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <Ionicons name="medkit-outline" size={20} color="#64748B" />
        <Text style={styles.infoLabel}>Última donación:</Text>
        <Text style={styles.infoVal}>
          {lastDonationDate ? new Date(lastDonationDate).toLocaleDateString('es-GT') : 'Sin registro'}
        </Text>
      </View>
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
    borderRadius: 16,
    padding: 16,
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
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 10,
    width: 80,
  },
  infoVal: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
