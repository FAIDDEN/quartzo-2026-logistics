import { useState } from 'react'
import { Plane, Hotel, Car, Globe, AlertTriangle, AlertCircle, CheckCircle2, Circle, MessageCircle } from 'lucide-react'
import { useStore } from '../../store'
import ArtistModal from './ArtistModal'

function getMissingDots(artist) {
  const missing = []
  if (artist.accommodationType?.includes('H') && !artist.hotel) missing.push('hotel')
  if (artist.accommodationType?.includes('T') && !artist.flightsIn?.length) missing.push('flight-in')
  if (!artist.sets?.length) missing.push('set')
  return missing
}

function getAlertLevel(artist, alerts) {
  const artistAlerts = (alerts || []).filter(a => a.artistId === artist.id)
  if (artistAlerts.some(a => a.level === 'red')) return 'red'
  if (artistAlerts.some(a => a.level === 'yellow')) return 'yellow'
  return null
}

function CheckRow({ checks = [] }) {
  const total = checks.length
  const done  = checks.filter(Boolean).length
  if (total === 0) return null
  return (
    <div className="flex items-center gap-1">
      {checks.map((c, i) => (
        <span key={i}>
          {c ? <CheckCircle2 size={10} className="text-earth-sage" /> : <Circle size={10} className="text-earth-stone/40" />}
        </span>
      ))}
      <span className="text-[10px] text-earth-stone ml-1">{done}/{total}</span>
    </div>
  )
}

export default function ArtistCard({ artist }) {
  const [open, setOpen] = useState(false)
  const alerts  = useStore(s => s.alerts)
  const missing = getMissingDots(artist)
  const alertLv = getAlertLevel(artist, alerts)
  const firstSet = artist.sets?.[0]
  const hasIn  = artist.flightsIn?.length > 0
  const hasOut = artist.flightsOut?.length > 0
  const checkValues = artist.checks ? Object.values(artist.checks) : []

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="card text-left hover:border-q-500 hover:shadow-lg hover:shadow-q-950/60 transition-all group relative"
      >
        {/* Alert indicator strip */}
        {alertLv && (
          <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${alertLv === 'red' ? 'bg-earth-terra' : 'bg-earth-gold'}`} />
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-earth-cream text-sm truncate group-hover:text-q-200 transition-colors">
                {artist.name}
              </h3>
              {artist.isInternational && (
                <Globe size={11} className="text-badge-intl shrink-0 text-purple-400" />
              )}
            </div>
            {firstSet && (
              <p className="text-[11px] text-earth-stone mt-0.5 truncate">
                {firstSet.day} · {firstSet.stage}
                {artist.sets?.length > 1 && <span className="text-q-400 ml-1">+{artist.sets.length - 1}</span>}
              </p>
            )}
          </div>

          {/* Missing + alert icons */}
          <div className="flex items-center gap-1 shrink-0">
            {missing.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-earth-gold/70 animate-pulse-slow" title={`Faltando: ${missing.join(', ')}`} />
            )}
            {alertLv === 'red' && <AlertCircle size={13} className="text-earth-terra" />}
            {alertLv === 'yellow' && <AlertTriangle size={13} className="text-earth-gold" />}
          </div>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {artist.hotel && (
            <span className="flex items-center gap-1 text-[10px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5">
              <Hotel size={9} />{artist.hotel.replace('CAMINHO CACHOEIRA','C.CACHOEIRA').replace('BAMBU BRASIL','BAMBU')}
            </span>
          )}
          {hasIn && (
            <span className="flex items-center gap-1 text-[10px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5">
              <Plane size={9} className="rotate-[315deg]" />{artist.flightsIn[0].flightNo || '—'}
            </span>
          )}
          {hasOut && (
            <span className="flex items-center gap-1 text-[10px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5">
              <Plane size={9} className="rotate-45" />{artist.flightsOut[0].flightNo || '—'}
            </span>
          )}
          {artist.transfersAero?.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5">
              <Car size={9} />✓
            </span>
          )}
        </div>

        {/* Checks + contact */}
        <div className="flex items-center justify-between">
          <CheckRow checks={checkValues} />
          {artist.contact?.phone && (
            <span
              onClick={e => { e.stopPropagation(); window.open(`https://wa.me/55${artist.contact.phone.replace(/\D/g,'')}`) }}
              className="flex items-center gap-1 text-[10px] text-earth-sage hover:text-earth-sage/80"
            >
              <MessageCircle size={10} />WA
            </span>
          )}
        </div>

        {/* Language tag */}
        {artist.language && artist.language !== 'PT' && (
          <div className="absolute bottom-2 right-2">
            <span className="text-[9px] bg-purple-900/40 text-purple-300 rounded px-1.5 py-0.5 uppercase">{artist.language}</span>
          </div>
        )}
      </button>

      <ArtistModal open={open} onClose={() => setOpen(false)} artist={artist} />
    </>
  )
}
