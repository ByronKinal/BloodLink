import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AssistantScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente IA de BloodLink. ¿Tienes dudas sobre requisitos para donar sangre, tiempos de espera o recomendaciones de salud?',
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    setTimeout(() => {
      let botResponse = 'Recuerda que debes descansar bien e hidratarte antes de tu donación.';
      const lower = currentInput.toLowerCase();
      if (lower.includes('requisito') || lower.includes('puedo donar')) {
        botResponse = 'Para donar sangre necesitas tener entre 18 y 65 años, pesar más de 50kg y no haber ingerido alcohol en las últimas 24 horas.';
      } else if (lower.includes('tatuaje') || lower.includes('piercing')) {
        botResponse = 'Debes esperar al menos 6 meses tras hacerte un tatuaje o piercing antes de realizar una donación.';
      } else if (lower.includes('tiempo') || lower.includes('espera')) {
        botResponse = 'El tiempo recomendado entre donaciones de sangre total es de 8 semanas (2 meses).';
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: botResponse },
      ]);
    }, 800);
  };

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
          <View
            key={msg.id}
            style={[
              styles.msgBubble,
              msg.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={msg.sender === 'user' ? styles.userMsgText : styles.botMsgText}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu consulta médica..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
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
});
