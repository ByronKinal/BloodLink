import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatInputBar({ input, setInput, onSend, disabled }) {
  return (
    <View style={styles.inputBar}>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu consulta médica..."
        placeholderTextColor="#94A3B8"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={onSend}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.sendBtn, disabled && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={disabled}
      >
        <Ionicons name="send" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  sendBtn: {
    backgroundColor: '#D42040',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
