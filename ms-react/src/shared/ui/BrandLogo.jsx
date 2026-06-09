export function BrandLogo({ iconClass = 'w-10 h-10 rounded-[10px]' }) {
  return (
    <div className="flex items-center gap-[13px]">
      <div className={`${iconClass} bg-rojo flex items-center justify-center text-xl shadow-[0_0_16px_rgba(184,28,50,0.5)]`}>
        🩸
      </div>
      <div>
        <div className="font-cormorant text-[22px] text-blanco leading-none">HemoVida</div>
        <div className="text-[9px] text-oro tracking-[0.12em] uppercase mt-0.5">Banco de Sangre</div>
      </div>
    </div>
  )
}
