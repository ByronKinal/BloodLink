export function BrandLogo({ iconClass = 'w-10 h-10 rounded-[10px]', compact = false }) {
  return (
    <div className={`flex items-center group ${compact ? '' : 'gap-[13px]'}`}>

      <div
        className={`${iconClass} flex items-center justify-center text-xl relative overflow-hidden transition-transform duration-300 group-hover:scale-105`}
        style={{
          background: 'linear-gradient(135deg,#D42040 0%,#B81C32 100%)',
          boxShadow: '0 0 16px rgba(184,28,50,0.55), 0 0 36px rgba(184,28,50,0.18)',
        }}
      >
        <span className="relative z-10 animate-blink">🩸</span>
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>

      {compact ? null : (
        <div className="transition-transform duration-300 group-hover:translate-x-[2px]">
          <div className="font-cormorant text-[22px] leading-none font-medium tracking-[0.01em]">
            <span className="text-blanco">Blood</span>
            <span
              className="text-rojo-v"
              style={{ textShadow: '0 0 18px rgba(212,32,64,0.5)' }}
            >
              Link
            </span>
          </div>
          <div className="flex items-center gap-[5px] mt-[3px]">
            <div className="w-[14px] h-px bg-oro/50 rounded-full" />
            <div className="text-[9px] text-oro tracking-[0.14em] uppercase">Banco de Sangre</div>
          </div>
        </div>
      )}

    </div>
  )
}
