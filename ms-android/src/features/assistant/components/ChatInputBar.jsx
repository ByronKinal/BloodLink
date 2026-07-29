import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatInputBar({ input, setInput, onSend, disabled }) {
  const canSend = !disabled && input.trim().length > 0;

  return (
    <View style={styles.inputBar}>
      <View style={styles.inputWrap}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Escribe tu consulta médica..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={onSend}
          editable={!disabled}
          multiline
        />
      </View>
      <TouchableOpacity
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.85}
      >
        <Ionicons name="send" size={19} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    elevation: 2,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 14,
    color: '#1E293B',
  },
  sendBtn: {
    backgroundColor: '#D42040',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 3,
    shadowColor: '#D42040',
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
    shadowOpacity: 0,
  },
});
