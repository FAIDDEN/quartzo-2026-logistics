import { useState, useMemo } from 'react'
import { Car, Plane, MessageCircle } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Transfers() {
  const { artists, drivers, lang } = useStore(s => ({ artists: s.artists, drivers: s.drivers, lang: s.lang }))
  const { t } = useI18n(lang)
  const [tab, setTab] = useState('aero')
  const [day, setDay] = useState('')

  const aeroTransfers = useMemo(() => {
    const list = []
    artists.forEach(artist => {
      ;(artist.transfersAero || []).forEach(tr => {
        list.push({ artist, transfer: tr })
      })
      // If no explicit transfer but has flight, infer
      if (!(artist.transfersAero?.length) && artist.accommodationType?.includes('T')) {
        ;(artist.flightsIn || []).forEach(f => {
          list.push({ artist, transfer: { type: 'in', date: f.date, time: f.arrival, inferred: true } })
        })
        ;(artist.flightsOut || []).forEach(f => {
          list.push({ artist, transfer: { type: 'out', date: f.date, time: f.departure, inferred: true } })
        })
      }
    })
    return list.sort((a, b) => ((a.transfer.date||'') + (a.transfer.time||'')).localeCompare((b.transfer.date||'') + (b.transfer.time||'')))
  }, [artists])

  const internoTransfers = useMemo(() => {
    const list = []
    artists.forEach(artist => {
      ;(artist.transfersInterno || []).forEach(tr => {
        list.push({ artist, transfer: tr })
      })
    })
    return list.sort((a, b) => ((a.transfer.date||'') + (a.transfer.time||'')).localeCompare((b.transfer.date||'') + (b.transfer.time||'')))
  }, [artists])

  const filtered = (tab === 'aero' ? aeroTransfers : internoTransfers)
    .filter(({ transfer }) => !day || transfer.date?.includes(day))

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div>
        <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('transfers')}</h1>
        <p className="text-xs text-earth-stone">{lang === 'pt' ? 'BSB → Chapada e interno' : 'BSB → Chapada and internal'}</p>
      </div>

      {/* Tabs + day filter */}
      <div className="flex flex-wrap gap-3">
        <div className="flex bg-q-850 border border-q-750 rounded-lg overflow-hidden">
          <button onClick={() => setTab('aero')}
            className={`px-4 py-1.5 text-xs flex items-center gap-1.5 transition-all ${tab === 'aero' ? 'bg-q-750 text-q-300 font-medium' : 'text-earth-stone hover:text-earth-cream'}`}>
            <Plane size={12} />{lang === 'pt' ? 'Aeroporto' : 'Airport'}
          </button>
          <button onClick={() => setTab('interno')}
            className={`px-4 py-1.5 text-xs flex items-center gap-1.5 transition-all ${tab === 'interno' ? 'bg-q-750 text-q-300 font-medium' : 'text-earth-stone hover:text-earth-cream'}`}>
            <Car size={12} />{lang === 'pt' ? 'Interno' : 'Internal'}
          </button>
        </div>
        <select value={day} onChange={e => setDay(e.target.value)} className="input text-xs py-1.5">
          <option value="">{lang === 'pt' ? 'Todos os dias' : 'All days'}</option>
          {['02/06','03/06','04/06','05/06','06/06','07/06','08/06'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-q-750">
              {[
                lang === 'pt' ? 'Artista' : 'Artist',
                lang === 'pt' ? 'Direção' : 'Direction',
                lang === 'pt' ? 'Data' : 'Date',
                lang === 'pt' ? 'Horário' : 'Time',
                lang === 'pt' ? 'Motorista' : 'Driver',
                lang === 'pt' ? 'Veículo' : 'Vehicle',
                lang === 'pt' ? 'Contato' : 'Contact',
                '',
              ].map((h, i) => (
                <th key={i} className="text-left py-2 px-2 text-earth-stone font-medium text-[10px] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ artist, transfer }, i) => (
              <tr key={i} className={`border-b border-q-800 hover:bg-q-850 transition-all ${transfer.inferred ? 'opacity-60' : ''}`}>
                <td className="py-2 px-2 text-earth-cream font-medium">{artist.name}</td>
                <td className="py-2 px-2">
                  {tab === 'aero' ? (
                    <span className={`text-[10px] rounded px-1.5 py-0.5 ${transfer.type === 'in' ? 'bg-earth-sage/20 text-earth-sage' : 'bg-earth-terra/20 text-earth-terra'}`}>
                      {transfer.type === 'in' ? '→ BSB IN' : 'BSB OUT →'}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5">
                      {transfer.direction === 'toVenue' ? 'Hotel → Evento' : 'Evento → Hotel'}
                    </span>
                  )}
                  {transfer.inferred && <span className="text-[9px] text-earth-stone ml-1">(inferido)</span>}
                </td>
                <td className="py-2 px-2 text-earth-stone">{transfer.date || '—'}</td>
                <td className="py-2 px-2 text-earth-sand">{transfer.time || '—'}</td>
                <td className="py-2 px-2 text-earth-sand">{transfer.driver || <span className="text-earth-stone italic">—</span>}</td>
                <td className="py-2 px-2 text-earth-stone">{transfer.vehicle || '—'}</td>
                <td className="py-2 px-2">
                  {transfer.driverPhone && (
                    <a href={`https://wa.me/55${transfer.driverPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-earth-sage text-[10px]">
                      <MessageCircle size={9} />{transfer.driverPhone}
                    </a>
                  )}
                </td>
                <td className="py-2 px-2">
                  {!transfer.driver && <span className="text-[9px] text-earth-gold">⚠ sem motorista</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-earth-stone">
            <Car size={28} className="mx-auto mb-2 opacity-30" />
            <p>{lang === 'pt' ? 'Nenhum traslado encontrado' : 'No transfers found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
