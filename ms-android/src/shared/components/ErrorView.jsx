import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
      <Text style={styles.text}>{message || 'Ocurrió un error inesperado.'}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 4,
  },
  text: {
    color: '#C62828',
    fontSize: 14,
    marginVertical: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#D42040',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});