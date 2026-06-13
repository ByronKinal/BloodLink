import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../../../shared/components/BrandLogo.jsx'
import { getStoredAuth, clearAuth } from '../../../shared/utils/auth.store.js'

const NAV_ITEMS = [
  { id: 'inicio',     label: 'Inicio',        icon: IconHome },
  { id: 'usuarios',  label: 'Usuarios',       icon: IconUsers },
  { id: 'donaciones',label: 'Donaciones',     icon: IconDrop },
  { id: 'inventario',label: 'Inventario',     icon: IconBox },
  { id: 'reportes',  label: 'Reportes',       icon: IconChart },
  { id: 'config',    label: 'Configuración',  icon: IconGear },
]

function IconHome() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function IconDrop() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  )
}
function IconBox() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}
function IconGear() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

const ROLE_LABEL = { ADMIN_ROLE: 'Administrador', STAFF_ROLE: 'Personal' }

export function AdminDashboardPage() {
  const navigate            = useNavigate()
  const auth                = getStoredAuth()
  const user                = auth?.user ?? {}
  const [active, setActive] = useState('inicio')

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const displayName = user.name || user.username || 'Admin'
  const initials    = (user.name?.[0] ?? '') + (user.surname?.[0] ?? '') || displayName[0]?.toUpperCase() || 'A'
  const roleLabel   = ROLE_LABEL[user.role] ?? 'Admin'

  return (
    <div className="h-screen flex overflow-hidden font-outfit">

      {/* ── Sidebar oscuro ──────────────────────────────────── */}
      <aside className="w-[240px] flex-shrink-0 h-full flex flex-col"
        style={{ background: '#111018', borderRight: '1px solid rgba(212,32,64,0.12)' }}>

        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <BrandLogo />
        </div>

        {/* Admin badge */}
        <div className="px-4 py-4 mx-3 mt-4 rounded-[12px]"
          style={{ background: 'rgba(212,32,64,0.08)', border: '1px solid rgba(212,32,64,0.2)' }}>
          <div className="flex items-center gap-3">
            {user.profilePicture
              ? <img src={user.profilePicture} alt={displayName}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              : <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)' }}>
                  {initials}
                </div>
            }
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
              <div className="flex items-center gap-[5px] mt-[2px]">
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: '#D42040' }} />
                <p className="text-[10px] font-medium" style={{ color: '#D42040' }}>{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4 space-y-[2px]">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[9px] text-[13px] font-medium transition-all duration-150 border-none cursor-pointer text-left ${
                active === id
                  ? 'text-white'
                  : 'text-[rgba(255,255,255,0.42)] bg-transparent hover:text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
              style={active === id
                ? { background: 'linear-gradient(90deg,rgba(212,32,64,0.22),rgba(212,32,64,0.05))', borderLeft: '2px solid #D42040' }
                : { borderLeft: '2px solid transparent' }
              }
            >
              <span style={{ color: active === id ? '#D42040' : 'inherit' }}><Icon /></span>
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[9px] text-[13px] font-medium border-none cursor-pointer transition-all duration-150 hover:bg-[rgba(212,32,64,0.1)]"
            style={{ color: 'rgba(255,120,120,0.6)', background: 'transparent' }}>
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main claro ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F3F8]">

        {/* Topbar */}
        <header className="h-[64px] bg-white flex items-center justify-between px-8 flex-shrink-0"
          style={{ borderBottom: '1px solid #E8E4EE' }}>
          <div>
            <h1 className="text-[16px] font-semibold text-txt">
              {NAV_ITEMS.find(n => n.id === active)?.label ?? 'Dashboard'}
            </h1>
            <p className="text-[11px] text-txt3 font-light">BloodLink · Panel de administración</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gris2 bg-transparent cursor-pointer hover:border-rojo hover:text-rojo transition-colors text-txt3">
              <IconBell />
            </button>
            <div className="flex items-center gap-[10px]">
              {user.profilePicture
                ? <img src={user.profilePicture} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                : <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#D42040,#B81C32)' }}>
                    {initials}
                  </div>
              }
              <div>
                <p className="text-[13px] font-medium text-txt leading-none">{displayName}</p>
                <p className="text-[10px] text-txt3 mt-[2px]">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-7">
          {active === 'inicio'     && <AdminHome user={user} />}
          {active === 'usuarios'   && <PlaceholderSection title="Usuarios" desc="Gestión de usuarios registrados en BloodLink." />}
          {active === 'donaciones' && <PlaceholderSection title="Donaciones" desc="Registro y seguimiento de donaciones." />}
          {active === 'inventario' && <PlaceholderSection title="Inventario" desc="Control de stock de sangre por tipo." />}
          {active === 'reportes'   && <PlaceholderSection title="Reportes" desc="Generación de reportes y estadísticas." />}
          {active === 'config'     && <PlaceholderSection title="Configuración" desc="Ajustes del sistema." />}
        </main>
      </div>
    </div>
  )
}

/* ── Admin Home ──────────────────────────────────────────────────── */
function AdminHome({ user }) {
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  const stats = [
    {
      label: 'Total usuarios',
      value: '—',
      sub: 'Registrados',
      accent: '#B81C32',
      iconBg: 'rgba(184,28,50,0.1)',
      border: 'rgba(184,28,50,0.18)',
      top: '#B81C32',
    },
    {
      label: 'Donaciones hoy',
      value: '—',
      sub: 'En el día',
      accent: '#C8942A',
      iconBg: 'rgba(200,148,42,0.1)',
      border: 'rgba(200,148,42,0.2)',
      top: '#C8942A',
    },
    {
      label: 'Inventario crítico',
      value: '—',
      sub: 'Tipos con bajo stock',
      accent: '#2060A0',
      iconBg: 'rgba(32,96,160,0.1)',
      border: 'rgba(32,96,160,0.18)',
      top: '#2060A0',
    },
    {
      label: 'Solicitudes pendientes',
      value: '—',
      sub: 'Por atender',
      accent: '#28A060',
      iconBg: 'rgba(40,160,96,0.1)',
      border: 'rgba(40,160,96,0.18)',
      top: '#28A060',
    },
  ]

  return (
    <div>
      {/* Greeting */}
      <div className="mb-7">
        <p className="text-[10px] font-bold text-rojo tracking-[0.14em] uppercase mb-1">{greeting}</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">
          {user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Admin'}
        </h2>
        <p className="text-[13px] text-txt3 font-light mt-1">Panel de administración de BloodLink.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-[14px] overflow-hidden"
            style={{ border: `1px solid ${s.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* colored top strip */}
            <div className="h-[4px]" style={{ background: s.accent }} />
            <div className="px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3"
                style={{ color: s.accent }}>{s.label}</p>
              <p className="text-[34px] font-bold text-txt leading-none mb-1"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
              <p className="text-[11px] text-txt3">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-7">
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <div className="flex gap-3">
          <AdminActionCard
            title="Registrar donación"
            desc="Nueva entrada de donación"
            accent="#B81C32"
            iconBg="rgba(184,28,50,0.07)"
            border="rgba(184,28,50,0.14)"
          />
          <AdminActionCard
            title="Actualizar inventario"
            desc="Modificar stock de sangre"
            accent="#C8942A"
            iconBg="rgba(200,148,42,0.07)"
            border="rgba(200,148,42,0.16)"
          />
          <AdminActionCard
            title="Ver reportes"
            desc="Estadísticas y métricas"
            accent="#2060A0"
            iconBg="rgba(32,96,160,0.07)"
            border="rgba(32,96,160,0.14)"
          />
        </div>
      </div>

      {/* Recent users table */}
      <div>
        <h3 className="text-[13px] font-semibold text-txt mb-3">Usuarios recientes</h3>
        <div className="bg-white rounded-[14px] overflow-hidden"
          style={{ border: '1px solid #E8E4EE', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div className="grid grid-cols-4 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-txt3"
            style={{ borderBottom: '1px solid #EEE8F0', background: '#FAFAF8' }}>
            <span>Nombre</span>
            <span>Correo</span>
            <span>Tipo de sangre</span>
            <span>Estado</span>
          </div>
          <div className="px-5 py-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(184,28,50,0.07)', border: '1px solid rgba(184,28,50,0.15)' }}>
              <span className="text-[20px]">🩸</span>
            </div>
            <p className="text-[13px] font-medium text-txt mb-1">Sin usuarios registrados</p>
            <p className="text-[12px] text-txt3 font-light">Los nuevos registros aparecerán aquí.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminActionCard({ title, desc, accent, iconBg, border }) {
  return (
    <button className="flex-1 bg-white rounded-[12px] px-5 py-4 text-left cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-md border-none"
      style={{ border: `1px solid ${border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-3"
        style={{ background: iconBg, border: `1px solid ${border}` }}>
        <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
      </div>
      <p className="text-[13px] font-semibold text-txt mb-[3px]">{title}</p>
      <p className="text-[11px] text-txt3">{desc}</p>
    </button>
  )
}

function PlaceholderSection({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center pt-20">
      <div className="text-[40px] mb-4">🚧</div>
      <h2 className="font-cormorant text-[28px] font-medium text-txt mb-2">{title}</h2>
      <p className="text-[13px] text-txt3 font-light max-w-[300px]">{desc}</p>
    </div>
  )
}
