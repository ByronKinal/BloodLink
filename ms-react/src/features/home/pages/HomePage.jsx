import { useEffect } from 'react'
import { NavBar }               from '../components/NavBar.jsx'
import { HeroSection }          from '../components/HeroSection.jsx'
import { HowToDonateSection }   from '../components/HowToDonateSection.jsx'
import { RequirementsSection }  from '../components/RequirementsSection.jsx'
import { InventorySection }     from '../components/InventorySection.jsx'
import { AppointmentForm }      from '../components/AppointmentForm.jsx'
import { AppFooter }            from '../components/AppFooter.jsx'

export function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      }),
      { threshold: 0.1 },
    )

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <HowToDonateSection />
      <RequirementsSection />
      <InventorySection />
      <AppointmentForm />
      <AppFooter />
    </div>
  )
}
