import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RewardItemCard({ reward, userBalance, isClaiming, onClaim, style }) {
  const outOfStock = reward.stock <= 0;
  const inactive = reward.status === false;
  const insufficientPoints = userBalance < reward.requiredPoints;
  const disabled = outOfStock || inactive || insufficientPoints || isClaiming;

  const statusText = inactive
    ? 'No disponible'
    : outOfStock
    ? 'Sin stock'
    : insufficientPoints
    ? 'Puntos insuficientes'
    : 'Stock disponible';

  return (
    <View style={[styles.rewardCard, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name="gift" size={22} color="#D42040" />
      </View>

      <View style={styles.info}>
        <Text style={styles.rewardTitle} numberOfLines={1}>
          {reward.name}
        </Text>
        <View style={styles.costRow}>
          <Ionicons name="water" size={12} color="#D42040" />
          <Text style={styles.rewardCost}>{reward.requiredPoints} BloodPoints</Text>
        </View>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <TouchableOpacity
        style={[styles.claimButton, disabled && styles.claimButtonDisabled]}
        onPress={onClaim}
        disabled={disabled}
        activeOpacity={0.85}
      >
        {isClaiming ? (
          <ActivityIndicator size="small" color={disabled ? '#94A3B8' : '#D42040'} />
        ) : (
          <>
            <Ionicons
              name="checkmark-circle-outline"
              size={15}
              color={disabled ? '#94A3B8' : '#D42040'}
            />
            <Text style={[styles.claimButtonText, disabled && styles.claimButtonTextDisabled]}>Reclamar</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 1,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rewardCost: {
    fontSize: 13,
    color: '#D42040',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(212,32,64,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,32,64,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  claimButtonDisabled: {
    backgroundColor: 'rgba(241,245,249,0.7)',
    borderColor: '#E2E8F0',
  },
  claimButtonText: {
    color: '#D42040',
    fontSize: 13,
    fontWeight: '700',
  },
  claimButtonTextDisabled: {
    color: '#94A3B8',
  },
});
