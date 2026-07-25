import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TONES = {
  success: { bg: '#DCFCE7', accent: '#16A34A' },
  warning: { bg: '#FEF3C7', accent: '#D97706' },
};

export default function StatusCard({
  tone = 'warning',
  icon,
  title,
  message,
  actionLabel,
  onAction,
  actionDisabled,
}) {
  const { bg, accent } = TONES[tone] || TONES.warning;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={64} color={accent} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {actionLabel ? (
        <TouchableOpacity
          style={[styles.actionBtn, actionDisabled && styles.actionBtnDisabled]}
          onPress={onAction}
          disabled={actionDisabled}
        >
          <Text style={[styles.actionBtnText, actionDisabled && styles.actionBtnTextDisabled]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  message: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  actionBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionBtnTextDisabled: {
    color: '#64748B',
  },
});
