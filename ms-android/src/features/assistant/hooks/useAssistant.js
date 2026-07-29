import { useState, useCallback } from 'react';
import * as assistantApi from '../api/assistant.api';
import { getErrorMessage } from '../../../shared/utils/apiError';

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
      createdAt: new Date(),
    },
  ]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userText, createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await assistantApi.askQuestion(userText);
      const botText = response?.answer?.trim();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botText || 'El asistente no devolvió una respuesta. Intenta reformular tu pregunta.',
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      console.log('Error in assistant query:', err?.message);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: getErrorMessage(err, 'No se pudo conectar con el asistente. Revisa tu conexión e intenta de nuevo.'),
          createdAt: new Date(),
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
