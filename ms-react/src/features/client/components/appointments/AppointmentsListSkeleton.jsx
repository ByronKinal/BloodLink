function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="h-3 w-24 rounded bg-gris2" />
      <div className="h-3 w-16 rounded bg-gris2" />
      <div className="ml-auto h-6 w-20 rounded-full bg-gris2" />
    </div>
  )
}

export function AppointmentsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-56 animate-pulse rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]" />
      <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={index > 0 ? 'border-t border-gris2' : ''}>
            <SkeletonRow />
          </div>
        ))}
      </div>
    </div>
  )
}
