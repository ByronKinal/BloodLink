export function EmployeeCriticalStockAlert({ criticalBloodTypes }) {
  if (criticalBloodTypes.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-[14px] border border-[rgba(40,160,96,0.2)] bg-[rgba(40,160,96,0.06)] px-4 py-3">
        <span className="text-[18px] leading-none">✅</span>
        <p className="text-[13px] font-medium text-verde-v">Inventario de sangre en niveles saludables.</p>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-[rgba(212,32,64,0.25)] bg-[rgba(212,32,64,0.07)] px-4 py-4">
      <span className="text-[20px] leading-none">🚨</span>
      <div>
        <p className="text-[13px] font-bold text-rojo">Alerta de inventario crítico</p>
        <p className="mt-1 text-[12px] text-txt3">
          {criticalBloodTypes.length} tipo{criticalBloodTypes.length === 1 ? '' : 's'} de sangre en escasez:{' '}
          <span className="font-semibold text-rojo">
            {criticalBloodTypes.map((item) => `${item.bloodType} (${item.disponibleBags})`).join(', ')}
          </span>
        </p>
      </div>
    </div>
  )
}
