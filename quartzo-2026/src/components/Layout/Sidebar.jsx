import { useStore } from '../../store'
import { useI18n } from '../../i18n'
import {
  LayoutDashboard, Users, Plane, Car, Hotel, Clock,
  Truck, Settings, LogOut, Globe, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { id: 'dashboard',  icon: LayoutDashboard },
  { id: 'artists',    icon: Users },
  { id: 'flights',    icon: Plane },
  { id: 'transfers',  icon: Car },
  { id: 'hotels',     icon: Hotel },
  { id: 'timetable',  icon: Clock },
  { id: 'drivers',    icon: Truck },
  { id: 'settings',   icon: Settings },
]

export default function Sidebar() {
  const { page, setPage, lang, setLang, logout, currentUser } = useStore(s => ({
    page: s.page, setPage: s.setPage, lang: s.lang, setLang: s.setLang,
    logout: s.logout, currentUser: s.currentUser,
  }))
  const { t } = useI18n(lang)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`flex flex-col bg-q-900 border-r border-q-750 transition-all duration-300 ${collapsed ? 'w-14' : 'w-48'} min-h-screen shrink-0`}>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-3 py-4 border-b border-q-750 ${collapsed ? 'justify-center' : ''}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 shrink-0">
          <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#C8973A" strokeWidth="1.5" opacity="0.6"/>
          <polygon points="20,10 30,16 30,24 20,30 10,24 10,16" fill="#C8973A" opacity="0.85"/>
        </svg>
        {!collapsed && (
          <div>
            <div className="font-display text-xs tracking-[0.15em] text-earth-cream">QUARTZO</div>
            <div className="text-[9px] text-earth-stone tracking-wider">LOG 2026</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-1.5">
        {NAV.map(({ id, icon: Icon }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => setPage(id)}
              title={collapsed ? t(id) : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all
                ${active ? 'bg-q-750 text-q-300' : 'text-earth-stone hover:text-earth-cream hover:bg-q-800'}
                ${collapsed ? 'justify-center' : ''}`}>
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{t(id)}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-q-750 p-2 space-y-1">
        {/* Language */}
        <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-earth-stone hover:text-earth-cream hover:bg-q-800 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Globe size={14} className="shrink-0" />
          {!collapsed && <span>{lang === 'pt' ? 'English' : 'Português'}</span>}
        </button>

        {/* Logout — só se estiver logado */}
        {currentUser && (
          <button onClick={logout}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-earth-stone hover:text-earth-terra hover:bg-q-800 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={14} className="shrink-0" />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
        )}

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-earth-stone hover:text-earth-cream hover:bg-q-800 transition-all ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span className="text-[10px]">{t('collapse')}</span></>}
        </button>
      </div>
    </aside>
  )
}
