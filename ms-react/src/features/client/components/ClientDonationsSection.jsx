import { useEffect, useState } from 'react'
import { fetchDonationsList } from '../../../shared/api/donations.api.js'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { DashboardStatGrid } from '../../../shared/components/dashboard/DashboardStatGrid.jsx'

function formatDate(dateVal) {
  if (!dateVal) return '—'
  const date = new Date(dateVal)
  if (isNaN(date.getTime())) return '—'
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  const hrs = String(date.getHours()).padStart(2, '0')
  const mins = String(date.getMinutes()).padStart(2, '0')
  return `${d}/${m}/${y} a las ${hrs}:${mins}`
}

export function ClientDonationsSection({ onNavigate }) {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDonations = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetchDonationsList()
      setDonations(response.data?.data ?? [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'No se pudieron cargar tus donaciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])

  // Calculations for stats
  const totalDonations = donations.length
  const totalVolume = donations.reduce((sum, d) => sum + (d.bloodUnit?.volumeMl || 0), 0)

  // Calculate next eligibility date (56 days minimum interval)
  let eligibilityText = 'Apto para donar'
  if (donations.length > 0) {
    const lastDonation = donations[0] // Sorted descending
    const lastDate = new Date(lastDonation.donationDate)
    const nextEligible = new Date(lastDate)
    nextEligible.setDate(lastDate.getDate() + 56)
    const today = new Date()
    if (today < nextEligible) {
      const d = String(nextEligible.getDate()).padStart(2, '0')
      const m = String(nextEligible.getMonth() + 1).padStart(2, '0')
      const y = nextEligible.getFullYear()
      eligibilityText = `Apto desde el ${d}/${m}/${y}`
    }
  }

  const stats = [
    {
      label: 'Mis Donaciones',
      value: totalDonations,
      sub: 'Extracciones completadas',
      accent: '#D42040',
      border: 'rgba(212,32,64,0.15)',
    },
    {
      label: 'Volumen Total',
      value: `${totalVolume} ml`,
      sub: 'Sangre donada',
      accent: '#2060A0',
      border: 'rgba(32,96,160,0.15)',
    },
    {
      label: 'Estado Donador',
      value: eligibilityText,
      sub: 'Frecuencia mínima: 56 días',
      accent: '#28A060',
      border: 'rgba(40,160,96,0.15)',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Mi Historial de Donaciones</h2>
        <p className="text-[13px] text-txt3 font-light">
          Consultá los registros de tus extracciones de sangre y tu estado de elegibilidad actual.
        </p>
      </div>

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {!loading && donations.length > 0 && (
        <div className="grid gap-4">
          <DashboardStatGrid items={stats} />
        </div>
      )}

      {loading ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          Cargando tu historial de donaciones...
        </div>
      ) : donations.length > 0 ? (
        <DashboardSectionCard
          title="Registro Histórico"
          subtitle={`${donations.length} donación${donations.length === 1 ? '' : 'es'} realizada${donations.length === 1 ? '' : 's'}`}
          cardClassName="bg-transparent border-none shadow-none p-0"
        >
          <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-gris2">
                <thead className="bg-[#FAFAF8]">
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
                    <th className="px-5 py-3">Código Bolsa</th>
                    <th className="px-5 py-3">Grupo Sanguíneo</th>
                    <th className="px-5 py-3">Volumen</th>
                    <th className="px-5 py-3">Fecha y Hora</th>
                    <th className="px-5 py-3">Personal Atendió</th>
                    <th className="px-5 py-3">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gris2 bg-white">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-5 py-4 text-[12px] font-mono text-txt2">{donation.bloodUnit?.unitCode}</td>
                      <td className="px-5 py-4 text-[12px] text-rojo font-bold">{donation.bloodUnit?.bloodType || '—'}</td>
                      <td className="px-5 py-4 text-[12px] text-txt font-semibold">{donation.bloodUnit?.volumeMl} ml</td>
                      <td className="px-5 py-4 text-[12px] text-txt3">{formatDate(donation.donationDate)}</td>
                      <td className="px-5 py-4 text-[12px] text-txt2">{donation.staffName}</td>
                      <td className="px-5 py-4 text-[12px] text-txt3 max-w-[200px] truncate" title={donation.notes || ''}>
                        {donation.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-3 p-4 lg:hidden sm:p-5">
              {donations.map((donation) => (
                <article
                  key={donation.id}
                  className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-mono font-semibold text-txt3">{donation.bloodUnit?.unitCode}</p>
                      <p className="text-[11px] text-txt2 mt-0.5">{formatDate(donation.donationDate)}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(212,32,64,0.08)] px-2.5 py-0.5 text-[11px] font-bold text-rojo">
                      Grupo {donation.bloodUnit?.bloodType}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gris1 pt-3 text-[12px]">
                    <div>
                      <span className="text-txt3 block text-[10px] uppercase font-bold tracking-wider">Volumen</span>
                      <span className="font-semibold text-txt">{donation.bloodUnit?.volumeMl} ml</span>
                    </div>
                    <div>
                      <span className="text-txt3 block text-[10px] uppercase font-bold tracking-wider">Atendido por</span>
                      <span className="text-txt2">{donation.staffName}</span>
                    </div>
                    {donation.notes && (
                      <div className="col-span-2 mt-1 border-t border-gris1 pt-2">
                        <span className="text-txt3 block text-[10px] uppercase font-bold tracking-wider">Notas</span>
                        <p className="text-txt3 italic">"{donation.notes}"</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </DashboardSectionCard>
      ) : (
        <DashboardEmptyState
          icon="❤️"
          title="Sin donaciones registradas"
          description="Agendá tu primera cita de donación de sangre hoy y sumá puntos."
          onClick={() => onNavigate('citas')}
        />
      )}
    </div>
  )
}
