import { useState, useRef } from 'react'
import { Upload, Download, Key, Globe, AlertTriangle, Check } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Settings() {
  const { lang, setLang, apiKey, setApiKey, currentUser, exportExcel, importExcel } = useStore(s => ({
    lang: s.lang, setLang: s.setLang, apiKey: s.apiKey,
    setApiKey: s.setApiKey, currentUser: s.currentUser,
    exportExcel: s.exportExcel, importExcel: s.importExcel,
  }))
  const { t } = useI18n(lang)
  const isAdmin = currentUser?.role === 'admin'

  const [localKey,   setLocalKey]   = useState(apiKey || '')
  const [saved,      setSaved]      = useState(false)
  const [importing,  setImporting]  = useState(false)
  const [importMsg,  setImportMsg]  = useState(null)
  const fileRef = useRef()

  function handleSaveKey() {
    setApiKey(localKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const result = await importExcel(file)
      setImportMsg({ type: 'success', count: result.added || 0 })
    } catch (err) {
      setImportMsg({ type: 'error', msg: err.message })
    }
    setImporting(false)
    e.target.value = ''
  }

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in max-w-lg">
      <h1 className="font-display text-xl tracking-widest text-earth-cream font-semibold">Configurações</h1>

      {/* ── PLANILHA — destaque máximo ── */}
      <div className="card border-q-500 bg-q-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-q-300/20 flex items-center justify-center">
            <Upload size={16} className="text-q-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-earth-cream">Planilha Excel</h2>
            <p className="text-[11px] text-earth-stone">Atualiza artistas, voos, hospedagem e traslados</p>
          </div>
        </div>

        {isAdmin ? (
          <>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="w-full flex items-center justify-center gap-2 py-4 bg-q-300 hover:bg-q-200 disabled:opacity-60 text-q-950 font-bold text-base rounded-xl transition-all"
            >
              <Upload size={20} />
              {importing ? 'Importando...' : 'Subir Planilha Excel'}
            </button>
            {importMsg && (
              <div className={`text-sm font-semibold text-center py-2 rounded-lg ${importMsg.type==='success'?'text-earth-sage bg-earth-sage/10':'text-earth-terra bg-earth-terra/10'}`}>
                {importMsg.type==='success' ? `✅ ${importMsg.count} registros importados` : `❌ ${importMsg.msg}`}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-earth-stone bg-q-850 rounded-xl px-4 py-3 text-center">
            🔒 Faça login como admin para subir planilhas
          </div>
        )}

        <button
          onClick={() => exportExcel()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-q-750 hover:bg-q-700 text-earth-sand font-semibold text-sm rounded-xl transition-all border border-q-600"
        >
          <Download size={16} />
          Baixar Excel Atual
        </button>
        <p className="text-[11px] text-earth-stone text-center">
          Arquivos modificados manualmente são marcados com [*] na exportação
        </p>
      </div>

      {/* Language */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={15} className="text-q-300" />
          <h2 className="text-sm font-bold text-earth-cream">Idioma</h2>
        </div>
        <div className="flex gap-2">
          {['pt','en'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all
                ${lang===l ? 'bg-q-750 border-q-500 text-q-300' : 'bg-q-850 border-q-750 text-earth-stone'}`}>
              {l==='pt' ? '🇧🇷 Português' : '🇺🇸 English'}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      {isAdmin && (
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Key size={15} className="text-q-300" />
            <h2 className="text-sm font-bold text-earth-cream">Chave API Anthropic (chatbot IA)</h2>
          </div>
          <p className="text-xs text-earth-stone leading-relaxed">
            Defina como variável de ambiente <code className="bg-q-800 px-1 py-0.5 rounded text-q-200">ANTHROPIC_API_KEY</code> no painel do Netlify (recomendado). Ou salve aqui temporariamente.
          </p>
          <div className="flex gap-2">
            <input type="password" value={localKey} onChange={e=>setLocalKey(e.target.value)}
              placeholder="sk-ant-api03-..." className="input flex-1 font-mono text-sm" />
            <button onClick={handleSaveKey}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${saved?'bg-earth-sage text-q-950':'btn-primary'}`}>
              {saved ? <><Check size={14}/> Salvo</> : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* User info */}
      <div className="card">
        <h2 className="text-sm font-bold text-earth-cream mb-3">Usuário atual</h2>
        {currentUser ? (
          <div className="bg-q-850 rounded-xl px-4 py-3">
            <div className="text-sm font-bold text-earth-cream">{currentUser.name}</div>
            <div className="text-xs text-earth-stone">{currentUser.email}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${currentUser.role==='admin'?'text-q-300':'text-earth-stone'}`}>
              {currentUser.role==='admin' ? '🔑 Administrador' : '👁 Somente leitura'}
            </div>
          </div>
        ) : (
          <p className="text-sm text-earth-stone">Não autenticado — acesso somente leitura</p>
        )}
      </div>

      {/* Danger zone */}
      {isAdmin && (
        <div className="card border-earth-terra/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-earth-terra" />
            <h2 className="text-sm font-bold text-earth-terra">Zona de Risco</h2>
          </div>
          <p className="text-xs text-earth-stone mb-3">Apaga todos os dados salvos localmente e restaura o estado inicial.</p>
          <button onClick={() => { if(window.confirm('Tem certeza? Isso apagará todos os dados locais.')) { localStorage.removeItem('quartzo-2026-store'); window.location.reload() }}}
            className="flex items-center gap-2 px-4 py-2.5 bg-earth-terra/10 hover:bg-earth-terra/20 border border-earth-terra/30 text-earth-terra text-sm font-bold rounded-xl transition-all w-full justify-center">
            <AlertTriangle size={14}/> Resetar dados locais
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-earth-stone/50 font-medium pt-2">
        QUARTZO LOGISTICS v1.0 · React + Zustand + Netlify
      </p>
    </div>
  )
}
