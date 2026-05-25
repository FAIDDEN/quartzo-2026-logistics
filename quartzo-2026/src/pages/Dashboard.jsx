import { useMemo } from 'react'
import { Users, Plane, Hotel, AlertCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import ArtistCard from '../components/Artists/ArtistCard'

const EVENT_DAYS = [
  { key:'03/06', label:'WELCOME',       color:'text-earth-sage',  border:'border-earth-sage/30',  bg:'bg-earth-sage/10'  },
  { key:'04/06', label:'AMETISTA',      color:'text-purple-400',  border:'border-purple-500/30',  bg:'bg-purple-500/10'  },
  { key:'05/06', label:'JADE',          color:'text-green-400',   border:'border-green-500/30',   bg:'bg-green-500/10'   },
  { key:'06/06', label:'AFTER / ÁGATA', color:'text-q-300',       border:'border-q-500/30',       bg:'bg-q-300/10'       },
]

export default function Dashboard() {
  const { artists, lang } = useStore(s => ({ artists: s.artists, lang: s.lang }))
  const alerts = useStore(s => s.getAlerts())
  const { t } = useI18n(lang)

  const stats = useMemo(() => ({
    total:          artists.length,
    withFlight:     artists.filter(a => a.flightsIn?.length || a.flightsOut?.length).length,
    withHotel:      artists.filter(a => a.hotel).length,
    redAlerts:      (alerts||[]).filter(a => a.level==='red').length,
    yellowAlerts:   (alerts||[]).filter(a => a.level==='yellow').length,
    checksComplete: artists.filter(a => { const v=Object.values(a.checks||{}); return v.length>0&&v.every(Boolean) }).length,
  }), [artists, alerts])

  const criticalAlerts  = (alerts||[]).filter(a => a.level==='red').slice(0,5)
  const arrivingArtists = artists.filter(a =>
    a.flightsIn?.some(f => ['04/06','05/06','06/06'].some(d => f.date?.includes(d)))
  ).slice(0,6)

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">

      {/* Title — hidden on mobile (sidebar has logo) */}
      <div className="hidden md:block">
        <h1 className="font-display text-2xl tracking-[0.1em] text-earth-cream font-semibold">QUARTZO 2026</h1>
        <p className="text-sm text-earth-stone mt-1 font-medium tracking-widest">
          SINCRONICIDADE · 03–06 JUN · CHAPADA DOS VEADEIROS
        </p>
      </div>

      {/* Stats — 2 cols mobile, 6 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon:Users,         value:stats.total,          label:t('totalArtists'),    color:'text-earth-cream'  },
          { icon:Plane,         value:stats.withFlight,     label:t('withFlights'),     color:'text-earth-sage'   },
          { icon:Hotel,         value:stats.withHotel,      label:t('withHotel'),       color:'text-q-300'        },
          { icon:CheckCircle2,  value:stats.checksComplete, label:t('checksComplete'),  color:'text-earth-sage'   },
          { icon:AlertCircle,   value:stats.redAlerts,      label:t('criticalAlerts'),  color:'text-earth-terra'  },
          { icon:AlertTriangle, value:stats.yellowAlerts,   label:t('warnings'),        color:'text-earth-gold'   },
        ].map(({ icon:Icon, value, label, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <Icon size={18} className={`${color} shrink-0`} />
            <div className="min-w-0">
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-[11px] font-semibold text-earth-stone leading-tight">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Event days — 2x2 mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EVENT_DAYS.map(day => {
          const dayArtists = artists.filter(a => a.sets?.some(s => s.day===day.key))
          return (
            <div key={day.key} className={`card border ${day.border}`}>
              <div className="text-[10px] font-bold text-earth-stone tracking-widest">{day.key}</div>
              <div className={`font-display text-sm tracking-wider ${day.color} mt-1 mb-2 font-semibold leading-tight`}>{day.label}</div>
              <div className="text-lg text-earth-cream font-bold">
                {dayArtists.length}
                <span className="text-xs text-earth-stone font-medium ml-1">{lang==='pt'?'artistas':'artists'}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {dayArtists.slice(0,3).map(a => (
                  <span key={a.id} className="text-[9px] font-semibold bg-q-800 text-earth-sand rounded px-1.5 py-0.5 truncate max-w-[70px]">{a.name}</span>
                ))}
                {dayArtists.length>3 && <span className="text-[9px] font-bold text-earth-stone">+{dayArtists.length-3}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Critical alerts */}
      {criticalAlerts.length>0 && (
        <div>
          <p className="section-title mb-2 flex items-center gap-2">
            <AlertCircle size={12} className="text-earth-terra" /> Alertas Críticos
          </p>
          <div className="space-y-2">
            {criticalAlerts.map((al,i) => (
              <div key={i} className="bg-earth-terra/10 border border-earth-terra/25 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertCircle size={14} className="text-earth-terra shrink-0 mt-0.5"/>
                <p className="text-sm leading-snug">
                  <span className="font-bold text-earth-cream">{al.artistName}: </span>
                  <span className="text-earth-sand">{al.message}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming arrivals */}
      {arrivingArtists.length>0 && (
        <div>
          <p className="section-title mb-3 flex items-center gap-2">
            <Clock size={12} className="text-q-300" /> Chegadas Próximas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {arrivingArtists.map(a => <ArtistCard key={a.id} artist={a}/>)}
          </div>
        </div>
      )}
    </div>
  )
}
