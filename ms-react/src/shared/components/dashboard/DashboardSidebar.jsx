import { BrandLogo } from '../BrandLogo.jsx'
import { UserAvatar } from '../UserAvatar.jsx'

export function DashboardSidebar({
  user,
  displayName,
  initials,
  roleLabel,
  navItems,
  activeId,
  onNavigate,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  sidebarClassName = '',
  sidebarStyle,
  userCardStyle,
  accent = '#D42040',
  logoutTone = 'rgba(255,100,100,0.65)',
  onProfileClick,
  mobileOpen = false,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-pointer backdrop-blur-[1px]"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] transform flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen h-full flex-shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[82px]' : 'lg:w-[240px]'} ${sidebarClassName}`}
        style={sidebarStyle}
      >
        <div className={`flex items-center border-b ${collapsed ? 'justify-center px-4 py-5' : 'justify-between px-6 py-5'}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="group flex items-center justify-center border-none bg-transparent p-0 cursor-pointer"
            aria-label={collapsed ? 'Expandir panel' : 'Contraer panel'}
            title={collapsed ? 'Expandir panel' : 'Contraer panel'}
          >
            <BrandLogo compact={collapsed} />
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg border-none bg-transparent text-white/50 hover:text-white cursor-pointer"
              aria-label="Cerrar menú"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={onProfileClick}
          className={`mx-3 mt-4 rounded-[12px] ${collapsed ? 'px-3 py-4' : 'px-4 py-4'} border-none text-left cursor-pointer transition-all duration-150 hover:brightness-110`}
          style={{ ...userCardStyle, cursor: 'pointer' }}
          title="Configurar perfil"
        >
          <div className="flex items-center gap-3">
            <UserAvatar
              src={user?.profilePicture}
              displayName={displayName}
              className="w-9 h-9"
            />

            {collapsed ? null : (
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
                <div className="flex items-center gap-[5px] mt-[2px]">
                  <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: accent }} />
                  <p className="text-[10px] font-medium" style={{ color: accent }}>
                    {roleLabel}
                  </p>
                </div>
              </div>
            )}
          </div>
        </button>

        <nav className={`flex-1 mt-4 space-y-[2px] ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeId === id

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onNavigate(id)
                  if (onCloseMobile) onCloseMobile()
                }}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-0 gap-0' : 'gap-3 px-3'} py-[10px] rounded-[9px] text-[13px] font-medium transition-all duration-150 border-none cursor-pointer text-left ${
                  isActive
                    ? 'text-white'
                    : 'text-[rgba(255,255,255,0.42)] bg-transparent hover:text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
                title={collapsed ? label : undefined}
                aria-label={label}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(90deg,rgba(212,32,64,0.22),rgba(212,32,64,0.05))',
                        borderLeft: '2px solid #D42040',
                      }
                    : { borderLeft: '2px solid transparent' }
                }
              >
                <span style={{ color: isActive ? accent : 'inherit' }}>
                  <Icon />
                </span>
                {collapsed ? null : label}
              </button>
            )
          })}
        </nav>

      <div className={`pb-5 pt-3 border-t ${collapsed ? 'px-2' : 'px-3'}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-0 gap-0' : 'gap-3 px-3'} py-[10px] rounded-[9px] text-[13px] font-medium border-none cursor-pointer transition-all duration-150 hover:bg-[rgba(212,32,64,0.1)]`}
          style={{ color: logoutTone, background: 'transparent' }}
          title={collapsed ? 'Cerrar sesión' : undefined}
          aria-label="Cerrar sesión"
        >
          <IconLogout />
          {collapsed ? null : 'Cerrar sesión'}
        </button>
      </div>
    </aside>
    </>
  )
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}