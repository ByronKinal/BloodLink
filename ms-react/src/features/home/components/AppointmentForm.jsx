import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BLOOD_TYPES = [
  'O+ (Positivo)', 'O⁻ (Negativo)',
  'A+ (Positivo)', 'A⁻ (Negativo)',
  'B+ (Positivo)', 'B⁻ (Negativo)',
  'AB+ (Positivo)', 'AB⁻ (Negativo)',
  'No conozco mi tipo',
]

const LOCATIONS = [
  'Sede Central – Ciudad de Guatemala',
  'Sede Norte – Cobán, Alta Verapaz',
  'Sede Sur – Escuintla',
  'Sede Occidente – Quetzaltenango',
]

const TIME_SLOTS = [
  '8:00 am – 9:00 am',
  '9:00 am – 10:00 am',
  '10:00 am – 11:00 am',
  '2:00 pm – 3:00 pm',
  '3:00 pm – 4:00 pm',
]

const INCLUDED_ITEMS = [
  'Evaluación médica gratuita antes de donar',
  'Prueba de hemoglobina sin costo adicional',
  'Refrigerio y tiempo de recuperación incluidos',
  'Certificado de donación para empresa o escuela',
  'Seguimiento de tu impacto por correo',
]

const INITIAL_FORM = {
  fullName:     '',
  email:        '',
  phone:        '',
  bloodType:    '',
  location:     LOCATIONS[0],
  timeSlot:     TIME_SLOTS[0],
  preferredDate:'',
}

const inputClass = 'border border-gris2 rounded-[10px] px-[14px] py-3 text-sm text-txt bg-gris1 outline-none font-outfit transition-all duration-200 focus:border-rojo focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] placeholder:text-gris3'

export function AppointmentForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(INITIAL_FORM)

  const handleFieldChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <section id="agendar" className="fade-up px-4 md:px-16 py-14 md:py-20 bg-blanco">
      <div className="flex items-center gap-[7px] text-[10px] text-rojo font-semibold tracking-[0.12em] uppercase mb-[10px]">
        <span className="inline-block w-6 h-[2px] bg-rojo rounded-sm" />
        Empezá hoy
      </div>
      <h2 className="font-cormorant text-[32px] md:text-[42px] font-medium text-txt leading-[1.15] mb-6 md:mb-8">
        Agenda tu donación
      </h2>

      <div
        className="flex flex-col md:grid gap-8 md:gap-[52px] items-start"
        style={{ gridTemplateColumns: '1fr 360px' }}
      >

        {/* Form card */}
        <div className="bg-blanco rounded-[20px] p-5 md:p-10 border border-gris2">
          <div className="font-cormorant text-[26px] md:text-[28px] font-medium text-txt mb-[6px]">Reservar mi cita</div>
          <p className="text-sm text-txt3 mb-6 md:mb-7 font-light leading-[1.6]">
            Completá el formulario y te confirmamos por correo en menos de 24 horas. Sin costo ni compromiso.
          </p>

          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[14px]">
              <label className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Nombre completo</span>
                <input type="text" placeholder="María García López" value={formData.fullName} onChange={handleFieldChange('fullName')} className={inputClass} required />
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Correo electrónico</span>
                <input type="email" placeholder="maria@correo.com" value={formData.email} onChange={handleFieldChange('email')} className={inputClass} required />
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Teléfono</span>
                <input type="tel" placeholder="+502 5555-0000" value={formData.phone} onChange={handleFieldChange('phone')} className={inputClass} />
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Tipo de sangre</span>
                <select value={formData.bloodType} onChange={handleFieldChange('bloodType')} className={inputClass} style={{ appearance: 'none' }}>
                  <option value="">Seleccionar...</option>
                  {BLOOD_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Sede preferida</span>
                <select value={formData.location} onChange={handleFieldChange('location')} className={inputClass} style={{ appearance: 'none' }}>
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Horario preferido</span>
                <select value={formData.timeSlot} onChange={handleFieldChange('timeSlot')} className={inputClass} style={{ appearance: 'none' }}>
                  {TIME_SLOTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-[6px] mb-[14px]">
              <span className="text-[11px] font-semibold text-txt2 tracking-[0.06em] uppercase">Fecha preferida</span>
              <input type="date" value={formData.preferredDate} onChange={handleFieldChange('preferredDate')} className={inputClass} />
            </label>

            <button
              type="submit"
              className="btn-shine relative bg-gradient-to-br from-rojo-v to-rojo text-white border-none rounded-xl px-8 py-[15px] text-[15px] font-medium cursor-pointer font-outfit flex items-center gap-[10px] w-full justify-center mt-[10px] transition-all duration-300 shadow-[0_6px_24px_rgba(184,28,50,0.35)] hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(184,28,50,0.5)]"
            >
              🩸 Confirmar mi cita de donación
            </button>
          </form>
        </div>

        {/* Aside */}
        <div>
          <div className="bg-carbon2 rounded-2xl p-6 border border-white/[0.07] mb-[14px]">
            <div className="text-[11px] font-semibold text-rojo-v mb-[14px] tracking-[0.08em] uppercase">
              ¿Qué incluye tu visita?
            </div>
            {INCLUDED_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-[10px] mb-[11px] last:mb-0">
                <div className="w-5 h-5 rounded-[6px] bg-rojo/20 flex items-center justify-center flex-shrink-0 text-[11px] text-rojo-v mt-px">
                  ✓
                </div>
                <p className="text-[13px] text-blanco/60 leading-[1.5] font-light">{item}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-[14px] p-[22px] border border-rojo-med/20"
            style={{ background: 'linear-gradient(135deg, #B81C32 0%, #8A0C1E 100%)' }}
          >
            <div className="text-[26px] mb-[10px]">🚨</div>
            <div className="text-sm font-medium text-white mb-[6px]">Emergencias 24 horas</div>
            <p className="text-xs text-rojo-med/80 leading-[1.5] mb-[14px] font-light">
              Si necesitás sangre de forma urgente o querés donar de inmediato, llamanos ahora.
            </p>
            <span className="font-cormorant text-[32px] text-rojo-med block">1500</span>
            <div className="text-[10px] text-rojo-med/50 tracking-[0.06em] uppercase">Línea gratuita nacional</div>
          </div>
        </div>

      </div>
    </section>
  )
}
