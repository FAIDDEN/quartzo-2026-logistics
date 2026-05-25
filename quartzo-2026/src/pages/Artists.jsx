import { useState, useMemo } from 'react'
import { Filter, X, ChevronDown, Plus, UserPlus } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import ArtistCard from '../components/Artists/ArtistCard'
import ArtistForm from '../components/Artists/ArtistForm'

const DAYS   = ['03/06','04/06','05/06','06/06']
const STAGES = ['MAINSTAGE','ALQUIMIA','BÉSAME','AFTER','WELCOME']
const HOTELS = ['BAGUA','CAMINHO CACHOEIRA','BAMBU BRASIL','COLOCADO']
const STATUS = [
  { value:'all',      label:'Todos'          },
  { value:'missing',  label:'Info faltando'  },
  { value:'alerts',   label:'Com alerta'     },
  { value:'complete', label:'Completo'       },
  { value:'intl',     label:'Internacional'  },
]

export default function Artists() {
  const { artists, currentUser, lang } = useStore(s => ({
    artists: s.artists, currentUser: s.currentUser, lang: s.lang,
  }))
  const alerts = useStore(s => s.getAlerts())

  const [search,       setSearch]       = useState('')
  const [day,          setDay]          = useState('')
  const [stage,        setStage]        = useState('')
  const [hotel,        setHotel]        = useState('')
  const [status,       setStatus]       = useState('all')
  const [showFilters,  setShowFilters]  = useState(false)
  const [showNewForm,  setShowNewForm]  = useState(false)

  const isAdmin = currentUser?.role === 'admin'

  const filtered = useMemo(() => {
    let list = artists
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.hotel?.toLowerCase().includes(q) ||
        a.contact?.name?.toLowerCase().includes(q)
      )
    }
    if (day)   list = list.filter(a => a.sets?.some(s => s.day === day))
    if (stage) list = list.filter(a => a.sets?.some(s => s.stage === stage))
    if (hotel) list = hotel==='COLOCADO' ? list.filter(a=>a.accommodationType==='C'||a.accommodationType==='colocado') : list.filter(a=>a.hotel===hotel)
    if (status==='missing')  list = list.filter(a => (a.accommodationType?.includes('H')&&!a.hotel)||(a.accommodationType?.includes('T')&&!a.flightsIn?.length))
    if (status==='alerts')   list = list.filter(a => (alerts||[]).some(al=>al.artistId===a.id))
    if (status==='complete') list = list.filter(a => { const v=Object.values(a.checks||{}); return v.length>0&&v.every(Boolean) })
    if (status==='intl')     list = list.filter(a => a.isInternational)
    return list
  }, [artists, alerts, search, day, stage, hotel, status])

  const activeFilters = [day,stage,hotel,status!=='all'?status:''].filter(Boolean).length

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl tracking-widest text-earth-cream font-semibold">Artistas</h1>
          <p className="text-xs text-earth-stone font-medium mt-0.5">
            {filtered.length}{artists.length!==filtered.length ? ` / ${artists.length}` : ''} artistas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* NEW ARTIST BUTTON — admin only */}
          {isAdmin && (
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-q-300 hover:bg-q-200 text-q-950 text-sm font-bold rounded-xl transition-all"
            >
              <Plus size={16}/> <span className="hidden sm:inline">Novo artista</span>
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold border transition-all
              ${showFilters||activeFilters>0 ? 'bg-q-750 border-q-500 text-q-300' : 'bg-q-850 border-q-750 text-earth-stone'}`}
          >
            <Filter size={14}/>
            <span className="hidden sm:inline">Filtros</span>
            {activeFilters>0 && <span className="bg-q-300 text-q-950 rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold">{activeFilters}</span>}
            <ChevronDown size={14} className={`transition-transform ${showFilters?'rotate-180':''}`}/>
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="🔍  Buscar artista, hotel, responsável..."
        className="input text-base py-3 font-medium"
      />

      {/* Filters */}
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
                {STATUS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          {activeFilters>0 && (
            <button onClick={()=>{setDay('');setStage('');setHotel('');setStatus('all')}}
              className="flex items-center gap-1.5 text-sm font-semibold text-earth-stone hover:text-earth-terra">
              <X size={13}/>Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Admin hint when no artists */}
      {filtered.length===0 && isAdmin && (
        <div className="text-center py-12">
          <UserPlus size={40} className="mx-auto mb-4 text-earth-stone/30"/>
          <p className="text-base font-semibold text-earth-stone">Nenhum artista encontrado</p>
          <p className="text-sm text-earth-stone/60 mt-1 mb-4">Suba uma planilha ou cadastre manualmente</p>
          <button onClick={()=>setShowNewForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-q-300 text-q-950 font-bold rounded-xl text-sm">
            <Plus size={16}/> Cadastrar primeiro artista
          </button>
        </div>
      )}

      {filtered.length===0 && !isAdmin && (
        <div className="text-center py-12 text-earth-stone">
          <p className="font-semibold">Nenhum artista encontrado</p>
          <p className="text-sm mt-1 opacity-60">Tente ajustar os filtros</p>
        </div>
      )}

      {/* Artist grid */}
      {filtered.length>0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(a => (
            <ArtistCard key={a.id} artist={a}/>
          ))}
        </div>
      )}

      {/* New artist form */}
      <ArtistForm open={showNewForm} onClose={()=>setShowNewForm(false)}/>
    </div>
  )
}
