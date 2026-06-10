const FOOTER_LINKS = [
  {
    title: 'Donantes',
    links: ['Cómo donar', 'Requisitos', 'Sedes y horarios', 'Mi historial'],
  },
  {
    title: 'Instituciones',
    links: ['Hospitales aliados', 'Solicitar sangre', 'Inventario en vivo', 'Convenios'],
  },
  {
    title: 'Ayuda',
    links: ['Preguntas frecuentes', '1500 (gratuito)', 'info@hemovida.gob.gt', 'Emergencias 24/7'],
  },
]

const SOCIAL_ICONS = ['👥', '📸', '🐦', '▶️']

export function AppFooter() {
  return (
    <footer id="contacto" className="bg-carbon px-16 pt-14 pb-7 border-t border-rojo/20">
      <div className="grid gap-12 mb-12" style={{ gridTemplateColumns: '1.8fr 1fr 1fr 1fr' }}>

        {/* Brand column */}
        <div>
          <div className="font-cormorant text-2xl text-blanco mb-1">BloodLink</div>
          <div className="text-[10px] text-oro tracking-[0.07em] uppercase mb-[14px]">
            Banco de Sangre Nacional de Guatemala
          </div>
          <p className="text-[13px] text-blanco/35 leading-[1.7] font-light mb-5">
            Conectando donantes con quienes más lo necesitan desde 1998. Una iniciativa del
            Ministerio de Salud Pública y Asistencia Social.
          </p>
          <div className="flex gap-[10px]">
            {SOCIAL_ICONS.map((icon, index) => (
              <a
                key={index}
                href="#"
                className="w-[34px] h-[34px] rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-200 text-[15px] text-blanco/35 no-underline hover:border-rojo hover:text-rojo-v"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map(({ title, links }) => (
          <div key={title}>
            <div className="text-[10px] font-semibold text-rojo-v tracking-[0.1em] uppercase mb-4">{title}</div>
            {links.map((link) => (
              <a
                key={link}
                href="#"
                className="block text-[13px] text-blanco/35 no-underline mb-[10px] transition-colors duration-200 font-light hover:text-blanco"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06] pt-[22px] flex justify-between items-center">
        <div className="text-xs text-blanco/20">
          © 2026 BloodLink — Ministerio de Salud Pública de Guatemala
        </div>
        <div className="flex items-center gap-[7px] bg-rojo/[0.12] border border-rojo/25 rounded-[20px] px-[14px] py-[5px] text-[11px] text-rojo-v">
          🛡️ Sitio oficial del gobierno
        </div>
      </div>
    </footer>
  )
}
