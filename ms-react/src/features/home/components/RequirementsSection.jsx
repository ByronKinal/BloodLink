const REQUIREMENTS = [
  { icon: '🤝', title: 'Edad',         text: 'Entre 18 y 65 años. Mayores de 65 con autorización médica previa.' },
  { icon: '⚖️', title: 'Peso mínimo',  text: 'Al menos 50 kg para garantizar tu bienestar durante la donación.' },
  { icon: '💪', title: 'Buena salud',  text: 'Sin enfermedades activas ni medicamentos anticoagulantes en las últimas 24h.' },
  { icon: '🩸', title: 'Hemoglobina',  text: 'Mínimo 12.5 g/dL en mujeres y 13.5 g/dL en hombres. Se mide gratis al llegar.' },
  { icon: '📅', title: 'Intervalo mínimo', text: 'Esperar al menos 56 días entre cada donación de sangre entera.' },
  { icon: '🪪', title: 'Identificación',   text: 'Presentar DPI o pasaporte vigente el día de la donación.' },
]

export function RequirementsSection() {
  return (
    <section id="requisitos" className="fade-up px-16 py-20">
      <div className="flex items-center gap-[7px] text-[10px] text-rojo font-semibold tracking-[0.12em] uppercase mb-[10px]">
        <span className="inline-block w-6 h-[2px] bg-rojo rounded-sm" />
        Antes de venir
      </div>
      <h2 className="font-cormorant text-[42px] font-medium text-txt leading-[1.15] mb-3">
        ¿Podés donar?
      </h2>
      <p className="text-[15px] text-txt3 leading-[1.75] max-w-[540px] font-light mb-[52px]">
        Verificá que cumplís con estos requisitos básicos. En caso de duda, nuestro personal
        te orienta sin compromiso.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {REQUIREMENTS.map(({ icon, title, text }) => (
          <div
            key={title}
            className="bg-gris1 rounded-2xl p-6 border border-gris2 flex gap-4 items-start transition-all duration-200 hover:border-rojo hover:bg-blanco hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(184,28,50,0.08)]"
          >
            <div className="w-[46px] h-[46px] rounded-xl bg-carbon flex items-center justify-center text-xl flex-shrink-0">
              {icon}
            </div>
            <div>
              <div className="text-sm font-medium text-txt mb-[5px]">{title}</div>
              <div className="text-[13px] text-txt3 leading-[1.55] font-light">{text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
