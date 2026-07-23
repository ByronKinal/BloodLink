import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TriageHistoryView({ history, loading, error }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D42040" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="clipboard-outline" size={54} color="#94A3B8" />
          <Text style={styles.emptyTitle}>Sin evaluaciones registradas</Text>
          <Text style={styles.emptySub}>Completa tu primer cuestionario de triage para registrar tu estado.</Text>
        </View>
      ) : (
        history.map((item, index) => {
          const isEligible = item.esApto ?? item.isEligible ?? true;
          return (
            <View key={item._id || index} style={styles.historyCard}>
              <View style={styles.historyCardHeader}>
                <Ionicons
                  name={isEligible ? 'checkmark-circle' : 'close-circle'}
                  size={28}
                  color={isEligible ? '#16A34A' : '#DC2626'}
                />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyStatus}>
                    {isEligible ? 'Elegible para Donación' : 'No Elegible'}
                  </Text>
                  <Text style={styles.historyDate}>
                    {item.createdAt || item.fecha || 'Fecha registrada'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    marginLeft: 12,
  },
  historyStatus: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  historyDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
