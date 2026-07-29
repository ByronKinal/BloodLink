import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WalletWidget({ loading, wallet, error, onNavigate, onRetry }) {
  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleRow}>
          <Ionicons name="wallet" size={22} color="#2563EB" />
          <Text style={styles.widgetTitle}> Saldo de Puntos</Text>
        </View>
        <TouchableOpacity onPress={onNavigate}>
          <Text style={styles.widgetActionText}>Ir a Billetera</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 12 }} />
      ) : (
        <View style={styles.walletContent}>
          <Text style={styles.walletPoints}>
            {wallet?.balancePoints ?? 0} <Text style={styles.walletUnit}>BloodPoints</Text>
          </Text>
          {error ? (
            <View style={styles.errorRow}>
              <Text style={styles.widgetErrorText}>({error})</Text>
              {onRetry ? (
                <TouchableOpacity onPress={onRetry}>
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  widgetActionText: {
    fontSize: 13,
    color: '#D42040',
    fontWeight: '600',
  },
  walletContent: {
    paddingVertical: 4,
  },
  walletPoints: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  walletUnit: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'normal',
  },
  widgetErrorText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  retryText: {
    fontSize: 12,
    color: '#D42040',
    fontWeight: '600',
  },
});
