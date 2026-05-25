import { useState, useMemo } from 'react'
import { Plane, AlertCircle, AlertTriangle, MessageCircle, Globe } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Flights() {
  const { artists, alerts, lang } = useStore(s => ({ artists: s.artists, alerts: s.alerts, lang: s.lang }))
  const { t } = useI18n(lang)
  const [dir,  setDir]  = useState('all')  // all | in | out
  const [day,  setDay]  = useState('')
  const [search, setSearch] = useState('')

  const allFlights = useMemo(() => {
    const rows = []
    artists.forEach(artist => {
      ;(artist.flightsIn || []).forEach((f, i) => {
        const fAlerts = (alerts||[]).filter(a => a.artistId === artist.id && a.direction === 'in' && a.flightIndex === i)
        rows.push({ artist, flight: f, direction: 'in', fAlerts })
      })
      ;(artist.flightsOut || []).forEach((f, i) => {
        const fAlerts = (alerts||[]).filter(a => a.artistId === artist.id && a.direction === 'out' && a.flightIndex === i)
        rows.push({ artist, flight: f, direction: 'out', fAlerts })
      })
    })
    // Sort by date+time
    return rows.sort((a, b) => {
      const da = (a.flight.date || '') + (a.flight.departure || a.flight.arrival || '')
      const db = (b.flight.date || '') + (b.flight.departure || b.flight.arrival || '')
      return da.localeCompare(db)
    })
  }, [artists, alerts])

  const filtered = useMemo(() => {
    let list = allFlights
    if (dir !== 'all') list = list.filter(r => r.direction === dir)
    if (day)    list = list.filter(r => r.flight.date?.includes(day))
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.artist.name.toLowerCase().includes(q) ||
        r.flight.flightNo?.toLowerCase().includes(q) ||
        r.flight.from?.toLowerCase().includes(q) ||
        r.flight.to?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allFlights, dir, day, search])

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div>
        <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('flights')}</h1>
        <p className="text-xs text-earth-stone">{filtered.length} {lang === 'pt' ? 'voos' : 'flights'}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <div className="flex bg-q-850 border border-q-750 rounded-lg overflow-hidden">
          {[['all', lang === 'pt' ? 'Todos' : 'All'], ['in', lang === 'pt' ? '→ Chegada' : '→ In'], ['out', lang === 'pt' ? 'Saída →' : 'Out →']].map(([v, label]) => (
            <button key={v} onClick={() => setDir(v)}
              className={`px-3 py-1.5 text-xs transition-all ${dir === v ? 'bg-q-750 text-q-300 font-medium' : 'text-earth-stone hover:text-earth-cream'}`}
            >{label}</button>
          ))}
        </div>
        <select value={day} onChange={e => setDay(e.target.value)} className="input text-xs py-1.5">
          <option value="">{lang === 'pt' ? 'Todos os dias' : 'All days'}</option>
          {['02/06','03/06','04/06','05/06','06/06','07/06','08/06'].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'pt' ? 'Buscar artista, voo...' : 'Search artist, flight...'}
          className="input text-xs py-1.5 flex-1 min-w-[160px]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-q-750">
              {['', lang === 'pt' ? 'Artista' : 'Artist', lang === 'pt' ? 'Voo' : 'Flight', lang === 'pt' ? 'Rota' : 'Route', lang === 'pt' ? 'Data' : 'Date', lang === 'pt' ? 'Horários' : 'Times', lang === 'pt' ? 'Tipo' : 'Type', lang === 'pt' ? 'Contato' : 'Contact', ''].map((h, i) => (
                <th key={i} className="text-left py-2 px-2 text-earth-stone font-medium text-[10px] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ artist, flight, direction, fAlerts }, i) => {
              const hasRed = fAlerts.some(a => a.level === 'red')
              const hasYellow = fAlerts.some(a => a.level === 'yellow')
              return (
                <tr key={i} className={`border-b border-q-800 hover:bg-q-850 transition-all ${hasRed ? 'bg-earth-terra/5' : hasYellow ? 'bg-earth-gold/5' : ''}`}>
                  {/* Direction */}
                  <td className="py-2 px-2">
                    {direction === 'in'
                      ? <Plane size={12} className="rotate-[315deg] text-earth-sage" />
                      : <Plane size={12} className="rotate-45 text-earth-terra" />
                    }
                  </td>
                  {/* Artist */}
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1">
                      <span className="text-earth-cream font-medium">{artist.name}</span>
                      {artist.isInternational && <Globe size={10} className="text-purple-400" />}
                    </div>
                  </td>
                  {/* Flight no */}
                  <td className="py-2 px-2">
                    <span className="font-mono text-earth-sand">{flight.flightNo || '—'}</span>
                  </td>
                  {/* Route */}
                  <td className="py-2 px-2 text-earth-stone">
                    {flight.from} → {flight.to}
                  </td>
                  {/* Date */}
                  <td className="py-2 px-2 text-earth-stone">{flight.date || '—'}</td>
                  {/* Times */}
                  <td className="py-2 px-2">
                    <span className="text-earth-stone">{flight.departure || '—'}</span>
                    {flight.arrival && <span className="text-earth-sand"> → {flight.arrival}</span>}
                  </td>
                  {/* Type */}
                  <td className="py-2 px-2">
                    {flight.isInternational
                      ? <span className="text-[9px] bg-purple-900/40 text-purple-300 rounded px-1.5 py-0.5">INTL</span>
                      : <span className="text-[9px] bg-q-800 text-earth-stone rounded px-1.5 py-0.5">DOM</span>
                    }
                  </td>
                  {/* Contact */}
                  <td className="py-2 px-2">
                    {artist.contact?.phone && (
                      <a href={`https://wa.me/55${artist.contact.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-earth-sage hover:text-earth-sage/70">
                        <MessageCircle size={10} />{artist.contact.phone}
                      </a>
                    )}
                  </td>
                  {/* Alert */}
                  <td className="py-2 px-2">
                    {hasRed && <AlertCircle size={12} className="text-earth-terra" />}
                    {!hasRed && hasYellow && <AlertTriangle size={12} className="text-earth-gold" />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-earth-stone">
            <Plane size={28} className="mx-auto mb-2 opacity-30" />
            <p>{lang === 'pt' ? 'Nenhum voo encontrado' : 'No flights found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
