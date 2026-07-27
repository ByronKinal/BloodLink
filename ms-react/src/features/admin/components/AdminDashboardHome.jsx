import { useEffect } from 'react'
import { DashboardActionGrid } from '../../../shared/components/dashboard/DashboardActionGrid.jsx'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardStatGrid } from '../../../shared/components/dashboard/DashboardStatGrid.jsx'
import { DashboardStatSkeleton } from '../../../shared/components/dashboard/DashboardStatSkeleton.jsx'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { useAdminDashboard } from '../hooks/useAdminDashboard.js'
import { AdminBloodStockChart } from './widgets/AdminBloodStockChart.jsx'
import { AdminRecentUsersTable } from './widgets/AdminRecentUsersTable.jsx'

function buildDashboardActions(onNavigate) {
  return [
    {
      title: 'Gestionar usuarios',
      desc: 'Ver, editar y asignar roles',
      accent: '#B81C32',
      bg: 'rgba(184,28,50,0.05)',
      iconBg: 'rgba(184,28,50,0.07)',
      border: 'rgba(184,28,50,0.14)',
      onClick: () => onNavigate('usuarios'),
    },
    {
      title: 'Gestionar premios',
      desc: 'Crear y editar recompensas',
      accent: '#C8942A',
      bg: 'rgba(200,148,42,0.05)',
      iconBg: 'rgba(200,148,42,0.07)',
      border: 'rgba(200,148,42,0.16)',
      onClick: () => onNavigate('premios'),
    },
    {
      title: 'Ver inventario',
      desc: 'Stock de sangre por tipo',
      accent: '#2060A0',
      bg: 'rgba(32,96,160,0.05)',
      iconBg: 'rgba(32,96,160,0.07)',
      border: 'rgba(32,96,160,0.14)',
      onClick: () => onNavigate('inventario'),
    },
  ]
}

export function AdminDashboardHome({ user, onNavigate }) {
  const { loading, error, totalUsers, usersByRole, recentUsers, stockSummary, criticalBloodTypes, refresh } =
    useAdminDashboard()

  useEffect(() => {
    const handler = () => {
      refresh()
    }
    window.addEventListener('bl_users_updated', handler)
    return () => {
      window.removeEventListener('bl_users_updated', handler)
    }
  }, [refresh])
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const displayName = user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Admin'

  const stats = [
    {
      label: 'Total usuarios',
      value: totalUsers,
      sub: 'Registrados en el sistema',
      accent: '#B81C32',
      border: 'rgba(184,28,50,0.18)',
    },
    {
      label: 'Donantes',
      value: usersByRole.DONOR_ROLE?.length ?? 0,
      sub: 'Con rol DONOR_ROLE',
      accent: '#C8942A',
      border: 'rgba(200,148,42,0.2)',
    },
    {
      label: 'Personal',
      value: usersByRole.STAFF_ROLE?.length ?? 0,
      sub: 'Con rol STAFF_ROLE',
      accent: '#2060A0',
      border: 'rgba(32,96,160,0.18)',
    },
    {
      label: 'Inventario crítico',
      value: criticalBloodTypes.length,
      sub: criticalBloodTypes.length > 0 ? criticalBloodTypes.map((item) => item.bloodType).join(', ') : 'Sin escasez',
      accent: '#28A060',
      border: 'rgba(40,160,96,0.18)',
    },
  ]

  return (
    <div>
      <div className="mb-7">
        <p className="text-[10px] font-bold text-rojo tracking-[0.14em] uppercase mb-1">{greeting}</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">{displayName}</h2>
        <p className="text-[13px] text-txt3 font-light mt-1">Panel de administración de BloodLink.</p>
      </div>

      {error ? (
        <div className="mb-5 rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      <div className="mb-7">{loading ? <DashboardStatSkeleton count={4} /> : <DashboardStatGrid items={stats} />}</div>

      <div className="mb-7">
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <DashboardActionGrid items={buildDashboardActions(onNavigate)} />
      </div>

      <div className="mb-7">
        <DashboardSectionCard
          title="Inventario de sangre"
          subtitle={stockSummary ? `${stockSummary.summary.totalDisponibleBags} bolsas disponibles en total` : 'Cargando...'}
          cardClassName="bg-white border border-gris2 shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          {loading ? (
            <div className="animate-pulse px-5 py-6 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-3 rounded bg-gris2" />
              ))}
            </div>
          ) : (
            <AdminBloodStockChart byBloodType={stockSummary?.byBloodType} />
          )}
        </DashboardSectionCard>
      </div>

      <DashboardSectionCard
        title="Usuarios recientes"
        subtitle="Últimos registros en la plataforma"
        cardClassName="bg-white border border-gris2 shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {loading ? (
          <div className="animate-pulse px-5 py-6 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-3 rounded bg-gris2" />
            ))}
          </div>
        ) : recentUsers.length > 0 ? (
          <AdminRecentUsersTable users={recentUsers} />
        ) : (
          <DashboardEmptyState
            icon="🩸"
            title="Sin usuarios registrados"
            description="Los nuevos registros aparecerán aquí."
          />
        )}
      </DashboardSectionCard>
    </div>
  )
}
