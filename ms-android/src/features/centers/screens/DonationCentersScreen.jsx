import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDonationCenters } from '../hooks/useDonationCenters';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';

function CenterListItem({ center }) {
  const hasUrgent = center.urgentRequests?.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, hasUrgent ? styles.iconCircleUrgent : styles.iconCircleNormal]}>
          <Ionicons name="business" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{center.name}</Text>
          <Text style={styles.address}>{center.address}</Text>
        </View>
        {center.distanceKm != null ? <Text style={styles.distance}>{center.distanceKm} km</Text> : null}
      </View>

      {hasUrgent ? (
        <View style={styles.urgentRow}>
          {center.urgentRequests.map((request) => (
            <View key={request.bloodType} style={styles.urgentBadge}>
              <Text style={styles.urgentBadgeText}>
                {request.bloodType} · {request.unitsRequired}u
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function DonationCentersScreen() {
  const { centers, loading, error, refetch } = useDonationCenters();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centros de Donación</Text>
        <Text style={styles.headerSubtitle}>Encuentra el centro más cercano a ti</Text>
      </View>

      {loading ? (
        <LoadingView message="Cargando centros..." />
      ) : error ? (
        <ErrorView message={error} onRetry={refetch} />
      ) : centers.length === 0 ? (
        <EmptyView icon="business-outline" title="Sin centros disponibles" subtitle="Vuelve a intentarlo más tarde." />
      ) : (
        <FlatList
          data={centers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CenterListItem center={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 20,
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
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleUrgent: {
    backgroundColor: '#D42040',
  },
  iconCircleNormal: {
    backgroundColor: '#1E293B',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  address: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  distance: {
    fontSize: 13,
    color: '#D42040',
    fontWeight: '700',
  },
  urgentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42040',
  },
});
