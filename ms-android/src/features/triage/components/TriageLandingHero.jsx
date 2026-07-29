import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TriageLandingHero({ onStart, onSeeHistory, startDisabled }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="clipboard-outline" size={32} color="#D42040" />
        <View style={styles.iconBadge}>
          <Ionicons name="water" size={12} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.title}>Triage de Donante</Text>
      <Text style={styles.subtitle}>Cuestionario de elegibilidad y evaluación clínica</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.startButton, startDisabled && styles.startButtonDisabled]}
          onPress={onStart}
          disabled={startDisabled}
          activeOpacity={0.85}
        >
          <View style={styles.startIconWrap}>
            <Ionicons name="add" size={16} color="#D42040" />
          </View>
          <Text style={styles.startButtonText}>Iniciar Nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyButton} onPress={onSeeHistory} activeOpacity={0.85}>
          <Ionicons name="document-text-outline" size={18} color="#D42040" />
          <Text style={styles.historyButtonText}>Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 3,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D42040',
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: '#D42040',
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
  },
  historyButtonText: {
    color: '#D42040',
    fontWeight: '700',
    fontSize: 15,
  },
});
