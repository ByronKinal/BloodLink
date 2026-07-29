import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileStatsSection({ loading, totalDonations, totalLitersDonated }) {
  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#D42040" />
      </View>
    );
  }

  return (
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Ionicons name="heart" size={28} color="#D42040" />
        <Text style={styles.statNumber}>{totalDonations}</Text>
        <Text style={styles.statLabel}>Donaciones</Text>
      </View>
      <View style={styles.statBox}>
        <Ionicons name="water" size={28} color="#2563EB" />
        <Text style={styles.statNumber}>{totalLitersDonated} L</Text>
        <Text style={styles.statLabel}>Sangre Donada</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    padding: 20,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 0.48,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
});
