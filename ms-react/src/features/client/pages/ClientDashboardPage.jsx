import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../../../shared/components/BrandLogo.jsx'
import { getStoredAuth, clearAuth } from '../../../shared/utils/auth.store.js'

const NAV_ITEMS = [
  { id: 'inicio',     label: 'Inicio',          icon: IconHome },
  { id: 'perfil',     label: 'Mi perfil',        icon: IconUser },
  { id: 'donaciones', label: 'Mis donaciones',   icon: IconDrop },
  { id: 'citas',      label: 'Agendar cita',     icon: IconCalendar },
  { id: 'config',     label: 'Configuración',    icon: IconGear },
]

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}
function IconDrop() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

const BLOOD_TYPE_LABELS = {
  'A+': 'A positivo', 'A-': 'A negativo',
  'B+': 'B positivo', 'B-': 'B negativo',
  'AB+': 'AB positivo', 'AB-': 'AB negativo',
  'O+': 'O positivo', 'O-': 'O negativo',
}

export function ClientDashboardPage() {
  const navigate             = useNavigate()
  const auth                 = getStoredAuth()
  const user                 = auth?.user ?? {}
  const [active, setActive]  = useState('inicio')

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const displayName = user.name || user.username || 'Donante'
  const initials    = (user.name?.[0] ?? '') + (user.surname?.[0] ?? '') || displayName[0]?.toUpperCase() || 'D'

  return (
    <div className="h-screen flex overflow-hidden font-outfit bg-gris1">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-[240px] flex-shrink-0 h-full flex flex-col"
        style={{ background: '#111018', borderRight: '1px solid rgba(184,28,50,0.15)' }}>

        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <BrandLogo />
        </div>

        {/* User card */}
        <div className="px-4 py-4 mx-3 mt-4 rounded-[12px]"
          style={{ background: 'rgba(212,32,64,0.07)', border: '1px solid rgba(212,32,64,0.14)' }}>
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
              <p className="text-[10px] mt-[1px]" style={{ color: '#C8942A' }}>
                {user.bloodType ? BLOOD_TYPE_LABELS[user.bloodType] ?? user.bloodType : 'Donante'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4 space-y-[3px]">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[9px] text-[13px] font-medium transition-all duration-150 border-none cursor-pointer text-left ${
                active === id
                  ? 'text-white'
                  : 'text-[rgba(255,255,255,0.45)] bg-transparent hover:text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
              style={active === id
                ? { background: 'linear-gradient(90deg,rgba(212,32,64,0.2),rgba(212,32,64,0.06))', borderLeft: '2px solid #D42040' }
                : { borderLeft: '2px solid transparent' }
              }
            >
              <span className={active === id ? 'text-rojo-v' : 'inherit'}><Icon /></span>
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[9px] text-[13px] font-medium border-none cursor-pointer transition-all duration-150 hover:bg-[rgba(212,32,64,0.1)]"
            style={{ color: 'rgba(255,100,100,0.65)', background: 'transparent' }}>
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-[64px] bg-blanco flex items-center justify-between px-8 flex-shrink-0"
          style={{ borderBottom: '1px solid #E0DAD0' }}>
          <div>
            <h1 className="text-[16px] font-semibold text-txt">
              {NAV_ITEMS.find(n => n.id === active)?.label ?? 'Dashboard'}
            </h1>
            <p className="text-[11px] text-txt3 font-light">BloodLink · Panel de donante</p>
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

          {active === 'inicio' && <DashboardHome user={user} />}
          {active === 'perfil'     && <PlaceholderSection title="Mi perfil" desc="Próximamente podrás editar tu información personal." />}
          {active === 'donaciones' && <PlaceholderSection title="Mis donaciones" desc="Aquí verás el historial completo de tus donaciones." />}
          {active === 'citas'      && <PlaceholderSection title="Agendar cita" desc="Pronto podrás agendar tu próxima donación desde aquí." />}
          {active === 'config'     && <PlaceholderSection title="Configuración" desc="Ajustes de cuenta y preferencias." />}

        </main>
      </div>
    </div>
  )
}

/* ── Dashboard Home ──────────────────────────────────────────────── */
function DashboardHome({ user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  const stats = [
    { label: 'Donaciones realizadas', value: '—', sub: 'Sin registros aún',          color: '#D42040', bg: 'rgba(212,32,64,0.06)',   border: 'rgba(212,32,64,0.15)' },
    { label: 'Tipo de sangre',         value: user.bloodType ?? '—', sub: user.bloodType ? 'Tu grupo sanguíneo' : 'Sin registrar', color: '#C8942A', bg: 'rgba(200,148,42,0.06)', border: 'rgba(200,148,42,0.18)' },
    { label: 'Próxima cita',           value: '—', sub: 'Sin cita programada',        color: '#2060A0', bg: 'rgba(32,96,160,0.06)',   border: 'rgba(32,96,160,0.15)' },
    { label: 'Zona',                   value: user.zone ?? '—', sub: user.municipality ?? 'Sin ubicación', color: '#28A060', bg: 'rgba(40,160,96,0.06)',   border: 'rgba(40,160,96,0.15)' },
  ]

  return (
    <div>
      {/* Greeting */}
      <div className="mb-7">
        <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">{greeting}</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">
          {user.name ? `${user.name} ${user.surname ?? ''}`.trim() : user.username ?? 'Donante'}
        </h2>
        <p className="text-[13px] text-txt3 font-light mt-1">Bienvenido a tu panel de donante en BloodLink.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[14px] px-5 py-5"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <p className="text-[11px] font-medium mb-2" style={{ color: s.color }}>{s.label}</p>
            <p className="text-[28px] font-bold text-txt leading-none mb-1"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
            <p className="text-[11px] text-txt3">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-7">
        <h3 className="text-[13px] font-semibold text-txt mb-3">Acciones rápidas</h3>
        <div className="flex gap-3">
          <ActionCard
            title="Agendar donación"
            desc="Reservá tu próxima cita"
            color="#D42040"
            bg="rgba(212,32,64,0.05)"
            border="rgba(212,32,64,0.15)"
          />
          <ActionCard
            title="Ver inventario"
            desc="Conocé el stock actual"
            color="#2060A0"
            bg="rgba(32,96,160,0.05)"
            border="rgba(32,96,160,0.12)"
          />
          <ActionCard
            title="Mi historial"
            desc="Revisá tus donaciones"
            color="#28A060"
            bg="rgba(40,160,96,0.05)"
            border="rgba(40,160,96,0.12)"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-[13px] font-semibold text-txt mb-3">Actividad reciente</h3>
        <div className="rounded-[14px] bg-blanco border border-gris2 overflow-hidden">
          <div className="px-5 py-4 border-b border-gris2 flex justify-between items-center">
            <span className="text-[13px] font-medium text-txt">Donaciones</span>
            <span className="text-[11px] text-txt3">Últimas actividades</span>
          </div>
          <div className="px-5 py-10 flex flex-col items-center text-center">
            <div className="text-[32px] mb-3">🩸</div>
            <p className="text-[13px] font-medium text-txt mb-1">Sin actividad aún</p>
            <p className="text-[12px] text-txt3 font-light max-w-[240px]">
              Cuando realices tu primera donación, aparecerá aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title, desc, color, bg, border }) {
  return (
    <button className="flex-1 rounded-[12px] px-4 py-4 text-left cursor-pointer transition-all duration-200 hover:-translate-y-px border-none"
      style={{ background: bg, border: `1px solid ${border}` }}>
      <p className="text-[13px] font-semibold mb-[3px]" style={{ color }}>{title}</p>
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
