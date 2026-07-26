import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardPlaceholderSection } from '../../../shared/components/dashboard/DashboardPlaceholderSection.jsx'
import { DashboardShell } from '../../../shared/components/dashboard/DashboardShell.jsx'
import { DashboardSidebar } from '../../../shared/components/dashboard/DashboardSidebar.jsx'
import { DashboardTopbar } from '../../../shared/components/dashboard/DashboardTopbar.jsx'
import { clearAuth, getStoredAuth } from '../../../shared/utils/auth.store.js'
import { AdminUsersSection } from '../components/AdminUsersSection.jsx'
import { AdminRewardsSection } from '../components/AdminRewardsSection.jsx'
import { AdminDashboardHome } from '../components/AdminDashboardHome.jsx'
import { AdminDonationsSection } from '../components/AdminDonationsSection.jsx'
import { EmployeeInventorySection } from '../../employee/components/EmployeeInventorySection.jsx'
import { ProfileConfigModal } from '../../../shared/components/dashboard/ProfileConfigModal.jsx'
import {
  AdminIconBox,
  AdminIconChart,
  AdminIconDrop,
  AdminIconGift,
  AdminIconHome,
  AdminIconUsers,
} from '../components/AdminDashboardIcons.jsx'

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: AdminIconHome },
  { id: 'usuarios', label: 'Usuarios', icon: AdminIconUsers, roles: ['ADMIN_ROLE'] },
  { id: 'donaciones', label: 'Donaciones', icon: AdminIconDrop },
  { id: 'inventario', label: 'Inventario', icon: AdminIconBox },
  { id: 'premios', label: 'Premios', icon: AdminIconGift },
  { id: 'reportes', label: 'Reportes', icon: AdminIconChart },
]

const ROLE_LABEL = {
  ADMIN_ROLE: 'Administrador',
  STAFF_ROLE: 'Personal',
}

export function AdminDashboardPage() {
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

  useEffect(() => {
    const onGlobalLogout = () => {
      console.log('[AdminDashboardPage] bl_logout received, executing handleLogout')
      handleLogout()
    }
    console.log('[AdminDashboardPage] registering bl_logout listener')
    window.addEventListener('bl_logout', onGlobalLogout)
    return () => window.removeEventListener('bl_logout', onGlobalLogout)
  }, [])
  const handleProfileUpdate = () => {
    setAuth(getStoredAuth())
  }

  const displayName = user.name || user.username || 'Admin'
  const initials = ((user.name?.[0] ?? '') + (user.surname?.[0] ?? '')) || displayName[0]?.toUpperCase() || 'A'
  const roleLabel = ROLE_LABEL[user.role] ?? 'Admin'
  const currentSection = NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Dashboard'

  // Filtrar nav items según el rol del usuario
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user.role)
  })

  return (
    <>
      <DashboardShell
        sidebar={
          <DashboardSidebar
            user={user}
            displayName={displayName}
            initials={initials}
            roleLabel={roleLabel}
            navItems={visibleNavItems}
            activeId={active}
            onNavigate={setActive}
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
            sidebarStyle={{ background: '#111018', borderRight: '1px solid rgba(212,32,64,0.12)' }}
            userCardStyle={{ background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.2)' }}
            logoutTone="rgba(255,120,120,0.6)"
            onProfileClick={() => setIsConfigOpen(true)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        }
        topbar={
          <DashboardTopbar
            title={currentSection}
            subtitle="BloodLink · Panel de administración"
            displayName={displayName}
            email={user.email}
            initials={initials}
            profilePicture={user.profilePicture}
            onProfileClick={() => setIsConfigOpen(true)}
            onMenuToggle={() => setMobileSidebarOpen(true)}
          />
        }
        mainClassName="bg-[#F5F3F8]"
      >
        {active === 'inicio' ? (
          <AdminDashboardHome user={user} onNavigate={setActive} />
        ) : active === 'usuarios' ? (
          <AdminUsersSection currentUserId={user.id} />
        ) : active === 'premios' ? (
          <AdminRewardsSection />
        ) : active === 'inventario' ? (
          <EmployeeInventorySection />
        ) : active === 'donaciones' ? (
          <AdminDonationsSection />
        ) : (
          <DashboardPlaceholderSection
            title={NAV_ITEMS.find((item) => item.id === active)?.label ?? 'Sección'}
            description="Esta sección se conecta cuando el CRUD de administración entre en desarrollo."
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
