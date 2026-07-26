import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ChatBubble({ msg }) {
  const isUser = msg.sender === 'user';

  return (
    <View style={[styles.msgBubble, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={isUser ? styles.userMsgText : styles.botMsgText}>{msg.text}</Text>
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
  userBubble: {
    backgroundColor: '#D42040',
    alignSelf: 'flex-end',
  },
  botMsgText: {
    color: '#1E293B',
    fontSize: 14,
    lineHeight: 20,
  },
  userMsgText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
});
