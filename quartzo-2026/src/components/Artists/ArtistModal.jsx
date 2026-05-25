import { useState } from 'react'
import Modal from '../UI/Modal'
import {
  Plane, Hotel, Car, Globe, MessageCircle, AlertTriangle, AlertCircle,
  CheckCircle2, Circle, Plus, Trash2, Save, Edit3, FileText
} from 'lucide-react'
import { useStore } from '../../store'
import { useI18n } from '../../i18n'

const CHECK_LABELS = {
  flightInConfirmed:   { pt: 'Voo IN confirmado',    en: 'Inbound flight confirmed' },
  arrivedBSB:          { pt: 'Chegou em BSB',         en: 'Arrived BSB' },
  pickedUpBSB:         { pt: 'Embarcado traslado',    en: 'Transfer boarded' },
  arrivedHotel:        { pt: 'Chegou no hotel',       en: 'Arrived at hotel' },
  checkedIn:           { pt: 'Check-in feito',        en: 'Checked in' },
  transferToVenue:     { pt: 'Transfer p/ evento',    en: 'Transfer to venue' },
  arrivedVenue:        { pt: 'Chegou no evento',      en: 'Arrived at venue' },
  performed:           { pt: 'Tocou/Apresentou',      en: 'Performed' },
  transferToHotel:     { pt: 'Transfer p/ hotel',     en: 'Transfer to hotel' },
  transferToAirport:   { pt: 'Transfer p/ aeroporto', en: 'Transfer to airport' },
  departedBSB:         { pt: 'Embarcou em BSB',       en: 'Departed BSB' },
  flightOutConfirmed:  { pt: 'Voo OUT confirmado',    en: 'Outbound flight confirmed' },
}

function FlightSection({ flights, direction, lang, alerts, artistId }) {
  const icon = direction === 'in'
    ? <Plane size={13} className="rotate-[315deg] text-earth-sage" />
    : <Plane size={13} className="rotate-45 text-earth-terra" />

  if (!flights?.length) return (
    <div className="text-xs text-earth-stone italic">
      {direction === 'in' ? (lang === 'pt' ? 'Voo de chegada não cadastrado' : 'No inbound flight registered') : (lang === 'pt' ? 'Voo de saída não cadastrado' : 'No outbound flight registered')}
    </div>
  )

  return (
    <div className="space-y-2">
      {flights.map((f, i) => {
        const fAlert = (alerts || []).filter(a => a.artistId === artistId && a.flightIndex === i && a.direction === direction)
        return (
          <div key={i} className={`bg-q-850 rounded-lg px-3 py-2 border ${fAlert.some(a=>a.level==='red') ? 'border-earth-terra/40' : fAlert.some(a=>a.level==='yellow') ? 'border-earth-gold/40' : 'border-q-750'}`}>
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <span className="text-earth-cream text-xs font-medium">{f.flightNo || '—'}</span>
              <span className="text-earth-stone text-xs">{f.date}</span>
              {f.isInternational && <span className="text-[9px] bg-purple-900/40 text-purple-300 rounded px-1.5 py-0.5">INTL</span>}
            </div>
            <div className="flex items-center gap-2 text-xs text-earth-stone">
              <span>{f.from}</span>
              <span className="text-q-500">→</span>
              <span>{f.to}</span>
              {f.departure && <span className="text-earth-sand">{f.departure}</span>}
              {f.arrival && <span>→ <span className="text-earth-sand">{f.arrival}</span></span>}
            </div>
            {fAlert.map((a, j) => (
              <div key={j} className={`flex items-center gap-1.5 mt-1.5 text-[10px] ${a.level === 'red' ? 'text-earth-terra' : 'text-earth-gold'}`}>
                {a.level === 'red' ? <AlertCircle size={10} /> : <AlertTriangle size={10} />}
                {a.message}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default function ArtistModal({ open, onClose, artist }) {
  const { lang, updateArtist, addIncident, currentUser, alerts } = useStore(s => ({
    lang: s.lang, updateArtist: s.updateArtist,
    addIncident: s.addIncident, currentUser: s.currentUser,
    alerts: s.alerts,
  }))
  const { t } = useI18n(lang)
  const isAdmin = currentUser?.role === 'admin'

  const [tab, setTab] = useState('info')
  const [incidentText, setIncidentText] = useState('')
  const [editNotes, setEditNotes] = useState(false)
  const [notes, setNotes] = useState(artist.notes || '')

  if (!artist) return null

  const artistAlerts = (alerts || []).filter(a => a.artistId === artist.id)
  const checks = artist.checks || {}

  function toggleCheck(key) {
    if (!isAdmin) return
    const newChecks = { ...checks, [key]: !checks[key] }

    // Warn if checking out-of-order
    const keys = Object.keys(CHECK_LABELS)
    const idx = keys.indexOf(key)
    if (!checks[key] && idx > 0) {
      const prevKey = keys[idx - 1]
      if (!newChecks[prevKey]) {
        // Allow but show console warning — UI alert shown via store alert engine
      }
    }
    updateArtist(artist.id, { checks: newChecks })
  }

  function handleAddIncident() {
    if (!incidentText.trim()) return
    addIncident(artist.id, incidentText.trim())
    setIncidentText('')
  }

  function handleSaveNotes() {
    updateArtist(artist.id, { notes })
    setEditNotes(false)
  }

  const TABS = [
    { id: 'info',      label: lang === 'pt' ? 'Info' : 'Info' },
    { id: 'flights',   label: lang === 'pt' ? 'Voos' : 'Flights' },
    { id: 'transfers', label: lang === 'pt' ? 'Traslados' : 'Transfers' },
    { id: 'checks',    label: lang === 'pt' ? 'Checks' : 'Checks' },
    { id: 'incidents', label: lang === 'pt' ? 'Ocorrências' : 'Incidents' },
  ]

  return (
    <Modal open={open} onClose={onClose} title={artist.name} wide>
      {/* Alert strip */}
      {artistAlerts.length > 0 && (
        <div className="mb-4 space-y-1">
          {artistAlerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${a.level === 'red' ? 'bg-earth-terra/10 text-earth-terra border border-earth-terra/20' : 'bg-earth-gold/10 text-earth-gold border border-earth-gold/20'}`}>
              {a.level === 'red' ? <AlertCircle size={12} /> : <AlertTriangle size={12} />}
              {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Quick pills row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {artist.sets?.map((s, i) => (
          <span key={i} className="text-xs bg-q-800 border border-q-700 text-earth-sand rounded-lg px-2.5 py-1">
            📅 {s.day} · {s.stage} {s.time && `· ${s.time}`}
          </span>
        ))}
        {artist.hotel && (
          <span className="text-xs bg-q-800 border border-q-700 text-earth-sand rounded-lg px-2.5 py-1 flex items-center gap-1">
            <Hotel size={11} />{artist.hotel} {artist.room && `(Qt.${artist.room})`}
          </span>
        )}
        {artist.isInternational && (
          <span className="text-xs bg-purple-900/30 border border-purple-700/30 text-purple-300 rounded-lg px-2.5 py-1 flex items-center gap-1">
            <Globe size={11} />{artist.language || 'INTL'}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-q-750 pb-1">
        {TABS.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${tab === tb.id ? 'bg-q-750 text-q-300 font-medium' : 'text-earth-stone hover:text-earth-cream'}`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* TAB: Info */}
      {tab === 'info' && (
        <div className="space-y-4">
          {/* Contact */}
          <div>
            <h4 className="label mb-2">{lang === 'pt' ? 'Responsável / Contato' : 'Contact'}</h4>
            {artist.contact ? (
              <div className="bg-q-850 rounded-lg px-3 py-2">
                <div className="text-xs text-earth-cream font-medium">{artist.contact.name || artist.name}</div>
                {artist.contact.role && <div className="text-[11px] text-earth-stone">{artist.contact.role}</div>}
                {artist.contact.phone && (
                  <a
                    href={`https://wa.me/55${artist.contact.phone.replace(/\D/g,'')}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-earth-sage mt-1.5 hover:text-earth-sage/80"
                  >
                    <MessageCircle size={12} />{artist.contact.phone}
                  </a>
                )}
                {artist.contact.phone2 && (
                  <a
                    href={`https://wa.me/${artist.contact.phone2.replace(/\D/g,'').replace(/^0/,'55')}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-earth-sage mt-1 hover:text-earth-sage/80"
                  >
                    <MessageCircle size={12} />{artist.contact.phone2}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-earth-stone italic">{lang === 'pt' ? 'Contato não cadastrado' : 'No contact registered'}</p>
            )}
          </div>

          {/* Accommodation */}
          <div>
            <h4 className="label mb-2">{lang === 'pt' ? 'Hospedagem' : 'Accommodation'}</h4>
            <div className="bg-q-850 rounded-lg px-3 py-2 text-xs">
              <div className="flex items-center gap-2 text-earth-cream">
                <Hotel size={12} />
                {artist.hotel || <span className="italic text-earth-stone">{lang === 'pt' ? 'Hotel não definido' : 'Hotel TBD'}</span>}
                {artist.room && <span className="text-earth-stone">· {lang === 'pt' ? 'Quarto' : 'Room'} {artist.room}</span>}
              </div>
              {artist.accommodationType && (
                <div className="text-[10px] text-earth-stone mt-1">
                  Tipo: {artist.accommodationType}
                  {artist.accommodationType === 'C' && ' (Colocado — resolve própria hospedagem)'}
                  {artist.accommodationType === 'BO' && ' (Buy Out)'}
                </div>
              )}
              {artist.hotelDates && (
                <div className="text-[10px] text-earth-stone">{lang === 'pt' ? 'Período' : 'Period'}: {artist.hotelDates}</div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="label">{lang === 'pt' ? 'Observações' : 'Notes'}</h4>
              {isAdmin && (
                <button onClick={() => editNotes ? handleSaveNotes() : setEditNotes(true)}
                  className="flex items-center gap-1 text-[10px] text-earth-stone hover:text-earth-cream">
                  {editNotes ? <><Save size={10} /> {lang === 'pt' ? 'Salvar' : 'Save'}</> : <><Edit3 size={10} /> {lang === 'pt' ? 'Editar' : 'Edit'}</>}
                </button>
              )}
            </div>
            {editNotes ? (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="input w-full text-xs h-24 resize-none"
                placeholder={lang === 'pt' ? 'Adicionar observações...' : 'Add notes...'}
              />
            ) : (
              <div className="bg-q-850 rounded-lg px-3 py-2 text-xs text-earth-stone min-h-[40px]">
                {notes || <span className="italic">{lang === 'pt' ? 'Sem observações' : 'No notes'}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Flights */}
      {tab === 'flights' && (
        <div className="space-y-4">
          <div>
            <h4 className="label mb-2">{lang === 'pt' ? '✈️ Chegada' : '✈️ Inbound'}</h4>
            <FlightSection flights={artist.flightsIn} direction="in" lang={lang} alerts={alerts} artistId={artist.id} />
          </div>
          <div>
            <h4 className="label mb-2">{lang === 'pt' ? '✈️ Saída' : '✈️ Outbound'}</h4>
            <FlightSection flights={artist.flightsOut} direction="out" lang={lang} alerts={alerts} artistId={artist.id} />
          </div>
        </div>
      )}

      {/* TAB: Transfers */}
      {tab === 'transfers' && (
        <div className="space-y-3">
          {(artist.transfersAero || []).length === 0 && (artist.transfersInterno || []).length === 0 && (
            <p className="text-xs text-earth-stone italic">{lang === 'pt' ? 'Nenhum traslado cadastrado' : 'No transfers registered'}</p>
          )}
          {(artist.transfersAero || []).map((tr, i) => (
            <div key={i} className="bg-q-850 rounded-lg px-3 py-2 border border-q-750">
              <div className="flex items-center gap-2 text-xs">
                <Plane size={11} className="text-q-300" />
                <span className="text-earth-cream font-medium">{tr.type === 'in' ? '→ Chegada' : 'Saída →'}</span>
                <span className="text-earth-stone">{tr.date} {tr.time}</span>
              </div>
              {tr.driver && (
                <div className="flex items-center gap-2 mt-1 text-[11px] text-earth-stone">
                  <Car size={10} />
                  {lang === 'pt' ? 'Motorista' : 'Driver'}: <span className="text-earth-sand">{tr.driver}</span>
                  {tr.vehicle && <span>· {tr.vehicle}</span>}
                  {tr.driverPhone && (
                    <a href={`https://wa.me/55${tr.driverPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-earth-sage ml-1">
                      <MessageCircle size={9} />{tr.driverPhone}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
          {(artist.transfersInterno || []).map((tr, i) => (
            <div key={i} className="bg-q-850 rounded-lg px-3 py-2 border border-q-750">
              <div className="flex items-center gap-2 text-xs">
                <Car size={11} className="text-earth-amber" />
                <span className="text-earth-cream font-medium">{lang === 'pt' ? 'Interno' : 'Internal'}</span>
                <span className="text-earth-stone">{tr.direction === 'toVenue' ? 'Hotel → Evento' : 'Evento → Hotel'} · {tr.date} {tr.time}</span>
              </div>
              {tr.driver && (
                <div className="text-[11px] text-earth-stone mt-1">
                  {lang === 'pt' ? 'Motorista' : 'Driver'}: <span className="text-earth-sand">{tr.driver}</span>
                  {tr.driverPhone && (
                    <a href={`https://wa.me/55${tr.driverPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-earth-sage ml-2">
                      <MessageCircle size={9} />{tr.driverPhone}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB: Checks */}
      {tab === 'checks' && (
        <div className="space-y-1.5">
          {Object.entries(CHECK_LABELS).map(([key, labels], idx) => {
            const checked = checks[key] || false
            const prevKey = Object.keys(CHECK_LABELS)[idx - 1]
            const outOfOrder = checked && idx > 0 && !checks[prevKey]
            return (
              <button
                key={key}
                onClick={() => toggleCheck(key)}
                disabled={!isAdmin}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left
                  ${checked ? 'bg-earth-sage/10 border-earth-sage/30' : 'bg-q-850 border-q-750 hover:border-q-600'}
                  ${!isAdmin ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
              >
                {checked
                  ? <CheckCircle2 size={14} className="text-earth-sage shrink-0" />
                  : <Circle size={14} className="text-earth-stone/40 shrink-0" />
                }
                <span className={`text-xs flex-1 ${checked ? 'text-earth-sage line-through' : 'text-earth-sand'}`}>
                  {labels[lang] || labels.pt}
                </span>
                {outOfOrder && (
                  <span className="flex items-center gap-1 text-[10px] text-earth-gold">
                    <AlertTriangle size={10} />{lang === 'pt' ? 'Verificar ordem' : 'Check order'}
                  </span>
                )}
              </button>
            )
          })}
          {!isAdmin && (
            <p className="text-[10px] text-earth-stone text-center mt-3">{lang === 'pt' ? 'Somente admin pode marcar checks' : 'Only admin can toggle checks'}</p>
          )}
        </div>
      )}

      {/* TAB: Incidents */}
      {tab === 'incidents' && (
        <div className="space-y-3">
          {isAdmin && (
            <div className="flex gap-2">
              <input
                value={incidentText}
                onChange={e => setIncidentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddIncident()}
                placeholder={lang === 'pt' ? 'Registrar nova ocorrência...' : 'Log new incident...'}
                className="input flex-1 text-xs"
              />
              <button onClick={handleAddIncident} className="btn-primary px-3 py-1.5 text-xs">
                <Plus size={14} />
              </button>
            </div>
          )}
          <div className="space-y-2">
            {(artist.incidents || []).length === 0 && (
              <p className="text-xs text-earth-stone italic">{lang === 'pt' ? 'Nenhuma ocorrência registrada' : 'No incidents logged'}</p>
            )}
            {(artist.incidents || []).map((inc, i) => (
              <div key={i} className="bg-q-850 rounded-lg px-3 py-2 border border-q-750">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-earth-stone">{new Date(inc.at).toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')} · {inc.by}</div>
                    <div className="text-xs text-earth-sand mt-0.5">{inc.text}</div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => updateArtist(artist.id, { incidents: artist.incidents.filter((_, j) => j !== i) })}
                      className="text-earth-stone hover:text-earth-terra p-0.5"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Export report button */}
          {(artist.incidents || []).length > 0 && (
            <button
              onClick={() => {
                const text = `RELATÓRIO DE OCORRÊNCIAS — ${artist.name}\n\n` +
                  (artist.incidents || []).map(inc =>
                    `[${new Date(inc.at).toLocaleString('pt-BR')}] ${inc.by}: ${inc.text}`
                  ).join('\n')
                const blob = new Blob([text], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `ocorrencias_${artist.name.replace(/\s/g,'_')}.txt`
                a.click(); URL.revokeObjectURL(url)
              }}
              className="flex items-center gap-2 text-xs text-earth-stone hover:text-earth-cream px-3 py-1.5 bg-q-800 rounded-lg w-full justify-center"
            >
              <FileText size={12} />{lang === 'pt' ? 'Exportar relatório de ocorrências' : 'Export incident report'}
            </button>
          )}
        </div>
      )}
    </Modal>
  )
}
