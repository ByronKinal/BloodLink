import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TabSwitcher from '../../../shared/components/TabSwitcher';

const TABS = [
  { value: 'new', label: 'Nuevo Triage' },
  { value: 'history', label: 'Historial' },
];

export default function TriageStepperHeader({ activeTab, setActiveTab }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Triage Médico Donante</Text>
      <Text style={styles.headerSubtitle}>Cuestionario de elegibilidad y evaluación clínica</Text>

      <TabSwitcher tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
});
