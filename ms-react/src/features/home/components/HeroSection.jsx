import { HeroBg } from './HeroBg.jsx'

const INVENTORY_STATS = [
  { value: '348',  label: 'Donaciones este mes', color: 'text-blanco' },
  { value: '94%',  label: 'Cobertura nacional',  color: 'text-oro-v' },
  { value: '8',    label: 'Tipos en stock',       color: 'text-blanco' },
]

const BLOOD_BARS = [
  { type: 'O⁻', status: 'Crítico',  pct: 22, pctColor: 'text-[#FF6080]', barStyle: { background: 'linear-gradient(90deg,#8A0C1E,#D42040)' } },
  { type: 'A+', status: 'Normal',   pct: 68, pctColor: 'text-oro',        barStyle: { background: 'linear-gradient(90deg,#A07020,#E8B040)' } },
  { type: 'B+', status: 'Óptimo',   pct: 85, pctColor: 'text-verde-v',    barStyle: { background: 'linear-gradient(90deg,#1A6B40,#28A060)' } },
  { type: 'AB+',status: 'Bueno',    pct: 72, pctColor: 'text-oro',        barStyle: { background: 'linear-gradient(90deg,#A07020,#E8B040)' } },
]

const HERO_NUMBERS = [
  { value: '4,180',  label: 'Donaciones este año' },
  { value: '12,540', label: 'Vidas beneficiadas' },
  { value: '23',     label: 'Sedes en el país' },
]

export function HeroSection() {
  const handleScrollToForm = () => {
    document.querySelector('#agendar')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScrollToSteps = () => {
    document.querySelector('#como-donar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="px-16 pt-[100px] pb-[130px] grid gap-[72px] items-center relative overflow-hidden min-h-[820px]"
      style={{
        gridTemplateColumns: '1fr 480px',
        background: 'linear-gradient(90deg, #3A1020 0%, #3A1020 55%, #7A1830 68%, #B84058 80%, #D08090 92%, #E0B0B8 100%)',
      }}
    >
      {/* SVG illustrated background */}
      <HeroBg />

      {/* Gradient overlay for text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.46) 46%, rgba(0,0,0,0.15) 58%, rgba(0,0,0,0) 65%)' }}
      />

      {/* — Left: copy — */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-rojo/[0.18] border border-rojo/40 text-rojo-med rounded-[20px] px-4 py-[6px] text-[11px] font-medium tracking-[0.06em] uppercase mb-6">
          <div className="w-[6px] h-[6px] rounded-full bg-rojo-v animate-blink" />
          Sistema Nacional de Donación de Sangre
        </div>

        <h1 className="font-cormorant text-[62px] font-medium text-blanco leading-[1.08] mb-[22px] tracking-[-0.01em]">
          Una gota tuya<br />cambia <em className="text-oro-v italic">tres vidas</em>
        </h1>

        <p className="text-base text-blanco/60 leading-[1.75] mb-9 max-w-[500px] font-light">
          Donar sangre es un acto seguro, voluntario y completamente gratuito. En BloodLink
          conectamos donantes con quienes más lo necesitan en todo el país.
        </p>

        <div className="flex gap-[14px] flex-wrap">
          <button
            onClick={handleScrollToForm}
            className="btn-shine relative bg-gradient-to-br from-rojo-v to-rojo text-white border-none rounded-xl px-[30px] py-[15px] text-[15px] font-medium cursor-pointer font-outfit inline-flex items-center gap-[9px] transition-all duration-200 shadow-[0_6px_24px_rgba(184,28,50,0.45)] hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(212,32,64,0.55)]"
          >
            🩸 Agendar mi donación
          </button>
          <button
            onClick={handleScrollToSteps}
            className="bg-transparent text-blanco/85 border border-blanco/20 rounded-xl px-[30px] py-[15px] text-[15px] font-normal cursor-pointer font-outfit inline-flex items-center gap-[9px] transition-all duration-200 hover:border-oro hover:text-oro"
          >
            ¿Cómo funciona? →
          </button>
        </div>

        <div className="flex gap-11 mt-[46px] pt-9 border-t border-rojo/20">
          {HERO_NUMBERS.map(({ value, label }) => (
            <div key={label}>
              <span className="font-cormorant text-[36px] text-oro-v block leading-none">{value}</span>
              <div className="text-xs text-blanco/45 mt-1 tracking-[0.02em]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* — Right: inventory card — */}
      <div className="relative z-10 bg-carbon/85 rounded-[20px] p-7 border border-rojo/25 backdrop-blur-[12px] shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(184,28,50,0.1)]">
        {/* Card header */}
        <div className="flex items-center gap-3 mb-[22px]">
          <div className="w-12 h-12 bg-rojo rounded-xl flex items-center justify-center text-[22px] shadow-[0_0_20px_rgba(184,28,50,0.5)] flex-shrink-0">
            🩸
          </div>
          <div>
            <div className="text-[15px] font-medium text-blanco">Inventario nacional</div>
            <div className="text-[11px] text-blanco/40 mt-0.5">Actualizado hace 2 horas</div>
          </div>
          <div className="ml-auto flex items-center gap-[5px] bg-rojo/25 border border-rojo/50 text-rojo-med rounded-[20px] px-[11px] py-1 text-[11px]">
            <div className="w-[5px] h-[5px] rounded-full bg-rojo-med animate-blink-fast" />
            En vivo
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-[10px] mb-5">
          {INVENTORY_STATS.map(({ value, label, color }) => (
            <div key={label} className="bg-white/[0.04] rounded-xl p-[14px] border border-white/[0.06]">
              <div className={`font-cormorant text-[28px] ${color}`}>{value}</div>
              <div className="text-[10px] text-blanco/40 mt-[3px] leading-[1.4]">{label}</div>
            </div>
          ))}
        </div>

        {/* Blood type progress bars */}
        <div className="flex flex-col gap-[11px]">
          {BLOOD_BARS.map(({ type, status, pct, pctColor, barStyle }) => (
            <div key={type}>
              <div className="flex justify-between mb-[5px]">
                <span className="text-[11px] text-blanco/45">{type} · {status}</span>
                <span className={`text-[11px] font-medium ${pctColor}`}>{pct}%</span>
              </div>
              <div className="bg-white/[0.08] rounded-[20px] h-[5px]">
                <div
                  className="h-[5px] rounded-[20px]"
                  style={{ width: `${pct}%`, ...barStyle }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
