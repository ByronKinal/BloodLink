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
      <View style={[styles.statBox, styles.statBoxDonations]}>
        <View style={[styles.statIconWrap, styles.statIconWrapRed]}>
          <Ionicons name="heart" size={24} color="#D42040" />
        </View>
        <Text style={styles.statNumber}>{totalDonations}</Text>
        <Text style={styles.statLabel}>Donaciones</Text>
      </View>
      <View style={[styles.statBox, styles.statBoxBlood]}>
        <View style={[styles.statIconWrap, styles.statIconWrapBlue]}>
          <Ionicons name="water" size={24} color="#2563EB" />
        </View>
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
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderTopWidth: 3,
    padding: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statBoxDonations: {
    borderTopColor: '#D42040',
  },
  statBoxBlood: {
    borderTopColor: '#2563EB',
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIconWrapRed: {
    backgroundColor: '#FFEBEE',
  },
  statIconWrapBlue: {
    backgroundColor: '#DBEAFE',
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
