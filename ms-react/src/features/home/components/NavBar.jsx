import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../../../shared/components/BrandLogo.jsx'

const NAV_LINKS = [
  { href: '#inicio',     label: 'Inicio' },
  { href: '#como-donar', label: 'Cómo donar' },
  { href: '#inventario', label: 'Inventario' },
  { href: '#contacto',   label: 'Contacto' },
]

export function NavBar() {
  const navigate                     = useNavigate()
  const [scrolled, setScrolled]      = useState(false)
  const [activeSection, setActive]   = useState('#inicio')
  const [mobileOpen, setMobileOpen]  = useState(false)

  useEffect(() => {
    const isAtBottom = () =>
      Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 5

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      if (isAtBottom()) {
        setActive('#contacto')
        return
      }

      let current = NAV_LINKS[0].href
      for (const { href } of NAV_LINKS) {
        const el = document.getElementById(href.slice(1))
        if (el && el.getBoundingClientRect().top <= 80) current = href
      }
      setActive(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollTo = (href) => {
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-16 flex items-center h-[70px] transition-all duration-300 ${
        scrolled
          ? 'bg-carbon/95 backdrop-blur-[12px] border-b border-rojo/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-carbon border-b border-rojo/30'
      }`}>
        <a href="#" className="no-underline mr-auto md:mr-11">
          <BrandLogo />
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-8 flex-1">
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

        {/* Desktop auth buttons */}
        <div className="hidden md:flex gap-[10px] items-center">
          <button
            onClick={() => navigate('/login')}
            className="text-[13px] text-gris2 bg-transparent border border-gris2/20 rounded-lg px-[18px] py-2 cursor-pointer transition-all duration-200 hover:border-rojo hover:text-rojo-v font-outfit"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn-shine-alt relative text-[13px] font-medium text-white bg-gradient-to-br from-rojo-v to-rojo border-none rounded-lg px-[22px] py-[9px] cursor-pointer font-outfit transition-all duration-200 shadow-[0_4px_16px_rgba(184,28,50,0.4)] hover:shadow-[0_6px_22px_rgba(212,32,64,0.55)] hover:-translate-y-px"
          >
            Registrarme →
          </button>
        </div>

        {/* Mobile: compact login + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="text-[12px] text-gris2 bg-transparent border border-gris2/20 rounded-lg px-3 py-[6px] cursor-pointer font-outfit"
          >
            Sesión
          </button>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="flex flex-col justify-center gap-[5px] p-2 bg-transparent border-none cursor-pointer"
            aria-label="Abrir menú"
          >
            <span className={`block w-5 h-[2px] bg-gris2 rounded transition-all duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-gris2 rounded transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-gris2 rounded transition-all duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="fixed top-[70px] left-0 right-0 z-[99] bg-carbon/98 border-b border-rojo/20 backdrop-blur-[12px] md:hidden">
          <div className="flex flex-col py-3">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); handleScrollTo(href) }}
                className={`px-6 py-[14px] text-sm no-underline transition-colors duration-200 border-b border-white/[0.05] last:border-0 ${
                  activeSection === href ? 'text-rojo-v' : 'text-gris3'
                }`}
              >
                {label}
              </a>
            ))}
            <div className="px-6 py-4">
              <button
                onClick={() => { setMobileOpen(false); navigate('/register') }}
                className="w-full text-[13px] font-medium text-white bg-gradient-to-br from-rojo-v to-rojo border-none rounded-lg py-[11px] cursor-pointer font-outfit"
              >
                Registrarme gratis →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
