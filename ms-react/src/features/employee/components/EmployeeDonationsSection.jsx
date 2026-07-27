import { useEffect, useState } from 'react'
import { fetchAppointments } from '../../../shared/api/appointments.api.js'
import { registerDonationWeight } from '../../../shared/api/donations.api.js'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { InputField } from '../../../shared/components/InputField.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'
import { Toast } from '../../../shared/components/Toast.jsx'

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = WEEKDAYS[dateObj.getDay()]
  return `${dayName} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
}

function getDonorLabel(appointment) {
  const donor = appointment.donor
  if (!donor) return 'Donante desconocido'
  const fullName = `${donor.name ?? ''} ${donor.surname ?? ''}`.trim()
  return fullName || donor.username || donor.email || 'Donante'
}

export function EmployeeDonationsSection() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Form state
  const [weightGrams, setWeightGrams] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [notes, setNotes] = useState('')

  const [toast, setToast] = useState(null)
  const showToast = (message, tone = 'success') => setToast({ message, tone })
  const dismissToast = () => setToast(null)

  const loadAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetchAppointments({ status: 'CONFIRMED' })
      const data = response.data?.data ?? []

      // Sort: show pending donations (hasDonation = false) first
      const sorted = [...data].sort((a, b) => {
        if (a.hasDonation === b.hasDonation) {
          return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
        }
        return a.hasDonation ? 1 : -1
      })
      setAppointments(sorted)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'No se pudieron cargar las citas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const handleOpenRegister = (appointment) => {
    setSelectedAppointment(appointment)
    setWeightGrams('450') // Standard donation volume
    setDeviceId('IOT-BAL-01')
    setNotes('')
  }

  const handleClose = () => {
    setSelectedAppointment(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAppointment) return

    setSaving(true)
    try {
      await registerDonationWeight({
        appointmentId: selectedAppointment.id,
        weightGrams: Number(weightGrams),
        deviceId: deviceId.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      showToast('Donación registrada con éxito en el sistema.', 'success')
      handleClose()
      loadAppointments()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Error al registrar donación.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Registro de extracciones</h2>
        <p className="text-[13px] text-txt3 font-light">
          Registrá los mililitros extraídos para las citas que asistieron y genera sus bolsas de sangre.
        </p>
      </div>

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          Cargando citas confirmadas...
        </div>
      ) : appointments.length > 0 ? (
        <DashboardSectionCard
          title="Extracciones programadas"
          subtitle={`${appointments.filter((a) => !a.hasDonation).length} pendientes de registrar`}
          cardClassName="bg-transparent border-none shadow-none p-0"
        >
          <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-gris2">
                <thead className="bg-[#FAFAF8]">
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
                    <th className="px-5 py-3">Donante</th>
                    <th className="px-5 py-3">Tipo Sangre</th>
                    <th className="px-5 py-3">Fecha y Hora</th>
                    <th className="px-5 py-3">Estado Extracción</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gris2 bg-white">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className={appointment.hasDonation ? 'bg-[#FAFAF8] opacity-75' : ''}>
                      <td className="px-5 py-4 text-[13px] font-medium text-txt">{getDonorLabel(appointment)}</td>
                      <td className="px-5 py-4 text-[12px] text-txt2 font-bold">{appointment.donor?.userProfile?.blood_type || '—'}</td>
                      <td className="px-5 py-4 text-[12px] text-txt3">
                        {formatDate(appointment.date)} a las {appointment.time}
                      </td>
                      <td className="px-5 py-4">
                        {appointment.hasDonation ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F0] px-2.5 py-0.5 text-[11px] font-medium text-verde-v">
                            ● Extraída
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[11px] font-medium text-amarillo">
                            ● Pendiente extracción
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {appointment.hasDonation ? (
                          <span className="text-[12px] text-txt3">Completada</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenRegister(appointment)}
                            className="rounded-[10px] border border-rojo bg-rojo px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-rojo-v"
                          >
                            Registrar donación
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="grid gap-3 p-4 lg:hidden sm:p-5">
              {appointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className={`rounded-[16px] border border-gris2 p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)] bg-white ${
                    appointment.hasDonation ? 'bg-gris1 opacity-80' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-txt">{getDonorLabel(appointment)}</p>
                      <p className="text-[12px] font-bold text-rojo">Grupo: {appointment.donor?.userProfile?.blood_type || '—'}</p>
                      <p className="text-[11px] text-txt3">
                        {formatDate(appointment.date)} a las {appointment.time}
                      </p>
                    </div>
                    {appointment.hasDonation ? (
                      <span className="text-[11px] font-medium text-verde-v">Completada</span>
                    ) : (
                      <span className="text-[11px] font-medium text-amarillo">Pendiente</span>
                    )}
                  </div>
                  {!appointment.hasDonation && (
                    <button
                      type="button"
                      onClick={() => handleOpenRegister(appointment)}
                      className="mt-4 w-full rounded-[10px] border border-rojo bg-rojo py-2 text-[12px] font-semibold text-white transition-colors hover:bg-rojo-v"
                    >
                      Registrar donación
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </DashboardSectionCard>
      ) : (
        <DashboardEmptyState
          icon="🩸"
          title="Sin extracciones pendientes"
          description="Todas las citas de donantes confirmadas ya tienen sus donaciones registradas."
        />
      )}

      {selectedAppointment && (
        <Modal
          open={Boolean(selectedAppointment)}
          title="Registrar extracción"
          subtitle={`Ingresá los datos de la donación para ${getDonorLabel(selectedAppointment)}`}
          onClose={handleClose}
          maxWidth="max-w-[500px]"
          footer={
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt hover:border-rojo hover:text-rojo"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="register-donation-form"
                disabled={saving}
                className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white hover:bg-rojo-v disabled:opacity-65"
              >
                {saving ? 'Registrando...' : 'Confirmar extracción'}
              </button>
            </>
          }
        >
          <form id="register-donation-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-[10px] border border-[rgba(212,32,64,0.1)] bg-[rgba(212,32,64,0.02)] p-3 text-[12px] space-y-1 text-txt2">
              <p><strong>Donante:</strong> {getDonorLabel(selectedAppointment)}</p>
              <p><strong>Tipo de sangre:</strong> {selectedAppointment.donor?.userProfile?.blood_type || 'No registrado'}</p>
              <p><strong>Cita:</strong> {formatDate(selectedAppointment.date)} a las {selectedAppointment.time}</p>
            </div>

            <InputField
              label="Peso extraído (gramos/ml)"
              name="weightGrams"
              value={weightGrams}
              onChange={(e) => setWeightGrams(e.target.value)}
              placeholder="Ej: 450"
              type="number"
              min="1"
              max="600"
              required
              disabled={saving}
            />

            <InputField
              label="ID de Dispositivo Balanza (Simulador IoT)"
              name="deviceId"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Ej: IOT-BAL-01"
              disabled={saving}
            />

            <div className="flex flex-col gap-[5px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-txt2">Notas de la extracción</span>
              <textarea
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones adicionales..."
                disabled={saving}
                className="border border-gris2 rounded-[10px] px-[15px] py-3 text-[14px] text-txt bg-gris1 outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,28,50,0.08)] h-20 resize-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
