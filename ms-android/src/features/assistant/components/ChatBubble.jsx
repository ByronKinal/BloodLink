import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function formatTime(date) {
  if (!date) return '';
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBubble({ msg }) {
  const isUser = msg.sender === 'user';

  return (
    <View style={[styles.wrap, isUser && styles.wrapReversed]}>
      <View style={[styles.row, isUser && styles.rowReversed]}>
        {!isUser ? (
          <View style={styles.avatarCircle}>
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
          </View>
        ) : null}

        <View style={[styles.msgBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={isUser ? styles.userMsgText : styles.botMsgText}>{msg.text}</Text>
        </View>
      </View>
      {msg.createdAt ? (
        <Text style={[styles.timeText, isUser ? styles.timeTextRight : styles.timeTextLeft]}>
          {formatTime(msg.createdAt)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  wrapReversed: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowReversed: {
    justifyContent: 'flex-end',
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  msgBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: 14,
  },
  botBubble: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  userBubble: {
    backgroundColor: '#D42040',
    borderTopRightRadius: 4,
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
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  timeTextLeft: {
    marginLeft: 34,
  },
  timeTextRight: {
    marginRight: 4,
  },
});
