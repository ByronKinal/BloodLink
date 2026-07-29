import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ActionButton({ icon, label, subtitle, tone, onPress }) {
  const chevronColor = tone === 'red' ? '#D42040' : '#1E293B';

  return (
    <TouchableOpacity style={[styles.button, styles[`${tone}Button`]]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.chevronBadge}>
        <Ionicons name="chevron-forward" size={16} color={chevronColor} />
      </View>
    </TouchableOpacity>
  );
}

export default function QuickActionsRow({ onSchedule, onSeeCenters }) {
  return (
    <View style={styles.row}>
      <ActionButton
        icon="calendar"
        label="Agendar Donación"
        subtitle="Elige fecha, hora y cambia vidas."
        tone="red"
        onPress={onSchedule}
      />
      <ActionButton
        icon="business"
        label="Ver Centros"
        subtitle="Encuentra centros de donación cerca."
        tone="navy"
        onPress={onSeeCenters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 18,
    padding: 16,
    minHeight: 150,
  },
  redButton: {
    backgroundColor: '#D42040',
  },
  navyButton: {
    backgroundColor: '#1E293B',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    marginTop: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    lineHeight: 16,
  },
  chevronBadge: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
