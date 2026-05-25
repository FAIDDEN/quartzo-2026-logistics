import { useState } from 'react'
import { X, Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../../store'
import Modal from '../UI/Modal'

const HOTELS_LIST  = ['BAGUA', 'CAMINHO CACHOEIRA', 'BAMBU BRASIL']
const STAGES_LIST  = ['MAINSTAGE', 'ALQUIMIA', 'BÉSAME', 'AFTER', 'WELCOME']
const DAYS_LIST    = ['03/06', '04/06', '05/06', '06/06', '07/06']
const LOG_TYPES    = ['H+T', 'H', 'T', 'C', 'T INTERNO', 'BUY OUT', 'H alto+T']

const emptyFlight = () => ({ flightNo:'', from:'', to:'', date:'', departure:'', arrival:'', isInternational:false, status:'' })
const emptySet    = () => ({ day:'04/06', stage:'MAINSTAGE', time:'', logisticsType:'H+T' })

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-q-750 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-q-850 text-left"
      >
        <span className="text-sm font-bold text-earth-cream">{title}</span>
        {open ? <ChevronUp size={14} className="text-earth-stone"/> : <ChevronDown size={14} className="text-earth-stone"/>}
      </button>
      {open && <div className="p-4 space-y-3 bg-q-900">{children}</div>}
    </div>
  )
}

function FlightEditor({ flights, onChange, label }) {
  function update(i, field, val) {
    const next = flights.map((f,j) => j===i ? {...f,[field]:val} : f)
    onChange(next)
  }
  function add()      { onChange([...flights, emptyFlight()]) }
  function remove(i)  { onChange(flights.filter((_,j)=>j!==i)) }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <button type="button" onClick={add}
          className="flex items-center gap-1 text-xs font-bold text-q-300 hover:text-q-200 px-2 py-1 bg-q-800 rounded-lg">
          <Plus size={12}/> Adicionar voo
        </button>
      </div>
      {flights.map((f, i) => (
        <div key={i} className="bg-q-850 rounded-xl p-3 border border-q-700 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-earth-stone">Voo {i+1}</span>
            <button type="button" onClick={()=>remove(i)} className="text-earth-terra hover:text-earth-terra/70 p-1"><Trash2 size={12}/></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Nº Voo</label>
              <input className="input text-sm py-2" value={f.flightNo} onChange={e=>update(i,'flightNo',e.target.value)} placeholder="LA 3011"/>
            </div>
            <div>
              <label className="label">Data</label>
              <select className="input text-sm py-2" value={f.date} onChange={e=>update(i,'date',e.target.value)}>
                <option value="">-- data --</option>
                {['02/06','03/06','04/06','05/06','06/06','07/06','08/06'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Origem</label>
              <input className="input text-sm py-2" value={f.from} onChange={e=>update(i,'from',e.target.value)} placeholder="GRU"/>
            </div>
            <div>
              <label className="label">Destino</label>
              <input className="input text-sm py-2" value={f.to} onChange={e=>update(i,'to',e.target.value)} placeholder="BSB"/>
            </div>
            <div>
              <label className="label">Saída</label>
              <input className="input text-sm py-2" value={f.departure} onChange={e=>update(i,'departure',e.target.value)} placeholder="09:40"/>
            </div>
            <div>
              <label className="label">Chegada</label>
              <input className="input text-sm py-2" value={f.arrival} onChange={e=>update(i,'arrival',e.target.value)} placeholder="11:25"/>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-earth-stone cursor-pointer">
              <input type="checkbox" checked={f.isInternational} onChange={e=>update(i,'isInternational',e.target.checked)} className="w-4 h-4 accent-amber-500"/>
              Voo internacional
            </label>
          </div>
        </div>
      ))}
      {flights.length===0 && <p className="text-xs text-earth-stone italic">Nenhum voo cadastrado</p>}
    </div>
  )
}

function SetsEditor({ sets, onChange }) {
  function update(i, field, val) {
    onChange(sets.map((s,j)=>j===i?{...s,[field]:val}:s))
  }
  function add()     { onChange([...sets, emptySet()]) }
  function remove(i) { onChange(sets.filter((_,j)=>j!==i)) }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label">Apresentações</span>
        <button type="button" onClick={add}
          className="flex items-center gap-1 text-xs font-bold text-q-300 hover:text-q-200 px-2 py-1 bg-q-800 rounded-lg">
          <Plus size={12}/> Adicionar set
        </button>
      </div>
      {sets.map((s,i)=>(
        <div key={i} className="bg-q-850 rounded-xl p-3 border border-q-700 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-earth-stone">Set {i+1}</span>
            <button type="button" onClick={()=>remove(i)} className="text-earth-terra p-1"><Trash2 size={12}/></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Dia</label>
              <select className="input text-sm py-2" value={s.day} onChange={e=>update(i,'day',e.target.value)}>
                {DAYS_LIST.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Palco</label>
              <select className="input text-sm py-2" value={s.stage} onChange={e=>update(i,'stage',e.target.value)}>
                {STAGES_LIST.map(st=><option key={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Horário</label>
              <input className="input text-sm py-2" value={s.time} onChange={e=>update(i,'time',e.target.value)} placeholder="22:00–00:00"/>
            </div>
            <div>
              <label className="label">Logística</label>
              <select className="input text-sm py-2" value={s.logisticsType} onChange={e=>update(i,'logisticsType',e.target.value)}>
                {LOG_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
      {sets.length===0 && <p className="text-xs text-earth-stone italic">Nenhuma apresentação cadastrada</p>}
    </div>
  )
}

export default function ArtistForm({ open, onClose, artist = null }) {
  const { addArtist, updateArtist, deleteArtist, currentUser } = useStore(s => ({
    addArtist: s.addArtist, updateArtist: s.updateArtist,
    deleteArtist: s.deleteArtist, currentUser: s.currentUser,
  }))
  const isEdit = !!artist

  const [form, setForm] = useState(() => ({
    name:              artist?.name            || '',
    fullName:          artist?.fullName        || '',
    role:              artist?.role            || 'artista',
    isInternational:   artist?.isInternational || false,
    language:          artist?.language        || '',
    nationality:       artist?.nationality     || '',
    accommodationType: artist?.accommodationType || 'H+T',
    hotel:             artist?.hotel           || '',
    room:              artist?.room            || '',
    hotelDates:        artist?.hotelDates      || '',
    sets:              artist?.sets            || [],
    flightsIn:         artist?.flightsIn       || [],
    flightsOut:        artist?.flightsOut      || [],
    contact: {
      name:   artist?.contact?.name   || '',
      phone:  artist?.contact?.phone  || '',
      phone2: artist?.contact?.phone2 || '',
      role:   artist?.contact?.role   || '',
    },
    notes: artist?.notes || '',
  }))

  function set(field, val) { setForm(f => ({...f, [field]: val})) }
  function setContact(field, val) { setForm(f => ({...f, contact:{...f.contact,[field]:val}})) }

  function handleSave() {
    if (!form.name.trim()) return alert('Nome é obrigatório')
    if (isEdit) {
      updateArtist(artist.id, form)
    } else {
      addArtist(form)
    }
    onClose()
  }

  function handleDelete() {
    if (!window.confirm(`Excluir ${artist.name}? Esta ação não pode ser desfeita.`)) return
    deleteArtist(artist.id)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}>
      <div
        onClick={e=>e.stopPropagation()}
        className="bg-q-950 border border-q-750 w-full md:max-w-2xl rounded-t-3xl md:rounded-2xl max-h-[92vh] flex flex-col animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-q-750 shrink-0">
          <div>
            <h2 className="font-display text-base tracking-widest text-earth-cream font-semibold">
              {isEdit ? `EDITAR — ${artist.name}` : 'NOVO ARTISTA'}
            </h2>
            <p className="text-xs text-earth-stone mt-0.5">
              {isEdit ? 'Alterações marcadas com [*] no Excel' : 'Será adicionado à plataforma e ao Excel'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-q-800 text-earth-stone">
            <X size={16}/>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* Básico */}
          <Section title="📋 Dados básicos">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Nome artístico *</label>
                <input className="input text-sm" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Ex: Dixon"/>
              </div>
              <div>
                <label className="label">Nome completo</label>
                <input className="input text-sm py-2" value={form.fullName} onChange={e=>set('fullName',e.target.value)} placeholder="Steffen Berkahn"/>
              </div>
              <div>
                <label className="label">Função</label>
                <select className="input text-sm py-2" value={form.role} onChange={e=>set('role',e.target.value)}>
                  {['artista','dj','live','banda','tm','staff','outro'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Idioma</label>
                <input className="input text-sm py-2" value={form.language} onChange={e=>set('language',e.target.value)} placeholder="EN, PT, ES..."/>
              </div>
              <div>
                <label className="label">Nacionalidade</label>
                <input className="input text-sm py-2" value={form.nationality} onChange={e=>set('nationality',e.target.value)} placeholder="BR, US, DE..."/>
              </div>
              <div>
                <label className="label">Logística</label>
                <select className="input text-sm py-2" value={form.accommodationType} onChange={e=>set('accommodationType',e.target.value)}>
                  {LOG_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-earth-sand cursor-pointer">
                  <input type="checkbox" checked={form.isInternational} onChange={e=>set('isInternational',e.target.checked)} className="w-4 h-4 accent-amber-500"/>
                  Internacional
                </label>
              </div>
            </div>
          </Section>

          {/* Contato */}
          <Section title="📱 Contato / Responsável">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Nome do responsável</label>
                <input className="input text-sm py-2" value={form.contact.name} onChange={e=>setContact('name',e.target.value)} placeholder="Manager / TM / Artista"/>
              </div>
              <div>
                <label className="label">WhatsApp / Tel. 1</label>
                <input className="input text-sm py-2" type="tel" value={form.contact.phone} onChange={e=>setContact('phone',e.target.value)} placeholder="(11) 99999-0000"/>
              </div>
              <div>
                <label className="label">WhatsApp / Tel. 2</label>
                <input className="input text-sm py-2" type="tel" value={form.contact.phone2} onChange={e=>setContact('phone2',e.target.value)} placeholder="(11) 99999-1111"/>
              </div>
            </div>
          </Section>

          {/* Apresentações */}
          <Section title="🎧 Apresentações">
            <SetsEditor sets={form.sets} onChange={v=>set('sets',v)}/>
          </Section>

          {/* Hospedagem */}
          <Section title="🏨 Hospedagem" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Hotel</label>
                <select className="input text-sm py-2" value={form.hotel} onChange={e=>set('hotel',e.target.value)}>
                  <option value="">-- selecione --</option>
                  {HOTELS_LIST.map(h=><option key={h}>{h}</option>)}
                  <option value="COLOCADO">COLOCADO (própria hospedagem)</option>
                </select>
              </div>
              <div>
                <label className="label">Quarto / Apt.</label>
                <input className="input text-sm py-2" value={form.room} onChange={e=>set('room',e.target.value)} placeholder="01"/>
              </div>
              <div>
                <label className="label">Período</label>
                <input className="input text-sm py-2" value={form.hotelDates} onChange={e=>set('hotelDates',e.target.value)} placeholder="03/06 → 06/06"/>
              </div>
            </div>
          </Section>

          {/* Voos */}
          <Section title="✈️ Voos" defaultOpen={false}>
            <FlightEditor flights={form.flightsIn}  onChange={v=>set('flightsIn',v)}  label="Chegada (IN)"/>
            <div className="border-t border-q-800 pt-3 mt-1">
              <FlightEditor flights={form.flightsOut} onChange={v=>set('flightsOut',v)} label="Saída (OUT)"/>
            </div>
          </Section>

          {/* Observações */}
          <Section title="📝 Observações" defaultOpen={false}>
            <textarea
              value={form.notes}
              onChange={e=>set('notes',e.target.value)}
              className="input text-sm h-24 resize-none"
              placeholder="Informações adicionais, restrições, pedidos especiais..."
            />
          </Section>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-q-750 shrink-0">
          {isEdit && (
            <button type="button" onClick={handleDelete}
              className="p-3 rounded-xl bg-earth-terra/10 border border-earth-terra/30 text-earth-terra hover:bg-earth-terra/20 transition-all">
              <Trash2 size={16}/>
            </button>
          )}
          <button type="button" onClick={onClose}
            className="flex-1 py-3 bg-q-800 text-earth-stone font-bold rounded-xl hover:bg-q-750 transition-all text-sm">
            Cancelar
          </button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-3 bg-q-300 hover:bg-q-200 text-q-950 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
            <Save size={16}/>
            {isEdit ? 'Salvar alterações' : 'Criar artista'}
          </button>
        </div>
      </div>
    </div>
  )
}
