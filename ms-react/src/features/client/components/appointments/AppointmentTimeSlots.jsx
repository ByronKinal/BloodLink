const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

export function AppointmentTimeSlots({ selectedTime, onSelectTime, disabled, bookedTimes = [] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {TIME_SLOTS.map((time) => {
        const isBooked = bookedTimes.includes(time)

        return (
          <button
            key={time}
            type="button"
            disabled={disabled || isBooked}
            onClick={() => onSelectTime(time)}
            title={isBooked ? 'Horario no disponible' : undefined}
            className={`rounded-[10px] border px-3 py-2 text-[13px] font-medium transition-colors disabled:cursor-not-allowed ${
              isBooked
                ? 'border-gris2 bg-gray-300 text-gris3 opacity-50 pointer-events-none'
                : selectedTime === time
                  ? 'border-rojo bg-rojo text-white'
                  : 'border-gris2 bg-white text-txt hover:border-rojo hover:text-rojo disabled:opacity-50'
            }`}
          >
            {time}
          </button>
        )
      })}
    </div>
  )
}
