const STEPS = [
  {
    number: '1',
    title: 'Regístrate en línea',
    text: 'Crea tu perfil con tu tipo de sangre y datos básicos. Solo toma 2 minutos desde cualquier dispositivo.',
    icon: '🤝',
    badgeStyle: { background: 'linear-gradient(135deg,#D42040,#B81C32)', color: '#fff', boxShadow: '0 6px 18px rgba(184,28,50,0.4)' },
    cardVariant: 'step-card-1',
  },
  {
    number: '2',
    title: 'Agenda tu cita',
    text: 'Elige la sede más cercana y el horario que mejor se adapte a tu rutina diaria.',
    icon: '📅',
    badgeStyle: { background: 'linear-gradient(135deg,#E8B040,#C8942A)', color: '#1C1010', boxShadow: '0 6px 18px rgba(200,148,42,0.4)' },
    cardVariant: 'step-card-2',
  },
  {
    number: '3',
    title: 'Llega preparado',
    text: 'Hidrátate bien, come algo ligero y trae tu DPI. El proceso completo dura unos 45 minutos.',
    icon: '🏥',
    badgeStyle: { background: '#F2EFE8', color: '#1C1010', border: '1px solid #E0DAD0' },
    cardVariant: 'step-card-3',
  },
  {
    number: '4',
    title: 'Salvás hasta 3 vidas',
    text: 'Tu sangre se procesa en componentes para ayudar a múltiples pacientes al mismo tiempo.',
    icon: '❤️',
    badgeStyle: { background: 'linear-gradient(135deg,#D42040,#8A0C1E)', color: '#FFCCD5', boxShadow: '0 6px 18px rgba(184,28,50,0.5)' },
    cardVariant: 'step-card-4',
  },
]

export function HowToDonateSection() {
  return (
    <section id="como-donar" className="fade-up px-4 md:px-16 py-14 md:py-20 bg-blanco">
      <div className="flex items-center gap-[7px] text-[10px] text-rojo font-semibold tracking-[0.12em] uppercase mb-[10px]">
        <span className="inline-block w-6 h-[2px] bg-rojo rounded-sm" />
        El proceso
      </div>
      <h2 className="font-cormorant text-[32px] md:text-[42px] font-medium text-txt leading-[1.15] mb-3">
        Donar es más fácil<br />de lo que imaginas
      </h2>
      <p className="text-[14px] md:text-[15px] text-txt3 leading-[1.75] md:max-w-[540px] font-light mb-9 md:mb-[52px]">
        En menos de una hora completás el proceso completo. Nuestro equipo te guía en cada paso.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[14px] md:gap-[18px]">
        {STEPS.map(({ number, title, text, badgeStyle, cardVariant }) => (
          <div
            key={number}
            className={`step-card ${cardVariant} bg-blanco rounded-2xl p-5 md:p-7 border border-gris2 transition-all duration-200 cursor-default hover:border-transparent hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]`}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-cormorant text-[22px] font-medium mb-4 md:mb-[18px]"
              style={badgeStyle}
            >
              {number}
            </div>
            <div className="text-base font-medium text-txt mb-2">{title}</div>
            <div className="text-[13px] text-txt3 leading-[1.65] font-light">{text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
