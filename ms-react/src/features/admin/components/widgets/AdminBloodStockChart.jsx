import { CRITICAL_STOCK_THRESHOLD_BAGS } from '../../../../shared/utils/bloodStock.js'

function BloodTypeRow({ bloodType, summary }) {
  const total = summary?.totalBags ?? 0
  const available = summary?.disponibleBags ?? 0
  const percentage = total > 0 ? Math.min(100, Math.round((available / total) * 100)) : 0
  const isCritical = available <= CRITICAL_STOCK_THRESHOLD_BAGS

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between text-[12px] mb-1">
        <span className="font-semibold text-txt">{bloodType}</span>
        <span className={isCritical ? 'font-semibold text-rojo' : 'text-txt3'}>
          {available} / {total} bolsas
        </span>
      </div>
      <div className="h-[6px] w-full rounded-full bg-gris2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isCritical ? '#B81C32' : 'linear-gradient(90deg, #28A060, #2EC47A)',
          }}
        />
      </div>
    </div>
  )
}

export function AdminBloodStockChart({ byBloodType }) {
  const entries = Object.entries(byBloodType ?? {})

  if (entries.length === 0) {
    return <p className="px-5 py-6 text-[12px] text-txt3">Sin datos de inventario disponibles.</p>
  }

  return (
    <div className="divide-y divide-gris2">
      {entries.map(([bloodType, summary]) => (
        <BloodTypeRow key={bloodType} bloodType={bloodType} summary={summary} />
      ))}
    </div>
  )
}
