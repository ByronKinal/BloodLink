export function DashboardActionGrid({ items, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 ${className}`.trim()}>
      {items.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={item.onClick}
          className="bg-white rounded-[12px] px-5 py-4 text-left cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-md border-none"
          style={{ background: item.bg, border: `1px solid ${item.border}` }}
        >
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-3" style={{ background: item.iconBg, border: `1px solid ${item.border}` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: item.accent }} />
          </div>
          <p className="text-[13px] font-semibold mb-[3px]" style={{ color: item.accent }}>
            {item.title}
          </p>
          <p className="text-[11px] text-txt3">{item.desc}</p>
        </button>
      ))}
    </div>
  )
}