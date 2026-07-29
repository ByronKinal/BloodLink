import { useEffect } from 'react'

const TONE_STYLES = {
  success: 'border-[rgba(40,160,96,0.3)] bg-[rgba(40,160,96,0.95)] text-white',
  error: 'border-[rgba(212,32,64,0.3)] bg-[rgba(212,32,64,0.95)] text-white',
}

export function Toast({ message, tone = 'success', onDismiss, duration = 3500 }) {
  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onDismiss])

  if (!message) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4 sm:justify-end sm:right-6 sm:left-auto">
      <div
        className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${TONE_STYLES[tone]}`}
        role="status"
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="text-[12px] font-bold opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
