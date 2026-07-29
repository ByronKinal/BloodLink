import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CenterPickerList({ centers, loading, error, selectedCenterId, onSelectCenter }) {
  if (loading) {
    return <ActivityIndicator size="small" color="#D42040" style={styles.spinner} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!centers.length) {
    return <Text style={styles.emptyText}>No hay centros de donación disponibles.</Text>;
  }

  return (
    <View style={styles.list}>
      {centers.map((center) => {
        const isSelected = center.id === selectedCenterId;
        return (
          <TouchableOpacity
            key={center.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelectCenter(center)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
              <Ionicons name="business" size={20} color={isSelected ? '#FFFFFF' : '#D42040'} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {center.name}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={12} color="#94A3B8" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {center.distanceKm != null ? `${center.distanceKm} km` : center.zone || center.address}
                </Text>
              </View>
            </View>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={22} color="#D42040" />
            ) : (
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  spinner: {
    marginVertical: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  cardSelected: {
    borderColor: '#D42040',
    backgroundColor: '#FFF5F5',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleSelected: {
    backgroundColor: '#D42040',
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  errorText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 12,
  },
});
