function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gris2" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-gris2" />
        <div className="h-2 w-1/5 rounded bg-gris2" />
      </div>
      <div className="h-6 w-20 rounded-full bg-gris2" />
    </div>
  )
}

export function StaffAgendaSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={index > 0 ? 'border-t border-gris2' : ''}>
          <SkeletonRow />
        </div>
      ))}
    </div>
  )
}
