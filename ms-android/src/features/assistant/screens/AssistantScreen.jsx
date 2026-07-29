import React, { useRef } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssistant } from '../hooks/useAssistant';
import ChatBubble from '../components/ChatBubble';
import ChatInputBar from '../components/ChatInputBar';
import TypingIndicator from '../components/TypingIndicator';
import NotificationBell from '../../notifications/components/NotificationBell';

export default function AssistantScreen({ navigation }) {
  const { input, setInput, messages, loading, handleSend } = useAssistant();
  const scrollRef = useRef(null);

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_triage_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Asistente IA</Text>
              <Text style={styles.headerSubtitle}>Consultas clínicas y dudas frecuentes</Text>
            </View>
          </View>
          <NotificationBell dark onPress={() => navigation?.navigate('Notifications')} />
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} msg={msg} />
          ))}
          {loading ? <TypingIndicator /> : null}
        </ScrollView>

        <ChatInputBar input={input} setInput={setInput} onSend={handleSend} disabled={loading} />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#D42040',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTextWrap: {
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  chatContent: {
    padding: 16,
  },
});
