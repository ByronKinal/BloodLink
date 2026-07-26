import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';

export default function TriageHistoryView({ history, loading, error, onRetry }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {loading ? (
        <LoadingView message="Cargando historial..." />
      ) : error ? (
        <ErrorView message={error} onRetry={onRetry} />
      ) : history.length === 0 ? (
        <EmptyView
          icon="clipboard-outline"
          title="Sin evaluaciones registradas"
          subtitle="Completa tu primer cuestionario de triage para registrar tu estado."
        />
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