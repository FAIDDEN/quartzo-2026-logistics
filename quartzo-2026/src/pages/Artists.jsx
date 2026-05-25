import { useState, useMemo } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import ArtistCard from '../components/Artists/ArtistCard'

const DAYS   = ['03/06','04/06','05/06','06/06']
const STAGES = ['MAINSTAGE','ALQUIMIA','BÉSAME','AFTER','WELCOME']
const HOTELS = ['BAGUA','CAMINHO CACHOEIRA','BAMBU BRASIL','COLOCADO']
const STATUS = [
  { value:'all',      label:{pt:'Todos',         en:'All'          }},
  { value:'missing',  label:{pt:'Info faltando', en:'Missing info' }},
  { value:'alerts',   label:{pt:'Com alerta',    en:'Has alert'    }},
  { value:'complete', label:{pt:'Completo',      en:'Complete'     }},
  { value:'intl',     label:{pt:'Internacional', en:'International'}},
]

export default function Artists() {
  const { artists, currentUser, lang } = useStore(s => ({
    artists: s.artists, currentUser: s.currentUser, lang: s.lang,
  }))
  const alerts = useStore(s => s.getAlerts())
  const { t } = useI18n(lang)

  const [search,      setSearch]      = useState('')
  const [day,         setDay]         = useState('')
  const [stage,       setStage]       = useState('')
  const [hotel,       setHotel]       = useState('')
  const [status,      setStatus]      = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = artists
    if (search) { const q=search.toLowerCase(); list=list.filter(a=>a.name?.toLowerCase().includes(q)||a.hotel?.toLowerCase().includes(q)||a.contact?.name?.toLowerCase().includes(q)) }
    if (day)    list = list.filter(a => a.sets?.some(s=>s.day===day))
    if (stage)  list = list.filter(a => a.sets?.some(s=>s.stage===stage))
    if (hotel)  list = hotel==='COLOCADO' ? list.filter(a=>a.accommodationType==='C') : list.filter(a=>a.hotel===hotel)
    if (status==='missing')  list = list.filter(a=>(a.accommodationType?.includes('H')&&!a.hotel)||(a.accommodationType?.includes('T')&&!a.flightsIn?.length))
    if (status==='alerts')   list = list.filter(a=>(alerts||[]).some(al=>al.artistId===a.id))
    if (status==='complete') list = list.filter(a=>{ const v=Object.values(a.checks||{}); return v.length>0&&v.every(Boolean) })
    if (status==='intl')     list = list.filter(a=>a.isInternational)
    return list
  }, [artists, alerts, search, day, stage, hotel, status])

  const activeFilters = [day,stage,hotel,status!=='all'?status:''].filter(Boolean).length

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl tracking-widest text-earth-cream font-semibold">Artistas</h1>
          <p className="text-xs text-earth-stone font-medium mt-0.5">
            {filtered.length}{artists.length!==filtered.length?` / ${artists.length}`:''} artistas
          </p>
        </div>
        <button onClick={()=>setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border transition-all
            ${showFilters||activeFilters>0 ? 'bg-q-750 border-q-500 text-q-300' : 'bg-q-850 border-q-750 text-earth-stone'}`}>
          <Filter size={14}/>
          Filtros
          {activeFilters>0 && <span className="bg-q-300 text-q-950 rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold">{activeFilters}</span>}
          <ChevronDown size={14} className={`transition-transform ${showFilters?'rotate-180':''}`}/>
        </button>
      </div>

      {/* Search bar — large touch target */}
      <input
        value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="🔍  Buscar artista, hotel..."
        className="input text-base py-3 font-medium"
      />

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-q-850 border border-q-700 rounded-2xl p-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Dia</label>
              <select value={day} onChange={e=>setDay(e.target.value)} className="input text-sm py-2.5 mt-1">
                <option value="">Todos</option>
                {DAYS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Palco</label>
              <select value={stage} onChange={e=>setStage(e.target.value)} className="input text-sm py-2.5 mt-1">
                <option value="">Todos</option>
                {STAGES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Hotel</label>
              <select value={hotel} onChange={e=>setHotel(e.target.value)} className="input text-sm py-2.5 mt-1">
                <option value="">Todos</option>
                {HOTELS.map(h=><option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="input text-sm py-2.5 mt-1">
                {STATUS.map(s=><option key={s.value} value={s.value}>{s.label[lang]}</option>)}
              </select>
            </div>
          </div>
          <button onClick={()=>{setDay('');setStage('');setHotel('');setStatus('all')}}
            className="flex items-center gap-1.5 text-sm font-semibold text-earth-stone hover:text-earth-terra">
            <X size={13}/>Limpar filtros
          </button>
        </div>
      )}

      {/* Grid — 1 col mobile, 2 sm, 3 md, 4 lg */}
      {filtered.length===0 ? (
        <div className="text-center py-16 text-earth-stone">
          <p className="text-base font-semibold">Nenhum artista encontrado</p>
          <p className="text-sm mt-1 opacity-60">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(a => <ArtistCard key={a.id} artist={a}/>)}
        </div>
      )}
    </div>
  )
}
