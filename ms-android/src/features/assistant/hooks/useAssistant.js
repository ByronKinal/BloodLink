import { useState, useCallback } from 'react';

export function useAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente IA de BloodLink. ¿Tienes dudas sobre requisitos para donar sangre, tiempos de espera o recomendaciones de salud?',
    },
  ]);

  const handleSend = useCallback(() => {
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
  }, [input]);

  return {
    input,
    setInput,
    messages,
    handleSend,
  };
}
