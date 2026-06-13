import edadImg          from '../../../assets/img/edad-banco-de-sangre.png'
import pesoImg          from '../../../assets/img/peso-minimo-banco-de-sangre.png'
import saludImg         from '../../../assets/img/buena-salud-banco-de-sangre.png'
import hemoglobinaImg   from '../../../assets/img/hemoglobina-banco-de-sangre.png'
import intervaloImg     from '../../../assets/img/intervalo-minimo-banco-de-sangre.png'
import identificacionImg from '../../../assets/img/identificacion-banco-de-sangre.png'

const REQUIREMENTS = [
  { img: edadImg,           alt: 'Edad requerida para donar sangre' },
  { img: pesoImg,           alt: 'Peso mínimo para donar sangre' },
  { img: saludImg,          alt: 'Buena salud para donar sangre' },
  { img: hemoglobinaImg,    alt: 'Nivel de hemoglobina requerido' },
  { img: intervaloImg,      alt: 'Intervalo mínimo entre donaciones' },
  { img: identificacionImg, alt: 'Identificación requerida para donar' },
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
        {REQUIREMENTS.map(({ img, alt }) => (
          <div
            key={alt}
            className="overflow-hidden rounded-2xl border border-gris2 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(184,28,50,0.12)] hover:border-rojo"
          >
            <img
              src={img}
              alt={alt}
              className="w-full h-auto block"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
