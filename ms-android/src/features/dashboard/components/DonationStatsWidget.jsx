import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DonationStatsWidget({ loading, error, stats, onRetry }) {
  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleRow}>
          <Ionicons name="stats-chart" size={22} color="#16A34A" />
          <Text style={styles.widgetTitle}> Impacto de Donación</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#16A34A" style={{ marginVertical: 12 }} />
      ) : error ? (
        <View style={styles.errorRow}>
          <Text style={styles.widgetErrorText}>{error}</Text>
          {onRetry ? (
            <TouchableOpacity onPress={onRetry}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <View style={styles.statsGrid}>
          <View style={styles.statGridBox}>
            <Text style={styles.statGridVal}>{stats?.totalDonations ?? stats?.donacionesTotales ?? 0}</Text>
            <Text style={styles.statGridLabel}>Donaciones Realizadas</Text>
          </View>
          <View style={styles.statGridBox}>
            <Text style={styles.statGridVal}>{stats?.livesImpacted ?? stats?.vidasImpactadas ?? 0}</Text>
            <Text style={styles.statGridLabel}>Vidas Salvadas</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statGridBox: {
    flex: 0.48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statGridVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statGridLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  widgetErrorText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  retryText: {
    fontSize: 12,
    color: '#D42040',
    fontWeight: '600',
  },
});
