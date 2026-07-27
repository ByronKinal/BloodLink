import { useState } from 'react'

const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function toDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export function AppointmentCalendar({ selectedDate, onSelectDate, disabled }) {
  const today = startOfToday()
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const goToMonth = (delta) => setVisibleMonth(new Date(year, month + delta, 1))

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          disabled={disabled}
          className="rounded-[10px] border border-gris2 bg-white px-3 py-1.5 text-[13px] text-txt hover:border-rojo hover:text-rojo disabled:cursor-not-allowed disabled:opacity-50"
        >
          ‹
        </button>
        <p className="text-[13px] font-semibold text-txt">{MONTH_LABELS[month]} {year}</p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          disabled={disabled}
          className="rounded-[10px] border border-gris2 bg-white px-3 py-1.5 text-[13px] text-txt hover:border-rojo hover:text-rojo disabled:cursor-not-allowed disabled:opacity-50"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-txt3 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />
          }

          const dateObj = new Date(year, month, day)
          const dateKey = toDateKey(year, month, day)
          const isPast = dateObj < today
          const isSelected = dateKey === selectedDate

          return (
            <button
              key={dateKey}
              type="button"
              disabled={disabled || isPast}
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square rounded-[10px] text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                isSelected ? 'bg-rojo text-white' : 'bg-gris1 text-txt hover:bg-[rgba(184,28,50,0.08)]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
