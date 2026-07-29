import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AssistantWidget({ onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name="sparkles" size={32} color="#B45309" />
      <View style={styles.info}>
        <Text style={styles.title}>Asistente IA</Text>
        <Text style={styles.sub}>Resuelve tus dudas sobre donación de sangre</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B45309" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
    marginBottom: 16,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B45309',
  },
  sub: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 2,
  },
});