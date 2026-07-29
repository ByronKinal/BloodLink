import { UserAvatar } from '../UserAvatar.jsx'

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

export function DashboardTopbar({
  title,
  subtitle,
  displayName,
  email,
  initials,
  profilePicture,
  topbarClassName = '',
  topbarStyle,
  onProfileClick,
  onMenuToggle,
}) {
  return (
    <header
      className={`h-[64px] bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 ${topbarClassName}`}
      style={{ borderBottom: '1px solid #E8E4EE', ...topbarStyle }}
    >
      <div className="flex items-center gap-3">
        {onMenuToggle ? (
          <button
            onClick={onMenuToggle}
            type="button"
            className="lg:hidden p-1.5 rounded-lg border border-gris2 bg-transparent cursor-pointer hover:border-rojo hover:text-rojo transition-colors text-txt3"
            aria-label="Abrir menú"
          >
            <IconMenu />
          </button>
        ) : null}
        <div>
          <h1 className="text-[16px] font-semibold text-txt">{title}</h1>
          <p className="text-[11px] text-txt3 font-light">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onProfileClick}
          className="flex items-center gap-[10px] hover:bg-gris1 p-1.5 rounded-lg transition-all duration-150 cursor-pointer border-none bg-transparent text-left"
          title="Configurar perfil"
        >
          <UserAvatar
            src={profilePicture}
            displayName={displayName}
            className="w-8 h-8"
          />

          <div>
            <p className="text-[13px] font-medium text-txt leading-none">{displayName}</p>
            <p className="text-[10px] text-txt3 mt-[2px]">{email}</p>
          </div>
        </button>
      </div>
    </header>
  )
}