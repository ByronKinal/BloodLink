import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardPlaceholderSection } from '../../../shared/components/dashboard/DashboardPlaceholderSection.jsx'
import { DashboardShell } from '../../../shared/components/dashboard/DashboardShell.jsx'
import { DashboardSidebar } from '../../../shared/components/dashboard/DashboardSidebar.jsx'
import { DashboardTopbar } from '../../../shared/components/dashboard/DashboardTopbar.jsx'
import { clearAuth, getStoredAuth } from '../../../shared/utils/auth.store.js'
import { EmployeeDashboardHome } from '../components/EmployeeDashboardHome.jsx'
import { TriageReviewPanel } from '../components/triage/TriageReviewPanel.jsx'
import { StaffAgendaPanel } from '../components/appointments/StaffAgendaPanel.jsx'
import { EmployeeInventorySection } from '../components/EmployeeInventorySection.jsx'
import { ProfileConfigModal } from '../../../shared/components/dashboard/ProfileConfigModal.jsx'
import {
  EmployeeIconHome,
  EmployeeIconDrop,
  EmployeeIconClipboard,
  EmployeeIconCalendar,
  EmployeeIconPulse,
  EmployeeIconUser,
} from '../components/EmployeeDashboardIcons.jsx'

const NAV_ITEMS = [
  { id: 'inicio',      label: 'Inicio',           icon: EmployeeIconHome },
  { id: 'triaje',      label: 'Revisión de triaje', icon: EmployeeIconPulse },
  { id: 'donaciones',  label: 'Donaciones',        icon: EmployeeIconDrop },
  { id: 'inventario',  label: 'Inventario',        icon: EmployeeIconClipboard },
  { id: 'citas',       label: 'Citas',             icon: EmployeeIconCalendar },
  { id: 'perfil',      label: 'Mi perfil',         icon: EmployeeIconUser },
]

export function EmployeeDashboardPage() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(() => getStoredAuth())
  const user = auth?.user ?? {}
  const [active, setActive] = useState('inicio')
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const handleProfileUpdate = () => {
    setAuth(getStoredAuth())
  }

  const displayName = user.name || user.username || 'Empleado'
  const initials = ((user.name?.[0] ?? '') + (user.surname?.[0] ?? '')) || displayName[0]?.toUpperCase() || 'E'
  const currentSection = NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Dashboard'

  return (
    <>
      <DashboardShell
        sidebar={
          <DashboardSidebar
            user={user}
            displayName={displayName}
            initials={initials}
            roleLabel="Empleado"
            navItems={NAV_ITEMS}
            activeId={active}
            onNavigate={setActive}
            onLogout={handleLogout}
            sidebarStyle={{ background: '#111018', borderRight: '1px solid rgba(32,96,160,0.15)' }}
            userCardStyle={{ background: 'rgba(32,96,160,0.07)', border: '1px solid rgba(32,96,160,0.14)' }}
            logoutTone="rgba(100,140,255,0.65)"
            onProfileClick={() => setIsConfigOpen(true)}
          />
        }
        topbar={
          <DashboardTopbar
            title={currentSection}
            subtitle="BloodLink · Panel de empleado"
            displayName={displayName}
            email={user.email}
            initials={initials}
            profilePicture={user.profilePicture}
            onProfileClick={() => setIsConfigOpen(true)}
          />
        }
        mainClassName="bg-gris1"
      >
        {active === 'inicio' ? (
          <EmployeeDashboardHome user={user} onNavigate={setActive} />
        ) : active === 'triaje' ? (
          <TriageReviewPanel />
        ) : active === 'citas' ? (
          <StaffAgendaPanel />
        ) : active === 'inventario' ? (
          <EmployeeInventorySection />
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
    </>
  )
}
