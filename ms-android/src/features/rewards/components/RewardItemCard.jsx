import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RewardItemCard({ iconName, iconColor, title, cost, onClaim }) {
  return (
    <View style={styles.rewardCard}>
      <Ionicons name={iconName} size={32} color={iconColor} />
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardTitle}>{title}</Text>
        <Text style={styles.rewardCost}>{cost}</Text>
      </View>
      <TouchableOpacity style={styles.claimButton} onPress={onClaim}>
        <Text style={styles.claimButtonText}>Canjear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rewardCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  rewardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  rewardCost: {
    fontSize: 13,
    color: '#D42040',
    marginTop: 2,
    fontWeight: '600',
  },
  claimButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  claimButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
