const BLOOD_CARDS = [
  { type: 'O⁻', label: 'Universal',  pct: 22, color: '#D42040', badgeColor: '#FF6080', badgeBg: 'rgba(212,32,64,0.20)',  badge: 'CRÍTICO' },
  { type: 'O+', label: 'Más común',  pct: 65, color: '#E8B040', badgeColor: '#E8B040', badgeBg: 'rgba(200,148,42,0.20)', badge: 'NORMAL'  },
  { type: 'A+', label: 'Normal',     pct: 80, color: '#28A060', badgeColor: '#28A060', badgeBg: 'rgba(26,107,64,0.20)',  badge: 'ÓPTIMO'  },
  { type: 'AB+',label: 'Receptor',   pct: 58, color: '#4A8ACC', badgeColor: '#4A8ACC', badgeBg: 'rgba(32,96,160,0.20)', badge: 'BUENO'   },
]

const TYPE_BAR = [
  { flex: 22, color: '#D42040' },
  { flex: 65, color: '#C8942A' },
  { flex: 80, color: '#166534' },
  { flex: 38, color: '#B45309' },
  { flex: 72, color: '#0F766E' },
  { flex: 30, color: '#7C3AED' },
  { flex: 18, color: '#D42040', opacity: 0.6 },
  { flex: 58, color: '#4A8ACC' },
]

const DROPS = [
  { w: 14, h: 18, color: 'rgba(212,32,64,0.35)', left: '12%', top: '20%', dur: '9s',  delay: '0s'   },
  { w: 9,  h: 12, color: 'rgba(200,148,42,0.3)', left: '25%', top: '65%', dur: '11s', delay: '1.5s' },
  { w: 18, h: 22, color: 'rgba(184,28,50,0.25)', left: '72%', top: '30%', dur: '10s', delay: '3s'   },
  { w: 11, h: 14, color: 'rgba(212,32,64,0.3)',  left: '85%', top: '70%', dur: '8s',  delay: '4.5s' },
  { w: 7,  h: 9,  color: 'rgba(200,148,42,0.25)',left: '45%', top: '80%', dur: '12s', delay: '2s'   },
  { w: 13, h: 17, color: 'rgba(184,28,50,0.2)',  left: '58%', top: '15%', dur: '9s',  delay: '6s'   },
  { w: 8,  h: 10, color: 'rgba(212,32,64,0.3)',  left: '38%', top: '45%', dur: '14s', delay: '1s'   },
]

const STATS = [
  { value: '4,180',  label: 'donaciones este año', dot: '#D42040' },
  { value: '12,540', label: 'vidas beneficiadas',  dot: '#E8B040' },
  { value: '98%',    label: 'satisfechos',          dot: '#28A060' },
]

const ECG_POINTS = '0,20 80,20 120,20 145,3 165,37 185,20 240,20 340,20 380,20 405,3 425,37 445,20 500,20 600,20 640,20 665,3 685,37 705,20 760,20 860,20 900,20 925,3 945,37 965,20 1020,20 1120,20 1160,20 1185,3 1205,37 1225,20 1280,20 1380,20 1420,20 1445,3 1465,37 1485,20 1540,20 1640,20 1680,20 1705,3 1725,37 1745,20 1800,20 1900,20 1940,20 1965,3 1985,37 2000,20'

export function LoginLeftPanel() {
  return (
    <div
      className="flex-1 relative overflow-hidden hidden lg:flex flex-col justify-between py-11 px-[52px]"
      style={{ background: 'linear-gradient(135deg,#0D0A12 0%,#1A0810 40%,#200A14 70%,#0D0A12 100%)' }}
    >
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 30% 60%, rgba(184,28,50,0.28) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 25%, rgba(200,148,42,0.14) 0%, transparent 45%),
          radial-gradient(ellipse at 60% 85%, rgba(184,28,50,0.12) 0%, transparent 40%)
        `,
      }} />

      {/* Floating drops */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {DROPS.map((d, i) => (
          <div
            key={i}
            className="absolute animate-float-drop"
            style={{
              width: d.w, height: d.h,
              background: d.color,
              left: d.left, top: d.top,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              '--dur': d.dur, '--delay': d.delay,
            }}
          />
        ))}
      </div>

      {/* ECG line */}
      <div className="absolute left-[52px] right-[52px] z-[2] h-10 overflow-hidden opacity-[0.22]" style={{ bottom: '80px' }}>
        <svg className="animate-ecg" width="2000" height="40" viewBox="0 0 2000 40" xmlns="http://www.w3.org/2000/svg">
          <polyline points={ECG_POINTS} stroke="#C8942A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Blood type bar */}
      <div className="absolute left-0 right-0 z-[2] flex h-[3px]" style={{ bottom: '120px' }}>
        {TYPE_BAR.map((seg, i) => (
          <div key={i} style={{ flex: seg.flex, background: seg.color, opacity: seg.opacity ?? 1, height: '100%' }} />
        ))}
      </div>

      {/* Brand */}
      <div className="relative z-[5] flex items-center gap-[13px]">
        <div className="w-[42px] h-[42px] bg-rojo rounded-[11px] flex items-center justify-center text-xl shadow-[0_0_24px_rgba(184,28,50,0.65)]">
          🩸
        </div>
        <div>
          <div className="font-cormorant text-[22px] text-blanco leading-none">HemoVida</div>
          <div className="text-[9px] text-oro tracking-[0.12em] uppercase mt-0.5">Banco de Sangre</div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-[5] flex flex-col gap-8">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-rojo/[0.15] border border-rojo/35 text-[#FFCCD5] rounded-[20px] px-4 py-[6px] text-[11px] tracking-[0.05em] uppercase w-fit">
          <div className="w-[7px] h-[7px] rounded-full bg-rojo-v animate-blink" />
          Sistema Nacional de Donación
        </div>

        {/* Title */}
        <div className="font-cormorant text-[52px] font-medium text-blanco leading-[1.05] tracking-[-0.01em]">
          Cada gota<br />cuenta.<br />
          <em className="text-oro-v italic">Cada vida</em><br />importa.
          <span className="block text-[18px] font-light text-blanco/45 font-outfit tracking-[0.02em] mt-[10px] leading-[1.5]">
            Accedé a tu historial de donaciones<br />y agendá tu próxima cita.
          </span>
        </div>

        {/* Blood cards */}
        <div className="flex gap-[10px]">
          {BLOOD_CARDS.map(({ type, label, pct, color, badge, badgeColor, badgeBg }) => (
            <div
              key={type}
              className="flex-1 relative bg-white/[0.05] border border-white/[0.08] rounded-[14px] p-[14px_16px] overflow-hidden transition-all duration-[250ms] hover:-translate-y-[2px] hover:bg-white/[0.08] cursor-default"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px]" style={{ background: color }} />
              <div className="font-cormorant text-[26px] font-semibold text-blanco leading-none mb-[6px]">{type}</div>
              <div className="text-[10px] text-blanco/35 uppercase tracking-[0.06em] mb-2">{label}</div>
              <div className="h-[3px] bg-white/[0.08] rounded-[20px] overflow-hidden">
                <div className="h-[3px] rounded-[20px]" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="text-[11px] font-bold mt-[5px]" style={{ color }}>{pct}%</div>
              <div className="inline-block text-[8px] font-bold tracking-[0.08em] uppercase px-[7px] py-[2px] rounded-[4px] mt-1" style={{ color: badgeColor, background: badgeBg }}>
                {badge}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-[5] flex bg-white/[0.04] border border-rojo/20 rounded-[14px] px-6 py-[14px]">
        {STATS.map(({ value, label, dot }, i) => (
          <div key={value} className="contents">
            {i > 0 && <div className="w-px h-[34px] bg-white/[0.07] mx-4 self-center" />}
            <div className="flex-1 flex items-center gap-[10px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
              <div>
                <span className="font-cormorant text-[22px] text-blanco block leading-none">{value}</span>
                <span className="text-[10px] text-blanco/35 mt-0.5 block">{label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
