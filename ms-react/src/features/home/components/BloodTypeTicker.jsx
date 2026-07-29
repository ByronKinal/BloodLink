import { useRef, useEffect } from 'react'

const BLOOD_TYPES = [
  {
    type: 'O⁻',
    label: 'Universal',
    badge: 'CRÍTICO',
    pct: 22,
    badgeStyle: { background: 'rgba(212,32,64,0.18)', color: '#FF6080', border: '1px solid rgba(212,32,64,0.3)' },
    typeStyle:  { color: '#F5C0C8', background: 'rgba(184,28,50,0.25)', border: '1px solid rgba(184,28,50,0.4)' },
    barStyle:   { background: 'linear-gradient(90deg,#8A0C1E,#D42040)' },
    pctColor:   '#FF6080',
    lineColor:  '#D42040',
  },
  {
    type: 'O+',
    label: 'Más común',
    badge: 'NORMAL',
    pct: 65,
    badgeStyle: { background: 'rgba(200,148,42,0.15)', color: '#E8B040', border: '1px solid rgba(200,148,42,0.3)' },
    typeStyle:  { color: '#E8B040', background: 'rgba(200,148,42,0.2)', border: '1px solid rgba(200,148,42,0.35)' },
    barStyle:   { background: 'linear-gradient(90deg,#A07020,#E8B040)' },
    pctColor:   '#E8B040',
    lineColor:  '#E8B040',
  },
  {
    type: 'A+',
    label: 'Normal',
    badge: 'ÓPTIMO',
    pct: 80,
    badgeStyle: { background: 'rgba(40,160,96,0.15)', color: '#28A060', border: '1px solid rgba(40,160,96,0.3)' },
    typeStyle:  { color: '#28A060', background: 'rgba(40,160,96,0.2)', border: '1px solid rgba(40,160,96,0.3)' },
    barStyle:   { background: 'linear-gradient(90deg,#1A6B40,#28A060)' },
    pctColor:   '#28A060',
    lineColor:  '#28A060',
  },
  {
    type: 'A⁻',
    label: 'Escaso',
    badge: 'BAJO',
    pct: 35,
    badgeStyle: { background: 'rgba(212,32,64,0.12)', color: '#FF9080', border: '1px solid rgba(212,32,64,0.2)' },
    typeStyle:  { color: '#FF9080', background: 'rgba(184,28,50,0.18)', border: '1px solid rgba(184,28,50,0.28)' },
    barStyle:   { background: 'linear-gradient(90deg,#B83010,#FF6040)' },
    pctColor:   '#FF9080',
    lineColor:  '#FF6040',
  },
  {
    type: 'B+',
    label: 'Receptor',
    badge: 'BUENO',
    pct: 58,
    badgeStyle: { background: 'rgba(74,138,204,0.15)', color: '#4A8ACC', border: '1px solid rgba(74,138,204,0.3)' },
    typeStyle:  { color: '#4A8ACC', background: 'rgba(32,96,160,0.2)', border: '1px solid rgba(32,96,160,0.35)' },
    barStyle:   { background: 'linear-gradient(90deg,#2060A0,#4A8ACC)' },
    pctColor:   '#4A8ACC',
    lineColor:  '#4A8ACC',
  },
  {
    type: 'B⁻',
    label: 'Raro',
    badge: 'CRÍTICO',
    pct: 18,
    badgeStyle: { background: 'rgba(212,32,64,0.18)', color: '#FF6080', border: '1px solid rgba(212,32,64,0.3)' },
    typeStyle:  { color: '#F5C0C8', background: 'rgba(184,28,50,0.22)', border: '1px solid rgba(184,28,50,0.38)' },
    barStyle:   { background: 'linear-gradient(90deg,#8A0C1E,#D42040)' },
    pctColor:   '#FF6080',
    lineColor:  '#D42040',
  },
  {
    type: 'AB+',
    label: 'Receptor univ.',
    badge: 'BUENO',
    pct: 72,
    badgeStyle: { background: 'rgba(74,138,204,0.15)', color: '#4A8ACC', border: '1px solid rgba(74,138,204,0.3)' },
    typeStyle:  { color: '#4A8ACC', background: 'rgba(32,96,160,0.2)', border: '1px solid rgba(32,96,160,0.35)' },
    barStyle:   { background: 'linear-gradient(90deg,#2060A0,#4A8ACC)' },
    pctColor:   '#4A8ACC',
    lineColor:  '#4A8ACC',
  },
  {
    type: 'AB⁻',
    label: 'Muy raro',
    badge: 'BAJO',
    pct: 12,
    badgeStyle: { background: 'rgba(212,32,64,0.12)', color: '#FF9080', border: '1px solid rgba(212,32,64,0.2)' },
    typeStyle:  { color: '#FF9080', background: 'rgba(184,28,50,0.18)', border: '1px solid rgba(184,28,50,0.28)' },
    barStyle:   { background: 'linear-gradient(90deg,#B83010,#FF6040)' },
    pctColor:   '#FF9080',
    lineColor:  '#FF6040',
  },
]

function BloodCard({ type, label, badge, pct, badgeStyle, typeStyle, barStyle, pctColor, lineColor }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: '220px',
        borderRadius: '16px',
        padding: '20px',
        margin: '0 10px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${lineColor}30`,
        boxShadow: `0 0 20px ${lineColor}10`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div
          style={{
            width: '46px', height: '46px', borderRadius: '11px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 600, fontFamily: "'Cormorant Garamond', serif",
            flexShrink: 0,
            ...typeStyle,
          }}
        >
          {type}
        </div>
        <span
          style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
            padding: '3px 8px', borderRadius: '9999px',
            ...badgeStyle,
          }}
        >
          {badge}
        </span>
      </div>

      <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>

      <div style={{ height: '5px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', marginBottom: '8px' }}>
        <div style={{ height: '5px', borderRadius: '9999px', width: `${pct}%`, ...barStyle }} />
      </div>

      <p style={{ fontSize: '22px', fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1, color: pctColor }}>
        {pct}%
      </p>
    </div>
  )
}

const DOUBLED = [...BLOOD_TYPES, ...BLOOD_TYPES]

// card width 220px + margin 10px each side = 240px per card
const ONE_SET_WIDTH = BLOOD_TYPES.length * 240

export function BloodTypeTicker() {
  const trackRef = useRef(null)
  const rafRef   = useRef(null)
  const posRef   = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const speed = 0.6 // px per frame

    function step() {
      posRef.current -= speed
      if (posRef.current <= -ONE_SET_WIDTH) {
        posRef.current = 0
      }
      track.style.transform = `translateX(${posRef.current}px)`
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      style={{
        background: '#111018',
        borderTop: '1px solid rgba(184,28,50,0.15)',
        borderBottom: '1px solid rgba(184,28,50,0.15)',
        padding: '32px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '9px', fontWeight: 700, color: '#D42040',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '0 64px', marginBottom: '20px',
        }}
      >
        <span style={{ display: 'inline-block', width: '20px', height: '2px', background: '#D42040', borderRadius: '2px' }} />
        Stock en tiempo real · todos los tipos
      </div>

      <div
        ref={trackRef}
        style={{ display: 'flex', width: 'max-content' }}
      >
        {DOUBLED.map((item, i) => (
          <BloodCard key={i} {...item} />
        ))}
      </div>
    </div>
  )
}
