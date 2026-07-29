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

export function AdminDonationsSection() {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedBloodType, setSelectedBloodType] = useState('')

  const loadDonations = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetchDonationsList()
      const data = response.data?.data ?? []
      setDonations(data)
      setFilteredDonations(data)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'No se pudieron cargar las donaciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])

  useEffect(() => {
    let result = [...donations]

    if (search.trim()) {
      const s = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.donorName?.toLowerCase().includes(s) ||
          d.donorEmail?.toLowerCase().includes(s) ||
          d.bloodUnit?.unitCode?.toLowerCase().includes(s) ||
          d.staffName?.toLowerCase().includes(s)
      )
    }

    if (selectedBloodType) {
      result = result.filter((d) => d.bloodUnit?.bloodType === selectedBloodType)
    }

    setFilteredDonations(result)
  }, [search, selectedBloodType, donations])

  // Calculations for stats
  const totalDonations = donations.length
  const totalVolume = donations.reduce((sum, d) => sum + (d.bloodUnit?.volumeMl || 0), 0)
  const averageVolume = totalDonations > 0 ? Math.round(totalVolume / totalDonations) : 0

  const stats = [
    {
      label: 'Total Extracciones',
      value: totalDonations,
      sub: 'Registradas en BloodLink',
      accent: '#D42040',
      border: 'rgba(212,32,64,0.15)',
    },
    {
      label: 'Volumen Total',
      value: `${(totalVolume / 1000).toFixed(1)} Litros`,
      sub: `${totalVolume} ml extraídos`,
      accent: '#2060A0',
      border: 'rgba(32,96,160,0.15)',
    },
    {
      label: 'Promedio Donación',
      value: `${averageVolume} ml`,
      sub: 'Por extracción',
      accent: '#28A060',
      border: 'rgba(40,160,96,0.15)',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Historial de Donaciones</h2>
          <p className="text-[13px] text-txt3 font-light mt-1">
            Revisá y filtrá todas las extracciones registradas por el personal médico.
          </p>
        </div>
        <button
          onClick={loadDonations}
          className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt hover:border-rojo hover:text-rojo transition-colors"
        >
          Refrescar lista
        </button>
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

      {/* Toolbar / Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-gris2 p-4 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por donante, personal, código de bolsa..."
          className="w-full sm:max-w-xs rounded-[10px] border border-gris2 bg-gris1 px-3 py-2 text-[13px] text-txt outline-none focus:border-rojo focus:bg-white transition-all duration-200"
        />

        <select
          value={selectedBloodType}
          onChange={(e) => setSelectedBloodType(e.target.value)}
          className="rounded-[10px] border border-gris2 bg-gris1 px-3 py-2 text-[13px] text-txt outline-none focus:border-rojo focus:bg-white transition-all duration-200"
        >
          <option value="">Todos los grupos sanguíneos</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
            <option key={type} value={type}>
              Grupo {type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          Cargando historial de extracciones...
        </div>
      ) : filteredDonations.length > 0 ? (
        <DashboardSectionCard
          title="Extracciones Realizadas"
          subtitle={`${filteredDonations.length} registro${filteredDonations.length === 1 ? '' : 's'}`}
          cardClassName="bg-transparent border-none shadow-none p-0"
        >
          <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-gris2">
                <thead className="bg-[#FAFAF8]">
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
                    <th className="px-5 py-3">Donante</th>
                    <th className="px-5 py-3">Grupo</th>
                    <th className="px-5 py-3">Volumen</th>
                    <th className="px-5 py-3">Código Bolsa</th>
                    <th className="px-5 py-3">Registrado por</th>
                    <th className="px-5 py-3">Fecha</th>
                    <th className="px-5 py-3">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gris2 bg-white">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-medium text-txt">{donation.donorName}</div>
                        <div className="text-[11px] text-txt3">{donation.donorEmail}</div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-rojo font-bold">{donation.bloodUnit?.bloodType || '—'}</td>
                      <td className="px-5 py-4 text-[12px] text-txt font-semibold">{donation.bloodUnit?.volumeMl} ml</td>
                      <td className="px-5 py-4 text-[11px] text-txt3 font-mono">{donation.bloodUnit?.unitCode}</td>
                      <td className="px-5 py-4 text-[12px] text-txt2">{donation.staffName}</td>
                      <td className="px-5 py-4 text-[12px] text-txt3">{formatDate(donation.donationDate)}</td>
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
              {filteredDonations.map((donation) => (
                <article
                  key={donation.id}
                  className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-txt">{donation.donorName}</p>
                      <p className="text-[11px] text-txt3">{donation.donorEmail}</p>
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
                      <span className="text-txt3 block text-[10px] uppercase font-bold tracking-wider">Registrado por</span>
                      <span className="text-txt2">{donation.staffName}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-txt3 block text-[10px] uppercase font-bold tracking-wider">Código de bolsa</span>
                      <span className="font-mono text-txt2">{donation.bloodUnit?.unitCode}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-txt3 block text-[10px] uppercase font-bold tracking-wider">Fecha</span>
                      <span className="text-txt2">{formatDate(donation.donationDate)}</span>
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
          icon="📊"
          title="Sin extracciones encontradas"
          description={
            donations.length === 0
              ? 'Aún no se han registrado extracciones de donaciones en el sistema.'
              : 'Probá cambiando los términos de búsqueda o filtros.'
          }
        />
      )}
    </div>
  )
}
