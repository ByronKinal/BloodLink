import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TriageResultView({ result, onReset }) {
  const isApto = result?.data?.esApto !== false;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.resultCard, isApto ? styles.resultSuccess : styles.resultWarning]}>
        <Ionicons
          name={isApto ? 'checkmark-circle' : 'alert-circle'}
          size={64}
          color={isApto ? '#16A34A' : '#D97706'}
        />
        <Text style={styles.resultTitle}>
          {isApto ? '¡Eres Apto para Donar!' : 'Evaluación Completada'}
        </Text>
        <Text style={styles.resultSub}>{result?.message}</Text>

        <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetBtnText}>Realizar Nuevo Triage</Text>
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
  resultSuccess: {
    backgroundColor: '#DCFCE7',
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
  resetBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  resetBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
