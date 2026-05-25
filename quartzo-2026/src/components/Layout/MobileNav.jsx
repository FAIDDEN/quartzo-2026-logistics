import { useStore } from '../../store'
import { useI18n } from '../../i18n'
import {
  LayoutDashboard, Users, Plane, Hotel, Clock, MoreHorizontal,
  Car, Truck, Settings, X
} from 'lucide-react'
import { useState } from 'react'

// Main 4 tabs always visible + "More" for the rest
const MAIN_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: { pt: 'Início',    en: 'Home'      } },
  { id: 'artists',   icon: Users,           label: { pt: 'Artistas',  en: 'Artists'   } },
  { id: 'flights',   icon: Plane,           label: { pt: 'Voos',      en: 'Flights'   } },
  { id: 'hotels',    icon: Hotel,           label: { pt: 'Hotéis',    en: 'Hotels'    } },
]

const MORE_NAV = [
  { id: 'transfers', icon: Car,      label: { pt: 'Traslados',     en: 'Transfers'  } },
  { id: 'timetable', icon: Clock,    label: { pt: 'Time Table',    en: 'Time Table' } },
  { id: 'drivers',   icon: Truck,    label: { pt: 'Motoristas',    en: 'Drivers'    } },
  { id: 'settings',  icon: Settings, label: { pt: 'Configurações', en: 'Settings'   } },
]

export default function MobileNav() {
  const { page, setPage, lang } = useStore(s => ({
    page: s.page, setPage: s.setPage, lang: s.lang,
  }))
  const { t } = useI18n(lang)
  const [showMore, setShowMore] = useState(false)

  const isMoreActive = MORE_NAV.some(n => n.id === page)

  return (
    <>
      {/* More drawer */}
      {showMore && (
        <div className="fixed inset-0 z-[180]" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-q-900 border-t border-q-750 rounded-t-2xl shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-earth-stone">Menu</span>
              <button onClick={() => setShowMore(false)} className="p-1.5 rounded-lg bg-q-800">
                <X size={14} className="text-earth-stone" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {MORE_NAV.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setPage(id); setShowMore(false) }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all
                    ${page === id ? 'bg-q-750 text-q-300' : 'bg-q-850 text-earth-sand hover:bg-q-800'}`}
                >
                  <Icon size={18} className="shrink-0" />
                  {label[lang] || label.pt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-q-900 border-t border-q-750 flex items-center z-[170] safe-bottom">
        {MAIN_NAV.map(({ id, icon: Icon, label }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 h-full transition-all
                ${active ? 'text-q-300' : 'text-earth-stone'}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold leading-none ${active ? 'text-q-300' : 'text-earth-stone'}`}>
                {label[lang] || label.pt}
              </span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 bg-q-300 rounded-full" />}
            </button>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 h-full transition-all
            ${isMoreActive ? 'text-q-300' : 'text-earth-stone'}`}
        >
          <MoreHorizontal size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-semibold leading-none">Mais</span>
        </button>
      </nav>
    </>
  )
}
