import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PrimaryButton({ label, onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled || loading ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D42040',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
