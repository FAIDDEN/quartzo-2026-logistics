import { useMemo } from 'react'
import { Users, Plane, Hotel, AlertCircle, AlertTriangle, CheckCircle2, Clock, Car } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import ArtistCard from '../components/Artists/ArtistCard'

const EVENT_DAYS = [
  { key: '03/06', label: 'WELCOME',  color: 'text-earth-sage' },
  { key: '04/06', label: 'AMETISTA', color: 'text-purple-400' },
  { key: '05/06', label: 'JADE',     color: 'text-green-400' },
  { key: '06/06', label: 'AFTER / ÁGATA', color: 'text-q-300' },
]

export default function Dashboard() {
  const { artists, alerts, lang } = useStore(s => ({
    artists: s.artists, alerts: s.alerts, lang: s.lang,
  }))
  const { t } = useI18n(lang)

  const stats = useMemo(() => {
    const total = artists.length
    const withFlight = artists.filter(a => a.flightsIn?.length || a.flightsOut?.length).length
    const withHotel  = artists.filter(a => a.hotel).length
    const redAlerts  = (alerts || []).filter(a => a.level === 'red').length
    const yellowAlerts = (alerts || []).filter(a => a.level === 'yellow').length
    const checksComplete = artists.filter(a => {
      const vals = Object.values(a.checks || {})
      return vals.length > 0 && vals.every(Boolean)
    }).length
    return { total, withFlight, withHotel, redAlerts, yellowAlerts, checksComplete }
  }, [artists, alerts])

  // Artists arriving today (or nearest day)
  const today = '04/06' // near-event default for demo
  const arrivingToday = artists.filter(a =>
    a.flightsIn?.some(f => f.date?.includes('04/06') || f.date?.includes('05/06') || f.date?.includes('06/06'))
  ).slice(0, 6)

  const criticalAlerts = (alerts || []).filter(a => a.level === 'red').slice(0, 5)

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-display text-xl tracking-[0.1em] text-earth-cream">QUARTZO 2026</h1>
        <p className="text-xs text-earth-stone mt-0.5 tracking-widest">SINCRONICIDADE · 03–06 JUN · FAZENDA ÁGUA FRIA</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Users,        value: stats.total,        label: t('totalArtists'),   color: 'text-earth-cream' },
          { icon: Plane,        value: stats.withFlight,   label: t('withFlights'),    color: 'text-earth-sage' },
          { icon: Hotel,        value: stats.withHotel,    label: t('withHotel'),      color: 'text-q-300' },
          { icon: CheckCircle2, value: stats.checksComplete,label: t('checksComplete'), color: 'text-earth-sage' },
          { icon: AlertCircle,  value: stats.redAlerts,    label: t('criticalAlerts'), color: 'text-earth-terra' },
          { icon: AlertTriangle,value: stats.yellowAlerts, label: t('warnings'),       color: 'text-earth-gold' },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <Icon size={18} className={`${color} shrink-0`} />
            <div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-earth-stone leading-tight">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Event days timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EVENT_DAYS.map(day => {
          const dayArtists = artists.filter(a => a.sets?.some(s => s.day === day.key))
          return (
            <div key={day.key} className="card">
              <div className="text-[10px] text-earth-stone mb-1">{day.key}</div>
              <div className={`font-display text-sm tracking-widest ${day.color} mb-2`}>{day.label}</div>
              <div className="text-xs text-earth-cream font-bold">{dayArtists.length} <span className="text-earth-stone font-normal">{lang === 'pt' ? 'artistas' : 'artists'}</span></div>
              <div className="mt-2 flex flex-wrap gap-1">
                {dayArtists.slice(0, 4).map(a => (
                  <span key={a.id} className="text-[9px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5 truncate max-w-[80px]">{a.name}</span>
                ))}
                {dayArtists.length > 4 && (
                  <span className="text-[9px] text-earth-stone">+{dayArtists.length - 4}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Critical alerts */}
      {criticalAlerts.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-earth-terra mb-2 flex items-center gap-1.5">
            <AlertCircle size={13} />{lang === 'pt' ? 'Alertas Críticos' : 'Critical Alerts'}
          </h2>
          <div className="space-y-2">
            {criticalAlerts.map((al, i) => (
              <div key={i} className="bg-earth-terra/10 border border-earth-terra/25 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertCircle size={13} className="text-earth-terra shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-earth-cream font-medium">{al.artistName}: </span>
                  <span className="text-xs text-earth-sand">{al.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artists grid — upcoming arrivals */}
      {arrivingToday.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-earth-cream mb-3 flex items-center gap-1.5">
            <Clock size={13} className="text-q-300" />
            {lang === 'pt' ? 'Chegadas Próximas' : 'Upcoming Arrivals'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {arrivingToday.map(a => <ArtistCard key={a.id} artist={a} />)}
          </div>
        </div>
      )}
    </div>
  )
}
