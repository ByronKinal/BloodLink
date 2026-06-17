import { UserAvatar } from '../UserAvatar.jsx'

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
}) {
  return (
    <header
      className={`h-[64px] bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 ${topbarClassName}`}
      style={{ borderBottom: '1px solid #E8E4EE', ...topbarStyle }}
    >
      <div>
        <h1 className="text-[16px] font-semibold text-txt">{title}</h1>
        <p className="text-[11px] text-txt3 font-light">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gris2 bg-transparent cursor-pointer hover:border-rojo hover:text-rojo transition-colors text-txt3">
          <IconBell />
        </button>

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