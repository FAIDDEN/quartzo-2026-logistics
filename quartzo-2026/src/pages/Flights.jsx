import { useState, useMemo } from 'react'
import { Plane, AlertCircle, AlertTriangle, MessageCircle, Globe } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Flights() {
  const { artists, lang } = useStore(s => ({ artists: s.artists, lang: s.lang }))
  const alerts = useStore(s => s.getAlerts())
  const { t } = useI18n(lang)
  const [dir,    setDir]    = useState('all')
  const [day,    setDay]    = useState('')
  const [search, setSearch] = useState('')

  const allFlights = useMemo(() => {
    const rows = []
    artists.forEach(artist => {
      ;(artist.flightsIn||[]).forEach((f,i) => {
        const fAlerts = (alerts||[]).filter(a=>a.artistId===artist.id&&a.direction==='in'&&a.flightIndex===i)
        rows.push({ artist, flight:f, direction:'in', fAlerts })
      })
      ;(artist.flightsOut||[]).forEach((f,i) => {
        const fAlerts = (alerts||[]).filter(a=>a.artistId===artist.id&&a.direction==='out'&&a.flightIndex===i)
        rows.push({ artist, flight:f, direction:'out', fAlerts })
      })
    })
    return rows.sort((a,b)=>((a.flight.date||'')+(a.flight.departure||a.flight.arrival||'')).localeCompare((b.flight.date||'')+(b.flight.departure||b.flight.arrival||'')))
  }, [artists, alerts])

  const filtered = useMemo(() => {
    let list = allFlights
    if (dir!=='all') list = list.filter(r=>r.direction===dir)
    if (day)    list = list.filter(r=>r.flight.date?.includes(day))
    if (search) { const q=search.toLowerCase(); list=list.filter(r=>r.artist.name.toLowerCase().includes(q)||r.flight.flightNo?.toLowerCase().includes(q)) }
    return list
  }, [allFlights, dir, day, search])

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="font-display text-xl tracking-widest text-earth-cream font-semibold">Voos</h1>
        <p className="text-xs text-earth-stone font-medium">{filtered.length} voos</p>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex bg-q-850 border border-q-750 rounded-xl overflow-hidden">
          {[['all','Todos'],['in','→ Chegada'],['out','Saída →']].map(([v,label]) => (
            <button key={v} onClick={()=>setDir(v)}
              className={`flex-1 py-2.5 text-sm font-bold transition-all ${dir===v?'bg-q-750 text-q-300':'text-earth-stone'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select value={day} onChange={e=>setDay(e.target.value)} className="input text-sm py-2.5">
            <option value="">Todos os dias</option>
            {['02/06','03/06','04/06','05/06','06/06','07/06','08/06'].map(d=><option key={d}>{d}</option>)}
          </select>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="input text-sm py-2.5 flex-1"/>
        </div>
      </div>

      {/* Cards — mobile friendly */}
      <div className="space-y-2">
        {filtered.map(({ artist, flight, direction, fAlerts }, i) => {
          const hasRed    = fAlerts.some(a=>a.level==='red')
          const hasYellow = fAlerts.some(a=>a.level==='yellow')
          return (
            <div key={i} className={`card border ${hasRed?'border-earth-terra/40':hasYellow?'border-earth-gold/40':'border-q-700'} ${hasRed?'bg-earth-terra/5':hasYellow?'bg-earth-gold/5':''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {direction==='in'
                    ? <Plane size={14} className="rotate-[315deg] text-earth-sage shrink-0"/>
                    : <Plane size={14} className="rotate-45 text-earth-terra shrink-0"/>}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-earth-cream">{artist.name}</span>
                      {artist.isInternational && <Globe size={11} className="text-purple-400"/>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-sm font-bold text-q-300">{flight.flightNo || '—'}</span>
                      <span className="text-xs text-earth-stone">{flight.from} → {flight.to}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-earth-cream">{flight.date || '—'}</div>
                  <div className="text-xs text-earth-stone">{flight.departure || ''}  {flight.arrival ? `→ ${flight.arrival}` : ''}</div>
                </div>
              </div>
              {/* Alerts */}
              {fAlerts.map((al,j) => (
                <div key={j} className={`flex items-center gap-2 mt-2 pt-2 border-t border-q-800 text-xs font-semibold ${al.level==='red'?'text-earth-terra':'text-earth-gold'}`}>
                  {al.level==='red'?<AlertCircle size={12}/>:<AlertTriangle size={12}/>} {al.message}
                </div>
              ))}
              {/* Contact */}
              {artist.contact?.phone && (
                <a href={`https://wa.me/55${artist.contact.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-earth-sage mt-2">
                  <MessageCircle size={11}/>{artist.contact.phone}
                </a>
              )}
            </div>
          )
        })}
        {filtered.length===0 && (
          <div className="text-center py-12 text-earth-stone">
            <Plane size={28} className="mx-auto mb-2 opacity-30"/>
            <p className="font-semibold">Nenhum voo encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
