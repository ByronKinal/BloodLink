import { useEffect, useState } from 'react'
import { fetchAvailability } from '../../../shared/api/appointments.api.js'

export function useAppointmentAvailability(selectedDate) {
  const [bookedTimes, setBookedTimes] = useState([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  useEffect(() => {
    if (!selectedDate) {
      setBookedTimes([])
      return undefined
    }

    let cancelled = false
    setLoadingAvailability(true)

    fetchAvailability(selectedDate)
      .then((response) => {
        if (!cancelled) {
          setBookedTimes(response.data?.bookedTimes ?? [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBookedTimes([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingAvailability(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedDate])

  return { bookedTimes, loadingAvailability }
}
