import { useState, useCallback } from 'react';
import * as assistantApi from '../api/assistant.api';

/**
 * Hook para la gestión del chatbot asistencial y consultas médicas del donante.
 */
export function useAssistant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente IA de BloodLink. ¿Tienes dudas sobre requisitos para donar sangre, tiempos de espera o recomendaciones de salud?',
    },
  ]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await assistantApi.askQuestion(userText);
      const botText = response?.answer || response?.message || 'Consulta médica procesada correctamente.';

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: botText },
      ]);
    } catch (err) {
      console.log('Error in assistant query:', err?.message);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'No pude procesar tu consulta en este momento. Por favor intenta de nuevo.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  return {
    input,
    setInput,
    messages,
    loading,
    handleSend,
  };
}
