import { useState, useRef } from 'react'
import { Search, Bell, Upload, Download, X, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useStore } from '../../store'
import { useI18n } from '../../i18n'

export default function Header() {
  const { lang, artists, alerts, setPage, importExcel, exportExcel, currentUser } = useStore(s => ({
    lang: s.lang, artists: s.artists, alerts: s.alerts,
    setPage: s.setPage, importExcel: s.importExcel,
    exportExcel: s.exportExcel, currentUser: s.currentUser,
  }))
  const { t } = useI18n(lang)
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [showAlerts, setShowAlerts] = useState(false)
  const [importing, setImporting]   = useState(false)
  const [importMsg, setImportMsg]   = useState(null)
  const fileRef = useRef()

  // Smart search across artists, flights, hotels
  function handleSearch(q) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    const ql = q.toLowerCase()
    const hits = artists.filter(a =>
      a.name?.toLowerCase().includes(ql) ||
      a.hotel?.toLowerCase().includes(ql) ||
      a.sets?.some(s => s.stage?.toLowerCase().includes(ql)) ||
      a.flightsIn?.some(f => f.flightNo?.toLowerCase().includes(ql) || f.from?.toLowerCase().includes(ql)) ||
      a.flightsOut?.some(f => f.flightNo?.toLowerCase().includes(ql)) ||
      a.contact?.name?.toLowerCase().includes(ql)
    ).slice(0, 6)
    setResults(hits)
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportMsg(null)
    try {
      const result = await importExcel(file)
      if (result.conflicts && result.conflicts.length > 0) {
        setImportMsg({ type: 'conflict', conflicts: result.conflicts, pending: result })
      } else {
        setImportMsg({ type: 'success', count: result.added })
      }
    } catch (err) {
      setImportMsg({ type: 'error', msg: err.message })
    }
    setImporting(false)
    e.target.value = ''
  }

  const redAlerts   = (alerts || []).filter(a => a.level === 'red')
  const yellowAlerts = (alerts || []).filter(a => a.level === 'yellow')

  return (
    <header className="h-14 bg-q-900 border-b border-q-750 flex items-center gap-3 px-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-stone" />
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="input pl-8 py-1.5 text-xs w-full"
        />
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-q-850 border border-q-700 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
            {results.map(a => (
              <button
                key={a.id}
                onClick={() => { setQuery(''); setResults([]); setPage('artists') }}
                className="w-full text-left px-3 py-2 hover:bg-q-800 flex items-center gap-3 text-xs border-b border-q-800 last:border-0"
              >
                <span className="text-earth-cream font-medium">{a.name}</span>
                {a.sets?.[0] && (
                  <span className="text-earth-stone">{a.sets[0].day} · {a.sets[0].stage}</span>
                )}
                {a.hotel && <span className="ml-auto text-q-300 text-[10px]">{a.hotel}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Import Excel */}
        {currentUser?.role === 'admin' && (
          <>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-q-800 hover:bg-q-750 border border-q-700 text-earth-sand text-xs rounded-lg transition-all"
            >
              <Upload size={13} />
              {importing ? t('importing') : t('importExcel')}
            </button>
            <button
              onClick={() => exportExcel()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-q-800 hover:bg-q-750 border border-q-700 text-earth-sand text-xs rounded-lg transition-all"
            >
              <Download size={13} />
              {t('exportExcel')}
            </button>
          </>
        )}

        {/* Alerts bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg hover:bg-q-800 transition-all"
          >
            <Bell size={16} className={redAlerts.length ? 'text-earth-terra' : yellowAlerts.length ? 'text-earth-gold' : 'text-earth-stone'} />
            {(redAlerts.length + yellowAlerts.length) > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold text-q-950 ${redAlerts.length ? 'bg-earth-terra' : 'bg-earth-gold'}`}>
                {redAlerts.length + yellowAlerts.length}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-q-850 border border-q-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-3 py-2 border-b border-q-750">
                <span className="text-xs font-medium text-earth-cream">{t('alerts')}</span>
                <button onClick={() => setShowAlerts(false)}><X size={14} className="text-earth-stone" /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {(alerts || []).length === 0 && (
                  <p className="text-xs text-earth-stone text-center py-4">{t('noAlerts')}</p>
                )}
                {(alerts || []).map((al, i) => (
                  <div key={i} className={`flex gap-2.5 px-3 py-2 border-b border-q-800 last:border-0 ${al.level === 'red' ? 'bg-earth-terra/5' : al.level === 'yellow' ? 'bg-earth-gold/5' : ''}`}>
                    {al.level === 'red' ? <AlertCircle size={14} className="text-earth-terra shrink-0 mt-0.5" />
                      : al.level === 'yellow' ? <AlertTriangle size={14} className="text-earth-gold shrink-0 mt-0.5" />
                      : <Info size={14} className="text-earth-sand shrink-0 mt-0.5" />}
                    <div>
                      <div className="text-xs text-earth-cream">{al.artistName}</div>
                      <div className="text-[11px] text-earth-stone mt-0.5">{al.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import result message */}
      {importMsg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" onClick={() => setImportMsg(null)}>
          <div className="bg-q-900 border border-q-700 rounded-xl p-6 max-w-sm w-full mx-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            {importMsg.type === 'success' && (
              <>
                <h3 className="text-earth-cream font-medium mb-2">✅ {t('importSuccess')}</h3>
                <p className="text-earth-stone text-sm">{importMsg.count} {t('recordsAdded')}</p>
              </>
            )}
            {importMsg.type === 'conflict' && (
              <>
                <h3 className="text-earth-gold font-medium mb-2">⚠️ {t('conflictsFound')}</h3>
                <p className="text-earth-stone text-sm mb-3">{t('conflictsDesc')}</p>
                <div className="space-y-1 max-h-40 overflow-y-auto mb-4">
                  {importMsg.conflicts.map((c, i) => (
                    <div key={i} className="text-xs bg-q-800 rounded px-2 py-1 text-earth-sand">{c.name}: {c.field}</div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { importMsg.pending.applyAll?.(); setImportMsg(null) }} className="btn-primary flex-1 text-xs py-1.5">{t('applyAll')}</button>
                  <button onClick={() => setImportMsg(null)} className="flex-1 text-xs py-1.5 bg-q-800 text-earth-stone rounded-lg hover:bg-q-750">{t('cancel')}</button>
                </div>
              </>
            )}
            {importMsg.type === 'error' && (
              <>
                <h3 className="text-earth-terra font-medium mb-2">❌ {t('importError')}</h3>
                <p className="text-earth-stone text-sm">{importMsg.msg}</p>
                <button onClick={() => setImportMsg(null)} className="mt-3 btn-primary w-full text-xs">OK</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
