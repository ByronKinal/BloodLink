import { useState, useRef, useCallback, useEffect } from 'react'
import { useAiAssistantChat } from '../hooks/useAiAssistantChat.js'

/* ─── constantes de layout ─── */
const BTN = 60          // tamaño del botón
const MARGIN = 16       // margen mínimo del borde
const PANEL_W = 400     // ancho del panel
const PANEL_H = 500     // alto del panel (header + mensajes + input)
const DRAG_THRESHOLD = 5 // px antes de considerar que es arrastre

/* ─── íconos ─── */
function IconSparkle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  )
}
function IconClose({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}
function IconDrag() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="19" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="19" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

/* ─── burbujas ─── */
function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        maxWidth: '80%', color: '#fff', fontSize: '13px', lineHeight: '1.55',
        padding: '10px 14px', borderRadius: '16px', borderTopRightRadius: '3px',
        background: 'linear-gradient(135deg, #D42040, #a81830)',
        boxShadow: '0 2px 10px rgba(212,32,64,0.28)',
      }}>
        {text}
      </div>
    </div>
  )
}

function AssistantBubble({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '9px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, marginBottom: '2px',
        background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D42040',
      }}>
        <IconSparkle size={14} />
      </div>
      <div style={{
        maxWidth: '80%', fontSize: '13px', lineHeight: '1.55', color: '#1a1625',
        padding: '10px 14px', borderRadius: '16px', borderTopLeftRadius: '3px',
        background: '#fff', border: '1px solid #EDEAF2', borderLeft: '3px solid rgba(212,32,64,0.38)',
        boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
      }}>
        {text}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 2px' }}>
      {[0, 180, 360].map((delay) => (
        <span key={delay} className="animate-bounce" style={{
          width: '7px', height: '7px', borderRadius: '50%', display: 'block',
          background: delay === 0 ? 'rgba(212,32,64,0.5)' : delay === 180 ? 'rgba(212,32,64,0.75)' : '#D42040',
          animationDelay: `${delay}ms`, animationDuration: '900ms',
        }} />
      ))}
    </div>
  )
}

const CHIPS = [
  '¿Puedo donar si tengo tatuajes?',
  '¿Cuáles son los requisitos de peso?',
  '¿Con qué frecuencia puedo donar?',
]

/* ─── componente principal ─── */
export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth - BTN - MARGIN,
    y: window.innerHeight - BTN - MARGIN,
  }))

  const dragging = useRef(false)
  const didDrag = useRef(false)
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  const { messages, input, setInput, isLoading, bottomRef, sendMessage, handleKeyDown } = useAiAssistantChat()

  /* ── arrastre: listeners globales ── */
  useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      const dx = cx - dragOrigin.current.mx
      const dy = cy - dragOrigin.current.my

      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) didDrag.current = true

      const nx = Math.max(MARGIN, Math.min(window.innerWidth - BTN - MARGIN, dragOrigin.current.px + dx))
      const ny = Math.max(MARGIN, Math.min(window.innerHeight - BTN - MARGIN, dragOrigin.current.py + dy))
      setPos({ x: nx, y: ny })
    }

    function onUp() {
      if (!dragging.current) return
      dragging.current = false
      if (!didDrag.current) setIsOpen((o) => !o)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  const onPointerDown = useCallback((e) => {
    dragging.current = true
    didDrag.current = false
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    dragOrigin.current = { mx: cx, my: cy, px: pos.x, py: pos.y }
    if (!e.touches) e.preventDefault()
  }, [pos])

  /* ── posición del panel relativa al botón ── */
  const panelOnRight = pos.x < window.innerWidth / 2
  let panelLeft = panelOnRight ? pos.x : pos.x + BTN - PANEL_W
  panelLeft = Math.max(MARGIN, Math.min(window.innerWidth - PANEL_W - MARGIN, panelLeft))

  let panelTop = pos.y - PANEL_H - 12
  if (panelTop < MARGIN) panelTop = pos.y + BTN + 12
  panelTop = Math.min(panelTop, window.innerHeight - PANEL_H - MARGIN)

  /* ── textarea auto-resize ── */
  const handleInput = useCallback((e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
  }, [setInput])

  const showChips = messages.length === 1 && !isLoading

  return (
    <>
      <style>{`
        @keyframes ai-ping {
          0%   { transform: scale(1); opacity: 0.7; }
          80%, 100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes ai-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ══ PANEL ══ */}
      <div style={{
        position: 'fixed', zIndex: 9999,
        left: panelLeft, top: panelTop,
        width: PANEL_W, maxWidth: `calc(100vw - ${MARGIN * 2}px)`,
        borderRadius: '20px', overflow: 'hidden',
        border: '1px solid rgba(212,32,64,0.15)',
        boxShadow: '0 16px 56px rgba(0,0,0,0.2), 0 4px 14px rgba(0,0,0,0.1)',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        transformOrigin: panelOnRight ? 'bottom left' : 'bottom right',
      }}>

        {/* header */}
        <div style={{
          background: 'linear-gradient(135deg, #111018 50%, rgba(212,32,64,0.2) 100%)',
          borderBottom: '1px solid rgba(212,32,64,0.15)',
          padding: '15px 16px',
          display: 'flex', alignItems: 'center', gap: '13px',
        }}>
          {/* avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(212,32,64,0.28), rgba(212,32,64,0.07))',
            border: '1px solid rgba(212,32,64,0.3)',
            boxShadow: '0 0 18px rgba(212,32,64,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D42040',
          }}>
            <IconSparkle size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Asistente IA
              </span>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.22)',
                padding: '2px 7px', borderRadius: '999px',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                En línea
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', marginTop: '2px' }}>
              BloodLink AI · Donación de sangre
            </p>
          </div>

          <button onClick={() => setIsOpen(false)} aria-label="Cerrar" style={{
            width: 30, height: 30, borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)', flexShrink: 0, transition: 'background 0.15s',
          }}>
            <IconClose />
          </button>
        </div>

        {/* mensajes */}
        <div style={{
          height: '340px', overflowY: 'auto',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px',
          background: '#F8F7FB',
        }}>
          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <UserBubble key={i} text={msg.text} />
            ) : (
              <div key={i}>
                <AssistantBubble text={msg.text} />
                {i === 0 && showChips && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '12px' }}>
                    {CHIPS.map((chip) => (
                      <button key={chip} type="button" onClick={() => setInput(chip)} style={{
                        fontSize: '11.5px', fontWeight: 500, padding: '6px 12px', borderRadius: '999px',
                        border: '1px solid rgba(212,32,64,0.22)', color: 'rgba(212,32,64,0.78)',
                        background: 'rgba(212,32,64,0.04)', cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '9px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '8px', flexShrink: 0, marginBottom: '2px',
                background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D42040',
              }}>
                <IconSparkle size={14} />
              </div>
              <div style={{
                background: '#fff', border: '1px solid #EDEAF2', borderLeft: '3px solid rgba(212,32,64,0.38)',
                borderRadius: '16px', borderTopLeftRadius: '3px', padding: '10px 14px',
              }}>
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* input */}
        <div style={{
          background: '#fff', borderTop: '1px solid #EDEAF2',
          padding: '12px 14px', display: 'flex', alignItems: 'flex-end', gap: '10px',
        }}>
          <textarea
            rows={1} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta... (Enter para enviar)"
            disabled={isLoading}
            style={{
              flex: 1, resize: 'none', fontSize: '13px', color: '#1a1625',
              background: '#F8F7FB', borderRadius: '12px', padding: '10px 14px',
              minHeight: '42px', maxHeight: '96px', overflowY: 'auto', outline: 'none',
              border: input ? '1.5px solid rgba(212,32,64,0.42)' : '1.5px solid #EDEAF2',
              boxShadow: input ? '0 0 0 3px rgba(212,32,64,0.07)' : 'none',
              transition: 'border-color 0.18s, box-shadow 0.18s', fontFamily: 'inherit',
            }}
          />
          <button onClick={sendMessage} disabled={!input.trim() || isLoading} aria-label="Enviar" style={{
            width: 42, height: 42, borderRadius: '12px', border: 'none', flexShrink: 0,
            cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
            background: input.trim() && !isLoading ? 'linear-gradient(135deg, #D42040, #a81830)' : '#E5E0ED',
            boxShadow: input.trim() && !isLoading ? '0 4px 14px rgba(212,32,64,0.38)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', transition: 'background 0.18s, box-shadow 0.18s',
          }}>
            {isLoading
              ? <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ai-spin 0.7s linear infinite' }} />
              : <IconSend />
            }
          </button>
        </div>
      </div>

      {/* ══ BOTÓN FLOTANTE ══ */}
      <div
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        aria-label={isOpen ? 'Cerrar asistente IA' : 'Abrir asistente IA'}
        role="button"
        tabIndex={0}
        style={{
          position: 'fixed', zIndex: 9999,
          left: pos.x, top: pos.y,
          width: BTN, height: BTN,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D42040, #a81830)',
          boxShadow: isOpen
            ? '0 4px 22px rgba(212,32,64,0.55), 0 0 0 5px rgba(212,32,64,0.15)'
            : '0 4px 22px rgba(212,32,64,0.48), 0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          cursor: dragging.current ? 'grabbing' : 'grab',
          userSelect: 'none', touchAction: 'none',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {/* ícono con rotación */}
        <div style={{ transition: 'transform 0.22s ease', transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)', pointerEvents: 'none' }}>
          {isOpen ? <IconClose size={18} /> : <IconSparkle size={22} />}
        </div>

        {/* anillo de pulso */}
        {!isOpen && (
          <span style={{
            position: 'absolute', inset: '-5px', borderRadius: '50%',
            border: '2px solid rgba(212,32,64,0.38)',
            animation: 'ai-ping 2.6s cubic-bezier(0,0,0.2,1) infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* tooltip "arrastrar" */}
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(17,16,24,0.85)', color: 'rgba(255,255,255,0.75)',
          fontSize: '10px', fontWeight: 500, padding: '4px 8px', borderRadius: '6px',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          opacity: 0, transition: 'opacity 0.15s',
        }}
          className="btn-tooltip"
        >
          <IconDrag /> Arrastrar
        </div>
      </div>

      <style>{`
        @keyframes ai-ping  { 0% { transform:scale(1);opacity:.7; } 80%,100% { transform:scale(1.42);opacity:0; } }
        @keyframes ai-spin  { to { transform:rotate(360deg); } }
        [role="button"]:hover .btn-tooltip { opacity: 1 !important; }
      `}</style>
    </>
  )
}
