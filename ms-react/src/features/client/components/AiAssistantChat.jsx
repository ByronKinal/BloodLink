import { useCallback } from 'react'
import { useAiAssistantChat } from '../hooks/useAiAssistantChat.js'

function IconSparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-[5px] py-0.5 px-0.5">
      <span className="w-[7px] h-[7px] rounded-full bg-rojo/60 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '900ms' }} />
      <span className="w-[7px] h-[7px] rounded-full bg-rojo/80 animate-bounce" style={{ animationDelay: '180ms', animationDuration: '900ms' }} />
      <span className="w-[7px] h-[7px] rounded-full bg-rojo animate-bounce" style={{ animationDelay: '360ms', animationDuration: '900ms' }} />
    </div>
  )
}

const SUGGESTION_CHIPS = [
  '¿Puedo donar si tengo tatuajes?',
  '¿Cuáles son los requisitos de peso?',
  '¿Con qué frecuencia puedo donar?',
]

function SuggestionChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {SUGGESTION_CHIPS.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="text-[11px] font-medium px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 hover:border-rojo hover:text-rojo"
          style={{ borderColor: 'rgba(212,32,64,0.2)', color: 'rgba(212,32,64,0.7)', background: 'rgba(212,32,64,0.04)' }}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[78%] text-white text-[13px] leading-relaxed px-4 py-2.5 rounded-[16px] rounded-tr-[4px] shadow-sm"
        style={{ background: 'linear-gradient(135deg, #D42040, #a81830)' }}
      >
        {text}
      </div>
    </div>
  )
}

function AssistantBubble({ text }) {
  return (
    <div className="flex justify-start items-end gap-2.5">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center text-rojo mb-0.5 shadow-sm"
        style={{ background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.18)' }}
      >
        <IconSparkle />
      </div>
      <div
        className="max-w-[78%] text-txt text-[13px] leading-relaxed px-4 py-2.5 rounded-[16px] rounded-tl-[4px] shadow-sm"
        style={{
          background: '#fff',
          border: '1px solid #EDEAF2',
          borderLeft: '3px solid rgba(212,32,64,0.35)',
        }}
      >
        {text}
      </div>
    </div>
  )
}

export function AiAssistantChat() {
  const { messages, input, setInput, isLoading, bottomRef, sendMessage, handleKeyDown } = useAiAssistantChat()

  const handleInput = useCallback(
    (e) => {
      setInput(e.target.value)
      e.target.style.height = 'auto'
      e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
    },
    [setInput]
  )

  const handleChipSelect = useCallback(
    (chip) => {
      setInput(chip)
    },
    [setInput]
  )

  const showChips = messages.length === 1 && !isLoading

  return (
    <div className="rounded-[18px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]" style={{ border: '1px solid rgba(212,32,64,0.12)' }}>

      {/* ── Header oscuro ── */}
      <div
        className="px-5 py-4 flex items-center gap-3.5"
        style={{
          background: 'linear-gradient(135deg, #111018 55%, rgba(212,32,64,0.18) 100%)',
          borderBottom: '1px solid rgba(212,32,64,0.14)',
        }}
      >
        {/* Avatar IA */}
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 text-rojo"
          style={{
            background: 'linear-gradient(135deg, rgba(212,32,64,0.25), rgba(212,32,64,0.08))',
            border: '1px solid rgba(212,32,64,0.28)',
            boxShadow: '0 0 16px rgba(212,32,64,0.15)',
          }}
        >
          <IconSparkle />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-white tracking-tight">Asistente IA</span>
            {/* badge en línea */}
            <span
              className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-[3px] rounded-full"
              style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              En línea
            </span>
          </div>
          <p className="text-[11px] mt-[2px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Especializado en donación de sangre
          </p>
        </div>

        {/* chip BloodLink AI */}
        <span
          className="text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ color: 'rgba(212,32,64,0.7)', background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.18)' }}
        >
          BloodLink AI
        </span>
      </div>

      {/* ── Área de mensajes ── */}
      <div
        className="overflow-y-auto px-4 py-5 flex flex-col gap-4"
        style={{ height: '320px', background: '#F8F7FB' }}
      >
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <UserBubble key={i} text={msg.text} />
          ) : (
            <div key={i}>
              <AssistantBubble text={msg.text} />
              {i === 0 && showChips && <SuggestionChips onSelect={handleChipSelect} />}
            </div>
          )
        )}

        {isLoading && (
          <div className="flex justify-start items-end gap-2.5">
            <div
              className="flex-shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center text-rojo mb-0.5"
              style={{ background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.18)' }}
            >
              <IconSparkle />
            </div>
            <div
              className="px-4 py-3 rounded-[16px] rounded-tl-[4px]"
              style={{ background: '#fff', border: '1px solid #EDEAF2', borderLeft: '3px solid rgba(212,32,64,0.35)' }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Barra de entrada ── */}
      <div
        className="px-4 py-3 flex items-end gap-2.5"
        style={{ background: '#fff', borderTop: '1px solid #EDEAF2' }}
      >
        <div className="flex-1 relative">
          <textarea
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta sobre donación... (Enter para enviar)"
            disabled={isLoading}
            className="w-full resize-none text-[13px] text-txt placeholder:text-txt3 focus:outline-none transition-all duration-200 rounded-[12px] px-4 py-2.5 pr-3 overflow-y-auto"
            style={{
              minHeight: '42px',
              maxHeight: '96px',
              background: '#F8F7FB',
              border: input ? '1.5px solid rgba(212,32,64,0.4)' : '1.5px solid #EDEAF2',
              boxShadow: input ? '0 0 0 3px rgba(212,32,64,0.06)' : 'none',
            }}
          />
        </div>

        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          aria-label="Enviar pregunta"
          className="flex-shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
          style={{
            background: input.trim() && !isLoading
              ? 'linear-gradient(135deg, #D42040, #a81830)'
              : '#E5E0ED',
            boxShadow: input.trim() && !isLoading ? '0 4px 14px rgba(212,32,64,0.35)' : 'none',
            cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <IconSend />
          )}
        </button>
      </div>

    </div>
  )
}
