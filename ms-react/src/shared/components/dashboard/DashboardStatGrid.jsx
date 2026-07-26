export function DashboardStatGrid({ items, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`.trim()}>
      {items.map((item) => {
        const content = (
          <div
            key={item.label}
            className="bg-white rounded-[14px] overflow-hidden"
            style={{ border: `1px solid ${item.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="h-[4px]" style={{ background: item.accent }} />
            <div className="px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: item.accent }}>
                {item.label}
              </p>
              <p className="text-[34px] font-bold text-txt leading-none mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {item.value}
              </p>
              <p className="text-[11px] text-txt3">{item.sub}</p>
            </div>
          </div>
        )

        if (typeof item.onClick === 'function') {
          return (
            <button key={item.label} type="button" onClick={item.onClick} className="p-0 m-0 text-left cursor-pointer">
              {content}
            </button>
          )
        }

        return content
      })}
    </div>
  )
}
