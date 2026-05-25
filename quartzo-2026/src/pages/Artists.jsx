import { useState, useMemo } from 'react'
import { Filter, X, UserPlus } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import ArtistCard from '../components/Artists/ArtistCard'

const DAYS    = ['03/06', '04/06', '05/06', '06/06']
const STAGES  = ['MAINSTAGE', 'ALQUIMIA', 'BÉSAME', 'AFTER', 'WELCOME']
const HOTELS  = ['BAGUA', 'CAMINHO CACHOEIRA', 'BAMBU BRASIL', 'COLOCADO']
const STATUSES = [
  { value: 'all',       label: { pt: 'Todos',          en: 'All'         }},
  { value: 'missing',   label: { pt: 'Info faltando',  en: 'Missing info'}},
  { value: 'alerts',    label: { pt: 'Com alerta',     en: 'Has alert'   }},
  { value: 'complete',  label: { pt: 'Completo',       en: 'Complete'    }},
  { value: 'intl',      label: { pt: 'Internacional',  en: 'International'}},
]

export default function Artists() {
  const { artists, alerts, currentUser, lang } = useStore(s => ({
    artists: s.artists, alerts: s.alerts, currentUser: s.currentUser, lang: s.lang,
  }))
  const { t } = useI18n(lang)

  const [search,  setSearch]  = useState('')
  const [day,     setDay]     = useState('')
  const [stage,   setStage]   = useState('')
  const [hotel,   setHotel]   = useState('')
  const [status,  setStatus]  = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = artists
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.contact?.name?.toLowerCase().includes(q) ||
        a.hotel?.toLowerCase().includes(q)
      )
    }
    if (day)   list = list.filter(a => a.sets?.some(s => s.day === day))
    if (stage) list = list.filter(a => a.sets?.some(s => s.stage === stage))
    if (hotel) {
      if (hotel === 'COLOCADO') list = list.filter(a => a.accommodationType === 'C')
      else list = list.filter(a => a.hotel === hotel)
    }
    if (status === 'missing')  list = list.filter(a => {
      return (a.accommodationType?.includes('H') && !a.hotel) ||
             (a.accommodationType?.includes('T') && !a.flightsIn?.length) ||
             !a.sets?.length
    })
    if (status === 'alerts')   list = list.filter(a => (alerts||[]).some(al => al.artistId === a.id))
    if (status === 'complete') list = list.filter(a => {
      const vals = Object.values(a.checks || {})
      return vals.length > 0 && vals.every(Boolean)
    })
    if (status === 'intl') list = list.filter(a => a.isInternational)
    return list
  }, [artists, alerts, search, day, stage, hotel, status])

  const activeFilters = [day, stage, hotel, status !== 'all' ? status : ''].filter(Boolean).length

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('artists')}</h1>
          <p className="text-xs text-earth-stone">{filtered.length} {lang === 'pt' ? 'artistas' : 'artists'} {artists.length !== filtered.length && `/ ${artists.length} total`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all
              ${showFilters || activeFilters > 0 ? 'bg-q-750 border-q-500 text-q-300' : 'bg-q-850 border-q-750 text-earth-stone hover:text-earth-cream'}`}
          >
            <Filter size={12} />
            {t('filters')}
            {activeFilters > 0 && <span className="bg-q-300 text-q-950 rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">{activeFilters}</span>}
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={lang === 'pt' ? 'Buscar artista, responsável, hotel...' : 'Search artist, contact, hotel...'}
        className="input w-full max-w-sm text-xs"
      />

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-q-850 border border-q-750 rounded-xl p-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Day */}
            <div>
              <label className="label">{lang === 'pt' ? 'Dia' : 'Day'}</label>
              <select value={day} onChange={e => setDay(e.target.value)} className="input text-xs w-full mt-1">
                <option value="">{lang === 'pt' ? 'Todos' : 'All'}</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Stage */}
            <div>
              <label className="label">{lang === 'pt' ? 'Palco' : 'Stage'}</label>
              <select value={stage} onChange={e => setStage(e.target.value)} className="input text-xs w-full mt-1">
                <option value="">{lang === 'pt' ? 'Todos' : 'All'}</option>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* Hotel */}
            <div>
              <label className="label">Hotel</label>
              <select value={hotel} onChange={e => setHotel(e.target.value)} className="input text-xs w-full mt-1">
                <option value="">{lang === 'pt' ? 'Todos' : 'All'}</option>
                {HOTELS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            {/* Status */}
            <div>
              <label className="label">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input text-xs w-full mt-1">
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label[lang]}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={() => { setDay(''); setStage(''); setHotel(''); setStatus('all') }}
            className="mt-3 flex items-center gap-1 text-[11px] text-earth-stone hover:text-earth-terra"
          >
            <X size={11} />{lang === 'pt' ? 'Limpar filtros' : 'Clear filters'}
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-earth-stone">
          <Users size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{lang === 'pt' ? 'Nenhum artista encontrado' : 'No artists found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(a => <ArtistCard key={a.id} artist={a} />)}
        </div>
      )}
    </div>
  )
}
