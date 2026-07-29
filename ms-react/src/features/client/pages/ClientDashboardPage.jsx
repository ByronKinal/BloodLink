import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardPlaceholderSection } from '../../../shared/components/dashboard/DashboardPlaceholderSection.jsx'
import { DashboardShell } from '../../../shared/components/dashboard/DashboardShell.jsx'
import { DashboardSidebar } from '../../../shared/components/dashboard/DashboardSidebar.jsx'
import { DashboardTopbar } from '../../../shared/components/dashboard/DashboardTopbar.jsx'
import { clearAuth, getStoredAuth } from '../../../shared/utils/auth.store.js'
import { ClientDashboardHome } from '../components/ClientDashboardHome.jsx'
import { ClientProfileSection } from '../components/ClientProfileSection.jsx'
import { StoreCatalog } from '../../store/components/StoreCatalog.jsx'
import { TriageSection } from '../components/triage/TriageSection.jsx'
import { ClientAppointmentsPanel } from '../components/appointments/ClientAppointmentsPanel.jsx'
import { ClientDonationsSection } from '../components/ClientDonationsSection.jsx'
import { ProfileConfigModal } from '../../../shared/components/dashboard/ProfileConfigModal.jsx'
import {
  ClientIconCalendar,
  ClientIconDrop,
  ClientIconGift,
  ClientIconHome,
  ClientIconPulse,
  ClientIconUser,
} from '../components/ClientDashboardIcons.jsx'
import { AiChatWidget } from '../components/AiChatWidget.jsx'

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: ClientIconHome },
  { id: 'triaje', label: 'Triaje médico', icon: ClientIconPulse },
  { id: 'donaciones', label: 'Mis donaciones', icon: ClientIconDrop },
  { id: 'tienda', label: 'Tienda', icon: ClientIconGift },
  { id: 'citas', label: 'Agendar cita', icon: ClientIconCalendar },
]

export function ClientDashboardPage() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(() => getStoredAuth())
  const user = auth?.user ?? {}
  const [active, setActive] = useState('inicio')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const handleProfileUpdate = () => {
    setAuth(getStoredAuth())
  }

  const displayName = user.name || user.username || 'Donante'
  const initials = ((user.name?.[0] ?? '') + (user.surname?.[0] ?? '')) || displayName[0]?.toUpperCase() || 'D'
  const currentSection = NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Dashboard'

  useEffect(() => {
    const setFromHash = () => {
      try {
        const hash = (window.location.hash || '').replace(/^#/, '')
        if (!hash) return
        const match = NAV_ITEMS.find((i) => i.id === hash)
        if (match) {
          setActive(match.id)
          if (hash === 'citas') setSidebarCollapsed(true)
        }
      } catch (e) {
        // ignore
      }
    }

    setFromHash()
    window.addEventListener('hashchange', setFromHash)
    return () => window.removeEventListener('hashchange', setFromHash)
  }, [])

  return (
    <>
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
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
            sidebarStyle={{ background: '#111018', borderRight: '1px solid rgba(184,28,50,0.15)' }}
            userCardStyle={{ background: 'rgba(212,32,64,0.07)', border: '1px solid rgba(212,32,64,0.14)' }}
            logoutTone="rgba(255,100,100,0.65)"
            onProfileClick={() => setIsConfigOpen(true)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
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
            onProfileClick={() => setIsConfigOpen(true)}
            onMenuToggle={() => setMobileSidebarOpen(true)}
          />
        }
        mainClassName="bg-gris1"
      >
        {active === 'inicio' ? (
          <ClientDashboardHome user={user} onNavigate={setActive} />
        ) : active === 'perfil' ? (
          <ClientProfileSection />
        ) : active === 'tienda' ? (
          <StoreCatalog />
        ) : active === 'triaje' ? (
          <TriageSection />
        ) : active === 'citas' ? (
          <ClientAppointmentsPanel />
        ) : active === 'donaciones' ? (
          <ClientDonationsSection onNavigate={setActive} />
        ) : (
          <DashboardPlaceholderSection
            title={NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Sección'}
            description="Esta sección se activa cuando el módulo correspondiente esté listo."
          />
        )}
      </DashboardShell>

      <ProfileConfigModal
        open={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      <AiChatWidget />
    </>
  )
}
