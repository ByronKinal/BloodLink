export function AlertBar() {
  const handleDonateNow = () => {
    document.querySelector('#agendar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="px-16 py-[11px] flex items-center gap-[14px] border-b border-rojo-v/40"
      style={{ background: 'linear-gradient(90deg, #8A0C1E 0%, #B81C32 40%, #B81C32 60%, #8A0C1E 100%)' }}
    >
      <div className="w-2 h-2 rounded-full bg-rojo-med flex-shrink-0 animate-blink" />

      <p className="flex-1 text-[13.5px] text-rojo-med">
        <strong className="text-white font-medium">Urgente:</strong>{' '}
        El inventario de tipo O⁻ está por debajo del nivel crítico. Se necesitan donantes hoy en todas las sedes.
      </p>

      <button
        onClick={handleDonateNow}
        className="alert-btn relative bg-white text-rojo border-none rounded-[7px] px-[18px] py-[7px] text-xs font-semibold cursor-pointer font-outfit transition-all duration-200 whitespace-nowrap hover:bg-rojo-pal hover:shadow-[0_0_12px_rgba(255,255,255,0.3)]"
      >
        Quiero donar ahora
      </button>
    </div>
  )
}
