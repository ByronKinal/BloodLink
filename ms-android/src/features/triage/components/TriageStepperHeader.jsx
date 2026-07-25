import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function TriageStepperHeader({ activeTab, setActiveTab }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Triage Médico Donante</Text>
      <Text style={styles.headerSubtitle}>Cuestionario de elegibilidad y evaluación clínica</Text>

      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'new' && styles.tabBtnActive]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'new' && styles.tabBtnTextActive]}>
            Nuevo Triage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'history' && styles.tabBtnTextActive]}>
            Historial
          </Text>
        </TouchableOpacity>
      </View>
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
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    marginTop: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#D42040',
  },
  tabBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
});
