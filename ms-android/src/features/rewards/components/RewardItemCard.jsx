import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RewardItemCard({ reward, userBalance, isClaiming, onClaim, style }) {
  const outOfStock = reward.stock <= 0;
  const inactive = reward.status === false;
  const insufficientPoints = userBalance < reward.requiredPoints;
  const disabled = outOfStock || inactive || insufficientPoints || isClaiming;

  const helperText = inactive
    ? 'No disponible'
    : outOfStock
    ? 'Sin stock'
    : insufficientPoints
    ? 'Puntos insuficientes'
    : null;

  return (
    <View style={[styles.rewardCard, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name="gift" size={26} color="#D42040" />
      </View>

      <Text style={styles.rewardTitle} numberOfLines={2}>
        {reward.name}
      </Text>
      <Text style={styles.rewardCost}>{reward.requiredPoints} BloodPoints</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}

      <TouchableOpacity
        style={[styles.claimButton, disabled && styles.claimButtonDisabled]}
        onPress={onClaim}
        disabled={disabled}
      >
        {isClaiming ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={[styles.claimButtonText, disabled && styles.claimButtonTextDisabled]}>Reclamar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rewardCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    minHeight: 36,
  },
  rewardCost: {
    fontSize: 13,
    color: '#D42040',
    marginTop: 4,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  claimButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  claimButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  claimButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  claimButtonTextDisabled: {
    color: '#64748B',
  },
});
