import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function YesNoToggle({ icon, label, value, onChange }) {
  return (
    <View style={styles.block}>
      <View style={styles.labelRow}>
        {icon ? (
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={16} color="#D42040" />
          </View>
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionBtn, value === true && styles.optionBtnActive]}
          onPress={() => onChange(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.optionText, value === true && styles.optionTextActive]}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, value === false && styles.optionBtnActive]}
          onPress={() => onChange(false)}
          activeOpacity={0.8}
        >
          <Text style={[styles.optionText, value === false && styles.optionTextActive]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226,232,240,0.8)',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 19,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  optionBtnActive: {
    backgroundColor: '#D42040',
    borderColor: '#D42040',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
