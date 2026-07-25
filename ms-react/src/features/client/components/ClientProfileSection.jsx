import { useState, useEffect } from 'react'
import { fetchMyMedicalProfile, fetchMyStats } from '../../../shared/api/ProfileApi.js'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'

export function ClientProfileSection() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const [profileRes, statsRes] = await Promise.all([
          fetchMyMedicalProfile(),
          fetchMyStats()
        ])

        setProfile(profileRes.data?.data || null)
        setStats(statsRes.data?.data || null)
      } catch (err) {
        console.error('Error loading medical profile data:', err)
        setError('No se pudo cargar la información médica. Por favor, intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-rojo border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[13px] text-txt3 font-light mt-4">Obteniendo historial médico...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-5 py-4 text-center">
        <p className="text-[13px] text-rojo font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-[11px] font-bold text-rojo hover:underline uppercase tracking-wider"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const bloodType = profile?.donorData?.bloodType || '—'
  const weight = profile?.donorData?.weightKg ? `${profile.donorData.weightKg} kg` : 'Sin registrar'
  
  const lastDonationFormatted = profile?.donorData?.lastDonationDate
    ? new Date(profile.donorData.lastDonationDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Sin registros de donación'

  const totalDonatedLiters = stats?.totalBloodDonatedLiters ?? 0.0
  const totalPoints = stats?.totalEarnedPoints ?? 0
  const donationCount = stats?.donationCount ?? 0
  const appointmentCount = stats?.appointmentCount ?? 0

  return (
    <div className="space-y-6">
      {/* Resumen del Perfil Médico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DashboardSectionCard
            title="Información Médica del Donante"
            subtitle="Tus datos de compatibilidad y registro de salud"
            cardClassName="rounded-[14px] bg-white border border-gris2 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-full"
          >
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Visualización del Tipo de Sangre */}
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-[20px] bg-red-50 border border-red-100 flex-shrink-0 animate-pulse-subtle">
                  <span className="text-[10px] font-bold text-rojo tracking-[0.1em] uppercase">Grupo</span>
                  <span className="text-[36px] font-cormorant font-bold text-rojo leading-none">{bloodType}</span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h4 className="text-[15px] font-semibold text-txt">Estatus de Donante</h4>
                    <p className="text-[13px] text-txt3 font-light mt-0.5">
                      {bloodType !== '—' 
                        ? 'Tu tipo de sangre está verificado en el sistema.' 
                        : 'Tu tipo de sangre se registrará después de tu primer triaje.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-[10px] bg-gris1 border border-gris2">
                      <span className="text-[10px] font-bold text-txt3 uppercase tracking-wider block">Último Peso Medido</span>
                      <span className="text-[15px] font-semibold text-txt mt-1 block">{weight}</span>
                    </div>
                    <div className="p-3.5 rounded-[10px] bg-gris1 border border-gris2">
                      <span className="text-[10px] font-bold text-txt3 uppercase tracking-wider block">Última Donación</span>
                      <span className="text-[13px] font-semibold text-txt mt-1 block truncate" title={lastDonationFormatted}>
                        {lastDonationFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardSectionCard>
        </div>

        {/* Tarjeta Informativa Lateral */}
        <div className="md:col-span-1">
          <div className="p-6 rounded-[14px] bg-gradient-to-br from-[#1b1924] to-[#121016] text-white border border-[rgba(212,32,64,0.15)] flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            <div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] bg-[rgba(212,32,64,0.15)] text-rojo mb-4">
                <span className="text-xl">🩸</span>
              </div>
              <h4 className="font-cormorant text-xl font-medium tracking-wide">¿Sabías qué?</h4>
              <p className="text-[12px] text-gray-300 font-light mt-2 leading-relaxed">
                Una sola donación de sangre de {bloodType !== '—' ? `tipo ${bloodType}` : 'cualquier grupo'} puede salvar hasta tres vidas. La sangre donada se separa en glóbulos rojos, plasma y plaquetas para diferentes pacientes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center text-[11px] text-gray-400">
              <span>Frecuencia recomendada</span>
              <span className="font-semibold text-rojo">Cada 3-4 meses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Estadísticas Médicas y de Citas */}
      <div>
        <h3 className="text-[13px] font-semibold text-txt mb-4 uppercase tracking-wider">Tus Estadísticas en BloodLink</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta: Litros Donados */}
          <div className="p-5 rounded-[14px] bg-white border border-gris2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-6 -mt-6 transition-all duration-300 group-hover:scale-110 opacity-70"></div>
            <div className="relative">
              <span className="text-[10px] font-bold text-txt3 uppercase tracking-wider block">Volumen Total Donado</span>
              <div className="flex items-baseline space-x-1 mt-2">
                <span className="text-[32px] font-cormorant font-bold text-rojo leading-none">{totalDonatedLiters}</span>
                <span className="text-[13px] font-medium text-txt3">Ltrs</span>
              </div>
              <span className="text-[11px] text-txt3 font-light block mt-2">Equivalente a {stats?.totalBloodDonatedMl ?? 0} ml</span>
            </div>
          </div>

          {/* Tarjeta: Donaciones Realizadas */}
          <div className="p-5 rounded-[14px] bg-white border border-gris2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-all duration-300 group-hover:scale-110 opacity-70"></div>
            <div className="relative">
              <span className="text-[10px] font-bold text-txt3 uppercase tracking-wider block">Donaciones Exitosas</span>
              <div className="flex items-baseline space-x-1 mt-2">
                <span className="text-[32px] font-cormorant font-bold text-emerald-600 leading-none">{donationCount}</span>
                <span className="text-[13px] font-medium text-txt3">Veces</span>
              </div>
              <span className="text-[11px] text-txt3 font-light block mt-2">Registradas en el sistema</span>
            </div>
          </div>

          {/* Tarjeta: Puntos Acumulados */}
          <div className="p-5 rounded-[14px] bg-white border border-gris2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-6 -mt-6 transition-all duration-300 group-hover:scale-110 opacity-70"></div>
            <div className="relative">
              <span className="text-[10px] font-bold text-txt3 uppercase tracking-wider block">Puntos Acumulados</span>
              <div className="flex items-baseline space-x-1 mt-2">
                <span className="text-[32px] font-cormorant font-bold text-amber-500 leading-none">{totalPoints}</span>
                <span className="text-[13px] font-medium text-txt3">Pts</span>
              </div>
              <span className="text-[11px] text-txt3 font-light block mt-2">Disponibles para canjear</span>
            </div>
          </div>

          {/* Tarjeta: Citas Agendadas */}
          <div className="p-5 rounded-[14px] bg-white border border-gris2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-all duration-300 group-hover:scale-110 opacity-70"></div>
            <div className="relative">
              <span className="text-[10px] font-bold text-txt3 uppercase tracking-wider block">Historial de Citas</span>
              <div className="flex items-baseline space-x-1 mt-2">
                <span className="text-[32px] font-cormorant font-bold text-blue-600 leading-none">{appointmentCount}</span>
                <span className="text-[13px] font-medium text-txt3">Citas</span>
              </div>
              <span className="text-[11px] text-txt3 font-light block mt-2">Programadas o completadas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
