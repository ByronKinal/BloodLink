import { DashboardActionGrid } from '../../../shared/components/dashboard/DashboardActionGrid.jsx'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardStatGrid } from '../../../shared/components/dashboard/DashboardStatGrid.jsx'

const DASHBOARD_STATS = [
  {
    label: 'Total usuarios',
    value: '—',
    sub: 'Registrados',
    accent: '#B81C32',
    border: 'rgba(184,28,50,0.18)',
  },
  {
    label: 'Donaciones hoy',
    value: '—',
    sub: 'En el día',
    accent: '#C8942A',
    border: 'rgba(200,148,42,0.2)',
  },
  {
    label: 'Inventario crítico',
    value: '—',
    sub: 'Tipos con bajo stock',
    accent: '#2060A0',
    border: 'rgba(32,96,160,0.18)',
  },
  {
    label: 'Solicitudes pendientes',
    value: '—',
    sub: 'Por atender',
    accent: '#28A060',
    border: 'rgba(40,160,96,0.18)',
  },
]

const DASHBOARD_ACTIONS = [
  {
    title: 'Registrar donación',
    desc: 'Nueva entrada de donación',
    accent: '#B81C32',
    bg: 'rgba(184,28,50,0.05)',
    iconBg: 'rgba(184,28,50,0.07)',
    border: 'rgba(184,28,50,0.14)',
  },
  {
    title: 'Actualizar inventario',
    desc: 'Modificar stock de sangre',
    accent: '#C8942A',
    bg: 'rgba(200,148,42,0.05)',
    iconBg: 'rgba(200,148,42,0.07)',
    border: 'rgba(200,148,42,0.16)',
  },
  {
    title: 'Ver reportes',
    desc: 'Estadísticas y métricas',
    accent: '#2060A0',
    bg: 'rgba(32,96,160,0.05)',
    iconBg: 'rgba(32,96,160,0.07)',
    border: 'rgba(32,96,160,0.14)',
  },
]

export function AdminDashboardHome({ user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const displayName = user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Admin'

  return (
    <div>
      <div className="mb-7">
        <p className="text-[10px] font-bold text-rojo tracking-[0.14em] uppercase mb-1">{greeting}</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">{displayName}</h2>
        <p className="text-[13px] text-txt3 font-light mt-1">Panel de administración de BloodLink.</p>
      </div>

      <div className="mb-7">
        <DashboardStatGrid items={DASHBOARD_STATS} />
      </div>

      <div className="mb-7">
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <DashboardActionGrid items={DASHBOARD_ACTIONS} />
      </div>

      <DashboardSectionCard
        title="Usuarios recientes"
        subtitle="Base inicial para el CRUD de usuarios"
        cardClassName="bg-white border border-gris2 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
      >
        <div className="hidden md:grid md:grid-cols-4 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-txt3 border-b border-[#EEE8F0] bg-[#FAFAF8]">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Tipo de sangre</span>
          <span>Estado</span>
        </div>

        <DashboardEmptyState
          icon="🩸"
          title="Sin usuarios registrados"
          description="Los nuevos registros aparecerán aquí."
        />
      </DashboardSectionCard>
    </div>
  )
}