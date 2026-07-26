import { useState, useRef, useEffect, useCallback } from 'react'
import { askDonationAssistant } from '../../../shared/api/ai.api.js'

const WELCOME_MESSAGE = {
  role: 'assistant',
  text: '¡Hola! Soy tu asistente de donación de sangre. Puedo ayudarte con dudas sobre elegibilidad, requisitos y el proceso de donación. ¿En qué te puedo ayudar?',
}

export function useAiAssistantChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = useCallback(async () => {
    const question = input.trim()
    if (!question || isLoading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setIsLoading(true)

    try {
      const { data } = await askDonationAssistant(question)
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'No se pudo conectar con el asistente. Verifica tu conexión e intenta de nuevo.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  return { messages, input, setInput, isLoading, bottomRef, sendMessage, handleKeyDown }
}
