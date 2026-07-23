import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EligibilityWidget({ eligibility, hasTriage, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.eligibilityCard, { backgroundColor: eligibility.bg, borderColor: eligibility.color }]}
      onPress={onPress}
    >
      <Ionicons name={eligibility.icon} size={32} color={eligibility.color} />
      <View style={styles.eligibilityInfo}>
        <Text style={[styles.eligibilityTitle, { color: eligibility.color }]}>
          {eligibility.text}
        </Text>
        <Text style={styles.eligibilitySub}>
          {hasTriage ? 'Basado en tu último cuestionario clínico' : 'Toca aquí para completar tu Triage médico'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={eligibility.color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eligibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  eligibilityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eligibilityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  eligibilitySub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
});
