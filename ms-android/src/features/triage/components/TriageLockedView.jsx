import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import StatusCard from '../../../shared/components/StatusCard';

export default function TriageLockedView({ message }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <StatusCard
        tone="warning"
        icon="time-outline"
        title="Formulario en Espera"
        message={message}
        actionLabel="Llenar Formulario"
        actionDisabled
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
