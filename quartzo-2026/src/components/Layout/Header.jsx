import { useState, useRef } from 'react'
import { LogIn, LogOut, Download, Upload, X, User, Bell, AlertCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { useStore } from '../../store'
import { useI18n } from '../../i18n'

export default function Header() {
  const { lang, currentUser, login, logout, exportExcel, importExcel } = useStore(s => ({
    lang: s.lang, currentUser: s.currentUser,
    login: s.login, logout: s.logout,
    exportExcel: s.exportExcel, importExcel: s.importExcel,
  }))
  const alerts = useStore(s => s.getAlerts())
  const { t } = useI18n(lang)

  const [showLogin,  setShowLogin]  = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass,  setLoginPass]  = useState('')
  const [loginErr,   setLoginErr]   = useState('')
  const [importing,  setImporting]  = useState(false)
  const [importMsg,  setImportMsg]  = useState(null)
  const fileRef = useRef()

  const isAdmin = currentUser?.role === 'admin'
  const redAlerts    = (alerts || []).filter(a => a.level === 'red')
  const yellowAlerts = (alerts || []).filter(a => a.level === 'yellow')
  const totalAlerts  = redAlerts.length + yellowAlerts.length

  function handleLogin(e) {
    e.preventDefault()
    if (!login(loginEmail, loginPass)) { setLoginErr('Email ou senha incorretos.'); return }
    setShowLogin(false); setLoginEmail(''); setLoginPass(''); setLoginErr('')
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
    <header className="h-14 bg-q-900 border-b border-q-750 flex items-center px-4 gap-3 shrink-0 relative z-[100]">

      {/* Logo — mobile only (desktop has sidebar) */}
      <div className="flex items-center gap-2 md:hidden">
        <svg viewBox="0 0 30 30" fill="none" className="w-6 h-6 shrink-0">
          <polygon points="15,1 29,8 29,22 15,29 1,22 1,8" fill="none" stroke="#C8973A" strokeWidth="1.5" opacity="0.7"/>
          <polygon points="15,7 23,11 23,19 15,23 7,19 7,11" fill="#C8973A" opacity="0.9"/>
        </svg>
        <span className="font-display text-sm tracking-widest text-earth-cream">QUARTZO</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">

        {/* ── UPLOAD (admin only) — always prominent ── */}
        {isAdmin && (
          <>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-1.5 px-3 py-2 bg-q-300 hover:bg-q-200 text-q-950 text-xs font-bold rounded-lg transition-all"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">{importing ? 'Importando...' : 'Subir Planilha'}</span>
              <span className="sm:hidden">{importing ? '...' : 'Upload'}</span>
            </button>
          </>
        )}

        {/* Download Excel — everyone */}
        <button
          onClick={() => exportExcel()}
          className="flex items-center gap-1.5 px-3 py-2 bg-q-800 hover:bg-q-750 border border-q-700 text-earth-sand text-xs font-semibold rounded-lg transition-all"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Baixar Excel</span>
        </button>

        {/* Alerts */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2.5 rounded-lg hover:bg-q-800 transition-all"
          >
            <Bell size={18} className={redAlerts.length ? 'text-earth-terra' : yellowAlerts.length ? 'text-earth-gold' : 'text-earth-stone'} />
            {totalAlerts > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-[9px] flex items-center justify-center font-bold text-q-950 px-1
                ${redAlerts.length ? 'bg-earth-terra' : 'bg-earth-gold'}`}>
                {totalAlerts}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-q-900 border border-q-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-q-750">
                <span className="text-sm font-bold text-earth-cream">Alertas</span>
                <button onClick={() => setShowAlerts(false)} className="p-1 rounded-lg hover:bg-q-800"><X size={14} className="text-earth-stone" /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {(alerts||[]).length === 0 && <p className="text-sm text-earth-stone text-center py-6">Sem alertas ✓</p>}
                {(alerts||[]).map((al, i) => (
                  <div key={i} className={`flex gap-3 px-4 py-3 border-b border-q-800 last:border-0
                    ${al.level==='red'?'bg-earth-terra/5':al.level==='yellow'?'bg-earth-gold/5':''}`}>
                    {al.level==='red' ? <AlertCircle size={15} className="text-earth-terra shrink-0 mt-0.5"/>
                      : al.level==='yellow' ? <AlertTriangle size={15} className="text-earth-gold shrink-0 mt-0.5"/>
                      : <Info size={15} className="text-earth-sand shrink-0 mt-0.5"/>}
                    <div>
                      <div className="text-sm font-semibold text-earth-cream">{al.artistName}</div>
                      <div className="text-xs text-earth-stone mt-0.5 leading-relaxed">{al.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Login / User */}
        {currentUser ? (
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-q-800 border border-q-700 rounded-lg">
              <User size={13} className="text-q-300" />
              <span className="text-xs font-semibold text-earth-cream">{currentUser.name}</span>
            </div>
            <button onClick={logout}
              className="p-2.5 rounded-lg hover:bg-q-800 text-earth-stone hover:text-earth-terra transition-all"
              title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-q-750 hover:bg-q-700 border border-q-500 text-q-300 text-xs font-bold rounded-lg transition-all">
            <LogIn size={14} />
            <span className="hidden sm:inline">Login Admin</span>
            <span className="sm:hidden">Login</span>
          </button>
        )}
      </div>

      {/* ── Login Modal ── */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-[200] p-0 sm:p-4"
          onClick={() => { setShowLogin(false); setLoginErr('') }}>
          <div
            className="bg-q-900 border border-q-750 w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-6 pb-8 sm:pb-6 animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-base tracking-widest text-earth-cream font-semibold">LOGIN ADMIN</h2>
                <p className="text-xs text-earth-stone mt-1">Acesso para editar e subir planilhas</p>
              </div>
              <button onClick={() => { setShowLogin(false); setLoginErr('') }}
                className="p-2 rounded-xl bg-q-800 text-earth-stone">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input type="email" required autoFocus value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="input text-base" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="label">Senha</label>
                <input type="password" required value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  className="input text-base" placeholder="••••••••" />
              </div>
              {loginErr && <p className="text-earth-terra text-sm font-semibold">{loginErr}</p>}
              <button type="submit" className="btn-primary w-full text-base py-3">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Import result toast */}
      {importMsg && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[300] animate-slide-up">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold
            ${importMsg.type==='success' ? 'bg-earth-sage text-q-950' : 'bg-earth-terra text-white'}`}>
            {importMsg.type==='success' ? `✅ Planilha importada — ${importMsg.count} registros` : `❌ Erro: ${importMsg.msg}`}
            <button onClick={() => setImportMsg(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={14}/></button>
          </div>
        </div>
      )}
    </header>
  )
}
