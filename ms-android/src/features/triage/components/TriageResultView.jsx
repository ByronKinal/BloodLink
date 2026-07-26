import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import StatusCard from '../../../shared/components/StatusCard';

export default function TriageResultView({ result, onReset }) {
  const isApto = result?.data?.esApto !== false;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <StatusCard
        tone={isApto ? 'success' : 'warning'}
        icon={isApto ? 'checkmark-circle' : 'alert-circle'}
        title={isApto ? '¡Eres Apto para Donar!' : 'Evaluación Completada'}
        message={result?.message}
        actionLabel="Realizar Nuevo Triage"
        onAction={onReset}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
