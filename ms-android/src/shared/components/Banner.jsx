import { StyleSheet, Text } from 'react-native';

export default function Banner({ message, tone = 'error' }) {
  if (!message) return null;

  return <Text style={[styles.text, tone === 'success' ? styles.success : styles.error]}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  error: {
    color: '#D42040',
  },
  success: {
    color: '#28A060',
  },
});
