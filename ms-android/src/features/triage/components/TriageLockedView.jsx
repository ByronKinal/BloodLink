import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TriageLockedView({ message }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.resultCard, styles.resultWarning]}>
        <Ionicons name="time-outline" size={64} color="#D97706" />
        <Text style={styles.resultTitle}>Formulario en Espera</Text>
        <Text style={styles.resultSub}>{message}</Text>

        <TouchableOpacity style={styles.lockedBtn} disabled>
          <Text style={styles.lockedBtnText}>Llenar Formulario</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  resultCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  resultWarning: {
    backgroundColor: '#FEF3C7',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  resultSub: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  lockedBtn: {
    backgroundColor: '#CBD5E1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  lockedBtnText: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
