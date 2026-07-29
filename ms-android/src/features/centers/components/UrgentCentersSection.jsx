import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UrgentCenterCard from './UrgentCenterCard';
import { useDonationCenters } from '../hooks/useDonationCenters';

export default function UrgentCentersSection({ onSeeAll }) {
  const { centers, loading, error } = useDonationCenters({ urgentOnly: true });

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Urgencias Cerca</Text>
        <TouchableOpacity style={styles.seeAllRow} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>Ver todas</Text>
          <Ionicons name="chevron-forward" size={16} color="#D42040" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#D42040" style={{ marginVertical: 12 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : centers.length === 0 ? (
        <Text style={styles.emptyText}>No hay solicitudes urgentes por ahora.</Text>
      ) : (
        <FlatList
          data={centers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UrgentCenterCard center={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    color: '#D42040',
    fontWeight: '600',
  },
  listContent: {
    paddingRight: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
});
