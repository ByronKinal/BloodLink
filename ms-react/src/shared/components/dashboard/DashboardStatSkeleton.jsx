export function DashboardStatSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[14px] border border-gris2 bg-white overflow-hidden"
        >
          <div className="h-[4px] bg-gris2" />
          <div className="px-5 py-5 space-y-3">
            <div className="h-2.5 w-2/3 rounded bg-gris2" />
            <div className="h-6 w-1/2 rounded bg-gris2" />
            <div className="h-2 w-1/3 rounded bg-gris2" />
          </div>
        </div>
      ))}
    </div>
  )
}
