export function DashboardEmptyState({ icon = '🚧', title, description, className = '', onClick, }) {
  const iconContent = (
    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-[rgba(184,28,50,0.07)] border border-[rgba(184,28,50,0.15)]">
      <span className="text-[20px]">{icon}</span>
    </div>
  )

  return (
    <div className={`px-5 py-10 flex flex-col items-center text-center ${className}`.trim()}>
      {onClick ? (
        <button type="button" onClick={onClick} className="p-0 m-0 bg-transparent border-none cursor-pointer">
          {iconContent}
        </button>
      ) : (
        iconContent
      )}

      <p className="text-[13px] font-medium text-txt mb-1">{title}</p>
      <p className="text-[12px] text-txt3 font-light max-w-[280px]">{description}</p>
    </div>
  )
}
