import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TypingIndicator() {
  return (
    <View style={[styles.msgBubble, styles.botBubble]}>
      <Text style={styles.typingText}>Escribiendo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  msgBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  botBubble: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontStyle: 'italic',
  },
});