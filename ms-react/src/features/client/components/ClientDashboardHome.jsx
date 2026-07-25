import { DashboardActionGrid } from '../../../shared/components/dashboard/DashboardActionGrid.jsx'
import { DashboardStatGrid } from '../../../shared/components/dashboard/DashboardStatGrid.jsx'
import { DashboardStatSkeleton } from '../../../shared/components/dashboard/DashboardStatSkeleton.jsx'
import { useClientDashboard } from '../hooks/useClientDashboard.js'
import { ClientEligibilitySemaphore } from './widgets/ClientEligibilitySemaphore.jsx'

function buildDashboardActions(onNavigate) {
  return [
    {
      title: 'Agendar donación',
      desc: 'Reservá tu próxima cita',
      accent: '#D42040',
      bg: 'rgba(212,32,64,0.05)',
      iconBg: 'rgba(212,32,64,0.07)',
      border: 'rgba(212,32,64,0.15)',
      onClick: () => onNavigate('citas'),
    },
    {
      title: 'Triaje médico',
      desc: 'Completá tu evaluación previa',
      accent: '#2060A0',
      bg: 'rgba(32,96,160,0.05)',
      iconBg: 'rgba(32,96,160,0.07)',
      border: 'rgba(32,96,160,0.12)',
      onClick: () => onNavigate('triaje'),
    },
    {
      title: 'Tienda de premios',
      desc: 'Canjeá tus puntos acumulados',
      accent: '#28A060',
      bg: 'rgba(40,160,96,0.05)',
      iconBg: 'rgba(40,160,96,0.07)',
      border: 'rgba(40,160,96,0.12)',
      onClick: () => onNavigate('tienda'),
    },
  ]
}

export function ClientDashboardHome({ user, onNavigate }) {
  const { loading, error, stats, walletPoints, eligibility } = useClientDashboard()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const displayName = user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Donante'

  const statItems = [
    {
      label: 'Donaciones realizadas',
      value: stats?.donationCount ?? 0,
      sub: 'Total histórico',
      accent: '#D42040',
      border: 'rgba(212,32,64,0.15)',
    },
    {
      label: 'Sangre donada',
      value: `${stats?.totalBloodDonatedLiters ?? 0} L`,
      sub: 'Volumen acumulado',
      accent: '#C8942A',
      border: 'rgba(200,148,42,0.18)',
    },
    {
      label: 'Puntos disponibles',
      value: walletPoints,
      sub: 'Canjeables en la tienda',
      accent: '#2060A0',
      border: 'rgba(32,96,160,0.15)',
    },
    {
      label: 'Citas totales',
      value: stats?.appointmentCount ?? 0,
      sub: 'Agendadas hasta hoy',
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

      {error ? (
        <div className="mb-5 rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      <div className="mb-7">
        {loading ? (
          <div className="h-20 animate-pulse rounded-[14px] border border-gris2 bg-white" />
        ) : (
          <ClientEligibilitySemaphore status={eligibility.status} daysSinceSubmission={eligibility.daysSinceSubmission} />
        )}
      </div>

      <div className="mb-7">{loading ? <DashboardStatSkeleton count={4} /> : <DashboardStatGrid items={statItems} />}</div>

      <div>
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <DashboardActionGrid items={buildDashboardActions(onNavigate)} />
      </div>
    </div>
  )
}
