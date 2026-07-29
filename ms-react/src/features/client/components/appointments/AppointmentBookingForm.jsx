import { useEffect, useState } from 'react'
import { AppointmentCalendar } from './AppointmentCalendar.jsx'
import { AppointmentTimeSlots } from './AppointmentTimeSlots.jsx'
import { useAppointmentAvailability } from '../../hooks/useAppointmentAvailability.js'

export function AppointmentBookingForm({ creating, onBook }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const { bookedTimes, loadingAvailability } = useAppointmentAvailability(selectedDate)

  useEffect(() => {
    if (selectedTime && bookedTimes.includes(selectedTime)) {
      setSelectedTime('')
    }
  }, [bookedTimes, selectedTime])

  const canSubmit = Boolean(selectedDate && selectedTime) && !creating

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleSubmit = async () => {
    const success = await onBook(selectedDate, selectedTime)
    if (success) {
      setSelectedDate('')
      setSelectedTime('')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-txt3">1. Elegí una fecha</h3>
        <AppointmentCalendar selectedDate={selectedDate} onSelectDate={handleSelectDate} disabled={creating} />
      </div>

      <div>
        <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-txt3">
          2. Elegí un horario
          {loadingAvailability ? <span className="normal-case font-normal text-txt3"> · verificando disponibilidad...</span> : null}
        </h3>
        {selectedDate ? (
          <AppointmentTimeSlots
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            disabled={creating}
            bookedTimes={bookedTimes}
          />
        ) : (
          <p className="text-[12px] text-txt3">Selecciona primero una fecha.</p>
        )}
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-rojo bg-rojo px-6 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {creating ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {creating ? 'Agendando...' : 'Confirmar cita'}
      </button>
    </div>
  )
}
