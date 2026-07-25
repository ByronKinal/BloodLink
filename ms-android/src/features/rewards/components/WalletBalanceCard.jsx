import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function WalletBalanceCard({ wallet, loading }) {
  return (
    <View style={styles.cardWallet}>
      <Text style={styles.cardLabel}>Saldo de Puntos BloodPoints</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" style={{ marginVertical: 10 }} />
      ) : (
        <Text style={styles.cardBalance}>
          {wallet?.balancePoints ?? 0} <Text style={styles.ptsText}>pts</Text>
        </Text>
      )}
      <Text style={styles.cardFooter}>Canjeables por beneficios médicos y farmacéuticos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWallet: {
    backgroundColor: '#D42040',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#D42040',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardLabel: {
    color: '#FFCDD2',
    fontSize: 14,
    fontWeight: '600',
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  ptsText: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  cardFooter: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
});
