export function DashboardSectionCard({
  title,
  subtitle,
  children,
  className = '',
  cardClassName = 'bg-white border border-gris2 shadow-[0_2px_8px_rgba(0,0,0,0.05)]',
  headerRight,
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-txt">{title}</h3>
          {subtitle ? <p className="text-[11px] text-txt3 mt-[2px]">{subtitle}</p> : null}
        </div>
        {headerRight}
      </div>

      <div className={`rounded-[14px] overflow-hidden ${cardClassName}`.trim()}>{children}</div>
    </div>
  )
}