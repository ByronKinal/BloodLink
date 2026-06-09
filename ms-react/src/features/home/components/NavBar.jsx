import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '#inicio',     label: 'Inicio' },
  { href: '#como-donar', label: 'Cómo donar' },
  { href: '#inventario', label: 'Inventario' },
  { href: '#contacto',   label: 'Contacto' },
]

export function NavBar() {
  const [scrolled, setScrolled]     = useState(false)
  const [activeSection, setActive]  = useState('#inicio')

  useEffect(() => {
    const isAtBottom = () =>
      Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 5

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (isAtBottom()) setActive('#contacto')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const isAtBottom = () =>
      Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 5

    const ids = NAV_LINKS.map(({ href }) => href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        if (isAtBottom()) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-60px 0px -40% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleScrollTo = (href) => {
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] px-16 flex items-center h-[70px] transition-all duration-300 ${
      scrolled
        ? 'bg-carbon/95 backdrop-blur-[12px] border-b border-rojo/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
        : 'bg-carbon border-b border-rojo/30'
    }`}>
      <a href="#" className="flex items-center gap-[11px] no-underline mr-11">
        <div className="w-10 h-10 bg-rojo rounded-[10px] flex items-center justify-center text-xl shadow-[0_0_16px_rgba(184,28,50,0.5)]">
          🩸
        </div>
        <div>
          <div className="font-cormorant text-[22px] text-blanco tracking-[0.03em]">HemoVida</div>
          <div className="text-[10px] text-oro tracking-[0.1em] uppercase mt-px">Banco de Sangre</div>
        </div>
      </a>

      <div className="flex gap-8 flex-1">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => { e.preventDefault(); handleScrollTo(href) }}
            className={`text-sm no-underline transition-colors duration-200 hover:text-rojo-v ${
              activeSection === href ? 'text-rojo-v' : 'text-gris3'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="flex gap-[10px] items-center">
        <button className="text-[13px] text-gris2 bg-transparent border border-gris2/20 rounded-lg px-[18px] py-2 cursor-pointer transition-all duration-200 hover:border-rojo hover:text-rojo-v font-outfit">
          Iniciar sesión
        </button>
        <button className="btn-shine-alt relative text-[13px] font-medium text-white bg-gradient-to-br from-rojo-v to-rojo border-none rounded-lg px-[22px] py-[9px] cursor-pointer font-outfit transition-all duration-200 shadow-[0_4px_16px_rgba(184,28,50,0.4)] hover:shadow-[0_6px_22px_rgba(212,32,64,0.55)] hover:-translate-y-px">
          Registrarme →
        </button>
      </div>
    </nav>
  )
}
