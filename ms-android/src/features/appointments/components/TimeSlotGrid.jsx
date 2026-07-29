import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TimeSlotGrid({ slots, loading, error, selectedTime, onSelectTime }) {
  if (loading) {
    return <ActivityIndicator size="small" color="#D42040" style={styles.spinner} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!slots.length) {
    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="calendar-outline" size={28} color="#CBD5E1" />
        <Text style={styles.emptyText}>Este centro no atiende ese día. Elige otra fecha.</Text>
      </View>
    );
  }

  const hasAnyAvailable = slots.some((slot) => slot.available);

  return (
    <View>
      <View style={styles.grid}>
        {slots.map((slot) => {
          const isSelected = slot.time === selectedTime;
          return (
            <TouchableOpacity
              key={slot.time}
              style={[styles.chip, isSelected && styles.chipSelected, !slot.available && styles.chipDisabled]}
              disabled={!slot.available}
              onPress={() => onSelectTime(slot.time)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                  !slot.available && styles.chipTextDisabled,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!hasAnyAvailable ? (
        <Text style={styles.fullText}>No quedan horarios disponibles ese día en este centro.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(212,32,64,0.3)',
  },
  chipSelected: {
    backgroundColor: '#D42040',
    borderColor: '#D42040',
  },
  chipDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42040',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextDisabled: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  fullText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
  },
});
