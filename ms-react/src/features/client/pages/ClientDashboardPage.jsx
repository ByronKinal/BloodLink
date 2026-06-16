import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardPlaceholderSection } from '../../../shared/components/dashboard/DashboardPlaceholderSection.jsx'
import { DashboardShell } from '../../../shared/components/dashboard/DashboardShell.jsx'
import { DashboardSidebar } from '../../../shared/components/dashboard/DashboardSidebar.jsx'
import { DashboardTopbar } from '../../../shared/components/dashboard/DashboardTopbar.jsx'
import { clearAuth, getStoredAuth } from '../../../shared/utils/auth.store.js'
import { ClientDashboardHome } from '../components/ClientDashboardHome.jsx'
import { ClientProfileSection } from '../components/ClientProfileSection.jsx'
import { StoreCatalog } from '../../store/components/StoreCatalog.jsx'
import {
  ClientIconCalendar,
  ClientIconDrop,
  ClientIconGear,
  ClientIconGift,
  ClientIconHome,
  ClientIconUser,
} from '../components/ClientDashboardIcons.jsx'

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: ClientIconHome },
  { id: 'perfil', label: 'Mi perfil', icon: ClientIconUser },
  { id: 'donaciones', label: 'Mis donaciones', icon: ClientIconDrop },
  { id: 'tienda', label: 'Tienda', icon: ClientIconGift },
  { id: 'citas', label: 'Agendar cita', icon: ClientIconCalendar },
  { id: 'config', label: 'Configuración', icon: ClientIconGear },
]

export function ClientDashboardPage() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(() => getStoredAuth())
  const user = auth?.user ?? {}
  const [active, setActive] = useState('inicio')

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const displayName = user.name || user.username || 'Donante'
  const initials = ((user.name?.[0] ?? '') + (user.surname?.[0] ?? '')) || displayName[0]?.toUpperCase() || 'D'
  const currentSection = NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Dashboard'

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          user={user}
          displayName={displayName}
          initials={initials}
          roleLabel={user.bloodType ? user.bloodType : 'Donante'}
          navItems={NAV_ITEMS}
          activeId={active}
          onNavigate={setActive}
          onLogout={handleLogout}
          sidebarStyle={{ background: '#111018', borderRight: '1px solid rgba(184,28,50,0.15)' }}
          userCardStyle={{ background: 'rgba(212,32,64,0.07)', border: '1px solid rgba(212,32,64,0.14)' }}
          logoutTone="rgba(255,100,100,0.65)"
        />
      }
      topbar={
        <DashboardTopbar
          title={currentSection}
          subtitle="BloodLink · Panel de donante"
          displayName={displayName}
          email={user.email}
          initials={initials}
          profilePicture={user.profilePicture}
        />
      }
      mainClassName="bg-gris1"
    >
      {active === 'inicio' ? (
        <ClientDashboardHome user={user} />
      ) : active === 'perfil' ? (
        <ClientProfileSection />
      ) : active === 'tienda' ? (
        <StoreCatalog />
      ) : (
        <DashboardPlaceholderSection
          title={NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Sección'}
          description="Esta sección se activa cuando el módulo correspondiente esté listo."
        />
      )}
    </DashboardShell>
  )
}
