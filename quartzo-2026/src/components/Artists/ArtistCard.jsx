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

function CheckRow({ checks = [] }) {
  const done = checks.filter(Boolean).length
  if (checks.length === 0) return null
  return (
    <div className="flex items-center gap-1">
      {checks.map((c, i) => (
        c ? <CheckCircle2 key={i} size={10} className="text-earth-sage" />
          : <Circle key={i} size={10} className="text-earth-stone/30" />
      ))}
      <span className="text-[10px] font-semibold text-earth-stone ml-1">{done}/{checks.length}</span>
    </div>
  )
}

export default function ArtistCard({ artist }) {
  const [open, setOpen] = useState(false)
  const alerts  = useStore(s => s.getAlerts())
  const missing = getMissingDots(artist)

  const artistAlerts = (alerts || []).filter(a => a.artistId === artist.id)
  const alertLv = artistAlerts.some(a => a.level === 'red') ? 'red'
                : artistAlerts.some(a => a.level === 'yellow') ? 'yellow'
                : null

  const firstSet    = artist.sets?.[0]
  const hasIn       = artist.flightsIn?.length > 0
  const hasOut      = artist.flightsOut?.length > 0
  const checkValues = artist.checks ? Object.values(artist.checks) : []

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="card card-hover text-left relative flex flex-col gap-2 min-h-[110px]"
      >
        {/* Alert strip top */}
        {alertLv && (
          <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${alertLv === 'red' ? 'bg-earth-terra' : 'bg-earth-gold'}`} />
        )}

        {/* Name row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-earth-cream text-sm truncate leading-tight">
                {artist.name}
              </h3>
              {artist.isInternational && <Globe size={11} className="text-purple-400 shrink-0" />}
            </div>
            {firstSet && (
              <p className="text-xs text-earth-stone mt-0.5 font-medium truncate">
                {firstSet.day} · {firstSet.stage}
                {artist.sets?.length > 1 && <span className="text-q-400 ml-1">+{artist.sets.length - 1}</span>}
              </p>
            )}
          </div>

          {/* Status dots */}
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            {missing.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-earth-gold animate-pulse-slow" title={`Faltando: ${missing.join(', ')}`} />
            )}
            {alertLv === 'red'    && <AlertCircle  size={13} className="text-earth-terra" />}
            {alertLv === 'yellow' && <AlertTriangle size={13} className="text-earth-gold" />}
          </div>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-1">
          {artist.hotel && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-q-800 text-earth-sand rounded-md px-2 py-0.5 border border-q-700">
              <Hotel size={9} />
              {artist.hotel.replace('CAMINHO CACHOEIRA','C.CACHOEIRA').replace('BAMBU BRASIL','BAMBU')}
            </span>
          )}
          {hasIn && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-q-800 text-earth-sage rounded-md px-2 py-0.5 border border-q-700">
              <Plane size={9} className="rotate-[315deg]" />{artist.flightsIn[0].flightNo || 'IN'}
            </span>
          )}
          {hasOut && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-q-800 text-earth-terra/80 rounded-md px-2 py-0.5 border border-q-700">
              <Plane size={9} className="rotate-45" />{artist.flightsOut[0].flightNo || 'OUT'}
            </span>
          )}
        </div>

        {/* Checks + WA */}
        <div className="flex items-center justify-between mt-auto">
          <CheckRow checks={checkValues} />
          {artist.contact?.phone && (
            <span
              onClick={e => { e.stopPropagation(); window.open(`https://wa.me/55${artist.contact.phone.replace(/\D/g,'')}`) }}
              className="flex items-center gap-1 text-[10px] font-semibold text-earth-sage hover:text-earth-sage/70 ml-auto"
            >
              <MessageCircle size={10} />WA
            </span>
          )}
        </div>

        {/* Language tag */}
        {artist.language && artist.language !== 'PT' && (
          <div className="absolute bottom-2 right-2">
            <span className="text-[9px] font-bold bg-purple-900/40 text-purple-300 rounded px-1.5 py-0.5 uppercase">{artist.language}</span>
          </div>
        )}
      </button>

      <ArtistModal open={open} onClose={() => setOpen(false)} artist={artist} />
    </>
  )
}
