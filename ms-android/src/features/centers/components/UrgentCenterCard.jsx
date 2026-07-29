import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UrgentCenterCard({ center }) {
  const primaryRequest = center.urgentRequests?.[0];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="pulse" size={18} color="#D42040" />
        </View>
        {primaryRequest ? (
          <View style={styles.urgentPill}>
            <Text style={styles.urgentPillText}>Urgente</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {center.name}
      </Text>

      {primaryRequest ? (
        <View style={styles.bloodRow}>
          <Text style={styles.bloodType}>{primaryRequest.bloodType}</Text>
          <Text style={styles.unitsText}>{primaryRequest.unitsRequired} unidades</Text>
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <Ionicons name="location" size={12} color="#94A3B8" />
        <Text style={styles.distance}>
          {center.distanceKm != null ? `${center.distanceKm} km` : center.zone}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    width: 170,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentPill: {
    backgroundColor: '#D42040',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  urgentPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  bloodRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bloodType: {
    fontSize: 17,
    fontWeight: '800',
    color: '#D42040',
  },
  unitsText: {
    fontSize: 11,
    color: '#64748B',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  distance: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
