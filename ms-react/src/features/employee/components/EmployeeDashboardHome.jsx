import { DashboardActionGrid } from '../../../shared/components/dashboard/DashboardActionGrid.jsx'
import { DashboardStatGrid } from '../../../shared/components/dashboard/DashboardStatGrid.jsx'
import { DashboardStatSkeleton } from '../../../shared/components/dashboard/DashboardStatSkeleton.jsx'
import { useEmployeeDashboard } from '../hooks/useEmployeeDashboard.js'
import { EmployeeCriticalStockAlert } from './widgets/EmployeeCriticalStockAlert.jsx'

function buildEmployeeActions(onNavigate) {
  return [
    {
      title: 'Revisar triaje',
      desc: 'Aprobar o rechazar formularios',
      accent: '#D42040',
      bg: 'rgba(212,32,64,0.05)',
      iconBg: 'rgba(212,32,64,0.07)',
      border: 'rgba(212,32,64,0.15)',
      onClick: () => onNavigate('triaje'),
    },
    {
      title: 'Ver inventario',
      desc: 'Consultar stock actual',
      accent: '#2060A0',
      bg: 'rgba(32,96,160,0.05)',
      iconBg: 'rgba(32,96,160,0.07)',
      border: 'rgba(32,96,160,0.12)',
      onClick: () => onNavigate('inventario'),
    },
    {
      title: 'Gestionar citas',
      desc: 'Revisar citas del día',
      accent: '#28A060',
      bg: 'rgba(40,160,96,0.05)',
      iconBg: 'rgba(40,160,96,0.07)',
      border: 'rgba(40,160,96,0.12)',
      onClick: () => onNavigate('citas'),
    },
  ]
}

export function EmployeeDashboardHome({ user, onNavigate }) {
  const { loading, error, agendaStats, criticalBloodTypes } = useEmployeeDashboard()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const displayName = user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Empleado'

  const stats = [
    {
      label: 'Citas hoy',
      value: agendaStats.total,
      sub: 'Agendadas para hoy',
      accent: '#D42040',
      border: 'rgba(212,32,64,0.15)',
    },
    {
      label: 'Pendientes',
      value: agendaStats.pending,
      sub: 'Por confirmar',
      accent: '#C8942A',
      border: 'rgba(200,148,42,0.18)',
    },
    {
      label: 'Confirmadas',
      value: agendaStats.confirmed,
      sub: 'Asistencia confirmada',
      accent: '#2060A0',
      border: 'rgba(32,96,160,0.15)',
    },
    {
      label: 'Zona',
      value: user.zone ?? '—',
      sub: user.municipality ?? 'Sin ubicación',
      accent: '#28A060',
      border: 'rgba(40,160,96,0.15)',
    },
  ]

  return (
    <div>
      <div className="mb-7">
        <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">{greeting}</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">{displayName}</h2>
        <p className="text-[13px] text-txt3 font-light mt-1">Bienvenido a tu panel de empleado en BloodLink.</p>
      </div>

      {error ? (
        <div className="mb-5 rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      <div className="mb-7">
        {loading ? (
          <div className="h-16 animate-pulse rounded-[14px] border border-gris2 bg-white" />
        ) : (
          <EmployeeCriticalStockAlert criticalBloodTypes={criticalBloodTypes} />
        )}
      </div>

      <div className="mb-7">{loading ? <DashboardStatSkeleton count={4} /> : <DashboardStatGrid items={stats} />}</div>

      <div>
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <DashboardActionGrid items={buildEmployeeActions(onNavigate)} />
      </div>
    </div>
  )
}
