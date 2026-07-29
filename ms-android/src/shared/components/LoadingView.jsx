import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function LoadingView({ message = 'Cargando...', color = '#D42040' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
});