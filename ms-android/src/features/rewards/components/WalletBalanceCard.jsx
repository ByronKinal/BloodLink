import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WalletBalanceCard({ wallet, loading }) {
  return (
    <LinearGradient colors={['#EF233C', '#9F1239']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardWallet}>
      <Ionicons name="water" size={150} color="rgba(255,255,255,0.12)" style={styles.watermark} />

      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet" size={22} color="#FFFFFF" />
        </View>
        <Text style={styles.cardLabel}>Saldo BloodPoints</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#FFF" style={{ marginVertical: 14 }} />
      ) : (
        <Text style={styles.cardBalance}>
          {wallet?.balancePoints ?? 0} <Text style={styles.ptsText}>pts</Text>
        </Text>
      )}

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <Ionicons name="medkit-outline" size={14} color="rgba(255,255,255,0.85)" />
        <Text style={styles.cardFooter}>Canjeables por beneficios médicos y farmacéuticos</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cardWallet: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 6,
    shadowColor: '#D42040',
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  watermark: {
    position: 'absolute',
    top: -10,
    right: -30,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    color: '#FFE4E8',
    fontSize: 14,
    fontWeight: '600',
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    marginVertical: 10,
  },
  ptsText: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardFooter: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    flexShrink: 1,
  },
});
