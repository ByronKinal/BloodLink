const IMPACT_STATS = [
  { value: '4,180',  label: 'Donaciones este año' },
  { value: '12,540', label: 'Vidas beneficiadas' },
  { value: '23',     label: 'Sedes activas' },
  { value: '98%',    label: 'Donantes satisfechos' },
]

const BLOOD_LEVELS = [
  {
    type: 'O⁻', desc: 'Universal · urgente', sub: 'Compatible con todos los tipos',
    pct: 22,  pctColor: 'text-[#FF6080]', typeColor: 'text-rojo-med', typeBg: 'bg-rojo/30',
    barStyle: { background: 'linear-gradient(90deg,#8A0C1E,#D42040)' },
  },
  {
    type: 'O+', desc: 'Más común',          sub: 'El más solicitado en emergencias',
    pct: 65,  pctColor: 'text-oro-v',       typeColor: 'text-oro-v',  typeBg: 'bg-oro/20',
    barStyle: { background: 'linear-gradient(90deg,#A07020,#E8B040)' },
  },
  {
    type: 'A+', desc: 'Nivel normal',        sub: 'Stock adecuado en todas las sedes',
    pct: 80,  pctColor: 'text-verde-v',     typeColor: 'text-verde-v', typeBg: 'bg-verde/20',
    barStyle: { background: 'linear-gradient(90deg,#1A6B40,#28A060)' },
  },
  {
    type: 'AB+',desc: 'Receptor universal',  sub: 'Puede recibir cualquier tipo',
    pct: 72,  pctColor: 'text-[#4A8ACC]',  typeColor: 'text-[#4A8ACC]', typeBg: 'bg-azul/20',
    barStyle: { background: 'linear-gradient(90deg,#2060A0,#4A8ACC)' },
  },
]

export function InventorySection() {
  return (
    <section id="inventario" className="fade-up px-4 md:px-16 py-14 md:py-20 bg-carbon2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* Left: impact copy + stats */}
        <div>
          <div className="flex items-center gap-[7px] text-[10px] text-rojo-v font-semibold tracking-[0.12em] uppercase mb-[10px]">
            <span className="inline-block w-6 h-[2px] bg-rojo-v rounded-sm" />
            Nuestro impacto
          </div>
          <h2 className="font-cormorant text-[32px] md:text-[42px] font-medium text-blanco leading-[1.15] mb-3">
            Juntos hemos<br />cambiado miles<br />de{' '}
            <em className="text-oro-v italic font-cormorant">historias</em>
          </h2>
          <p className="text-[14px] md:text-[15px] text-blanco/45 leading-[1.75] md:max-w-[540px] font-light mb-8">
            Cada año más guatemaltecos se suman a la red de donantes. Tu decisión de donar hoy
            puede significar la diferencia para alguien esta noche.
          </p>
          <div className="grid grid-cols-2 gap-[14px]">
            {IMPACT_STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/[0.05] rounded-[14px] p-4 md:p-5 border border-white/[0.07] transition-all duration-200 hover:border-rojo/40 hover:bg-rojo/[0.08]"
              >
                <div className="font-cormorant text-[32px] md:text-[38px] text-rojo-v mb-1">{value}</div>
                <div className="text-xs text-blanco/40">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: blood levels */}
        <div>
          <div className="flex items-center gap-[7px] text-[10px] text-rojo-v font-semibold tracking-[0.12em] uppercase mb-5">
            <span className="inline-block w-6 h-[2px] bg-rojo-v rounded-sm" />
            Niveles de inventario
          </div>
          <div className="flex flex-col gap-3">
            {BLOOD_LEVELS.map(({ type, desc, sub, pct, pctColor, typeColor, typeBg, barStyle }) => (
              <div
                key={type}
                className="bg-white/[0.04] rounded-[14px] p-[18px] border border-white/[0.07] flex items-center gap-4 transition-all duration-200 hover:border-rojo/30"
              >
                <div className={`w-12 h-12 rounded-xl ${typeBg} flex items-center justify-center font-cormorant text-[17px] font-medium flex-shrink-0 ${typeColor}`}>
                  {type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blanco mb-0.5">{desc}</div>
                  <div className="text-[11px] text-blanco/35 mb-2 truncate">{sub}</div>
                  <div className="bg-white/[0.08] rounded-[20px] h-[5px]">
                    <div className="h-[5px] rounded-[20px]" style={{ width: `${pct}%`, ...barStyle }} />
                  </div>
                </div>
                <div className={`text-sm font-medium min-w-[36px] text-right ${pctColor}`}>{pct}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
