import React from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssistant } from '../hooks/useAssistant';
import ChatBubble from '../components/ChatBubble';
import ChatInputBar from '../components/ChatInputBar';

export default function AssistantScreen() {
  const { input, setInput, messages, handleSend } = useAssistant();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={24} color="#FFD700" />
          <Text style={styles.headerTitle}> Asistente IA BloodLink</Text>
        </View>
        <Text style={styles.headerSubtitle}>Consultas clínicas y dudas frecuentes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </ScrollView>

      <ChatInputBar input={input} setInput={setInput} onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  chatContent: {
    padding: 16,
  },
});
