import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentsEmptyState({ onSchedule }) {
  return (
    <View style={styles.card}>
      <View style={styles.illustrationWrap}>
        <View style={styles.glowCircle} />
        <Image
          source={require('../../../../assets/img/bloodlink_asset_transparente.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Aún no tienes citas agendadas</Text>
      <Text style={styles.subtitle}>Programa una nueva cita en tu centro de donación más cercano.</Text>

      <TouchableOpacity style={styles.actionBtn} onPress={onSchedule} activeOpacity={0.85}>
        <Ionicons name="calendar" size={18} color="#FFFFFF" />
        <Text style={styles.actionBtnText}>Agendar mi cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  illustrationWrap: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  glowCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FEE2E2',
    opacity: 0.6,
  },
  illustration: {
    width: 170,
    height: 170,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 19,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D42040',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#D42040',
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
