import { DashboardActionGrid } from '../../../shared/components/dashboard/DashboardActionGrid.jsx'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardStatGrid } from '../../../shared/components/dashboard/DashboardStatGrid.jsx'

const BLOOD_TYPE_LABELS = {
  'A+': 'A positivo',
  'A-': 'A negativo',
  'B+': 'B positivo',
  'B-': 'B negativo',
  'AB+': 'AB positivo',
  'AB-': 'AB negativo',
  'O+': 'O positivo',
  'O-': 'O negativo',
}

const DASHBOARD_ACTIONS = [
  {
    title: 'Agendar donación',
    desc: 'Reservá tu próxima cita',
    accent: '#D42040',
    bg: 'rgba(212,32,64,0.05)',
    iconBg: 'rgba(212,32,64,0.07)',
    border: 'rgba(212,32,64,0.15)',
  },
  {
    title: 'Ver inventario',
    desc: 'Conocé el stock actual',
    accent: '#2060A0',
    bg: 'rgba(32,96,160,0.05)',
    iconBg: 'rgba(32,96,160,0.07)',
    border: 'rgba(32,96,160,0.12)',
  },
  {
    title: 'Mi historial',
    desc: 'Revisá tus donaciones',
    accent: '#28A060',
    bg: 'rgba(40,160,96,0.05)',
    iconBg: 'rgba(40,160,96,0.07)',
    border: 'rgba(40,160,96,0.12)',
  },
]

export function ClientDashboardHome({ user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const displayName = user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Donante'

  const stats = [
    {
      label: 'Donaciones realizadas',
      value: '—',
      sub: 'Sin registros aún',
      accent: '#D42040',
      border: 'rgba(212,32,64,0.15)',
    },
    {
      label: 'Tipo de sangre',
      value: user.bloodType ?? '—',
      sub: user.bloodType ? 'Tu grupo sanguíneo' : 'Sin registrar',
      accent: '#C8942A',
      border: 'rgba(200,148,42,0.18)',
    },
    {
      label: 'Próxima cita',
      value: '—',
      sub: 'Sin cita programada',
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
        <p className="text-[13px] text-txt3 font-light mt-1">Bienvenido a tu panel de donante en BloodLink.</p>
      </div>

      <div className="mb-7">
        <DashboardStatGrid items={stats} />
      </div>

      <div className="mb-7">
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <DashboardActionGrid items={DASHBOARD_ACTIONS} />
      </div>

      <DashboardSectionCard
        title="Actividad reciente"
        subtitle="Donaciones y movimientos recientes"
        cardClassName="rounded-[14px] bg-blanco border border-gris2 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gris2 flex justify-between items-center">
          <span className="text-[13px] font-medium text-txt">Donaciones</span>
          <span className="text-[11px] text-txt3">Últimas actividades</span>
        </div>

        <DashboardEmptyState
          icon="🩸"
          title="Sin actividad aún"
          description="Cuando realices tu primera donación, aparecerá aquí."
          className="py-10"
        />
      </DashboardSectionCard>

      <div className="sr-only">{BLOOD_TYPE_LABELS[user.bloodType] ?? user.bloodType ?? 'Sin tipo de sangre registrado'}</div>
    </div>
  )
}