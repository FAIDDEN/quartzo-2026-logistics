import { useState, useRef } from 'react'
import { Upload, Download, Key, Globe, AlertTriangle, Check,
         Users, Plus, Trash2, Eye, EyeOff, Shield, Lock } from 'lucide-react'
import { useStore } from '../store'

const SUPER_ADMIN = 'aiddenmusic@gmail.com'

function Section({ icon: Icon, title, subtitle, color = 'text-q-300', children }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-q-800 flex items-center justify-center shrink-0">
          <Icon size={16} className={color}/>
        </div>
        <div>
          <h2 className="text-sm font-bold text-earth-cream">{title}</h2>
          {subtitle && <p className="text-[11px] text-earth-stone mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function PasswordInput({ value, onChange, placeholder = '••••••••', className = '' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input pr-11 ${className}`}
      />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-stone hover:text-earth-cream p-1">
        {show ? <EyeOff size={16}/> : <Eye size={16}/>}
      </button>
    </div>
  )
}

// ── Change Password (any logged-in user) ──────────────────────────────────────
function ChangePassword({ currentUser, changePassword }) {
  const [cur,  setCur]  = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg,  setMsg]  = useState(null)

  function handle() {
    if (!next.trim() || next.length < 6) return setMsg({ err: 'Senha nova precisa ter ao menos 6 caracteres.' })
    if (next !== confirm) return setMsg({ err: 'Senhas não coincidem.' })
    const r = changePassword(cur, next)
    if (r.error) return setMsg({ err: r.error })
    setMsg({ ok: 'Senha alterada com sucesso!' })
    setCur(''); setNext(''); setConfirm('')
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Senha atual</label>
        <PasswordInput value={cur} onChange={e => setCur(e.target.value)} placeholder="Sua senha atual" className="text-sm mt-1"/>
      </div>
      <div>
        <label className="label">Nova senha</label>
        <PasswordInput value={next} onChange={e => setNext(e.target.value)} placeholder="Mínimo 6 caracteres" className="text-sm mt-1"/>
      </div>
      <div>
        <label className="label">Confirmar nova senha</label>
        <PasswordInput value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repetir nova senha" className="text-sm mt-1"/>
      </div>
      {msg?.err && <p className="text-earth-terra text-sm font-semibold">{msg.err}</p>}
      {msg?.ok  && <p className="text-earth-sage  text-sm font-semibold">✅ {msg.ok}</p>}
      <button onClick={handle} className="btn-primary w-full py-3 text-sm">Alterar senha</button>
    </div>
  )
}

// ── User Management (super-admin only) ────────────────────────────────────────
function UserManagement({ users, addUser, updateUser, deleteUser, currentUser }) {
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState(null)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'readonly' })
  const [msg,  setMsg]  = useState(null)

  function resetForm() { setForm({ name:'', email:'', password:'', role:'readonly' }); setShowForm(false); setEditId(null); setMsg(null) }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return setMsg({ err: 'Nome e email são obrigatórios.' })
    if (!editId && !form.password.trim()) return setMsg({ err: 'Senha é obrigatória para novo usuário.' })
    if (!editId && form.password.length < 6) return setMsg({ err: 'Senha precisa ter ao menos 6 caracteres.' })

    if (editId) {
      const payload = { name: form.name, email: form.email, role: form.role }
      if (form.password.trim()) payload.password = form.password
      updateUser(editId, payload)
      setMsg({ ok: 'Usuário atualizado.' })
    } else {
      const r = addUser(form)
      if (r.error) return setMsg({ err: r.error })
      setMsg({ ok: `Usuário "${form.name}" criado com sucesso.` })
    }
    setTimeout(resetForm, 1500)
  }

  function startEdit(u) {
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setEditId(u.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      {/* User list */}
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between bg-q-850 rounded-xl px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-earth-cream">{u.name}</span>
                {u.email === SUPER_ADMIN && (
                  <span className="text-[9px] bg-q-300/20 text-q-300 border border-q-300/30 rounded-full px-2 py-0.5 font-bold uppercase">Super Admin</span>
                )}
              </div>
              <div className="text-xs text-earth-stone">{u.email}</div>
              <div className={`text-[10px] font-bold uppercase mt-0.5 ${u.role==='admin'?'text-q-400':'text-earth-stone/60'}`}>
                {u.role==='admin'?'🔑 Admin':'👁 Somente leitura'}
              </div>
            </div>
            {u.email !== SUPER_ADMIN && (
              <div className="flex gap-2">
                <button onClick={() => startEdit(u)}
                  className="text-xs font-bold px-3 py-2 bg-q-800 hover:bg-q-750 text-earth-sand rounded-xl transition-all">
                  Editar
                </button>
                <button onClick={() => { if(window.confirm(`Remover ${u.name}?`)) deleteUser(u.id) }}
                  className="p-2 bg-earth-terra/10 hover:bg-earth-terra/20 text-earth-terra rounded-xl transition-all">
                  <Trash2 size={14}/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm ? (
        <div className="bg-q-850 border border-q-700 rounded-2xl p-4 space-y-3 animate-fade-in">
          <h3 className="text-sm font-bold text-earth-cream">
            {editId ? 'Editar usuário' : 'Novo usuário'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Nome</label>
              <input className="input text-sm mt-1" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Ana Paula"/>
            </div>
            <div className="col-span-2">
              <label className="label">Email</label>
              <input type="email" className="input text-sm mt-1" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@exemplo.com"/>
            </div>
            <div className="col-span-2">
              <label className="label">{editId ? 'Nova senha (deixe em branco para manter)' : 'Senha'}</label>
              <PasswordInput value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Mínimo 6 caracteres" className="text-sm mt-1"/>
            </div>
            <div className="col-span-2">
              <label className="label">Nível de acesso</label>
              <div className="flex gap-2 mt-1">
                {[
                  { value:'readonly', label:'👁 Somente leitura', desc:'Vê tudo, não edita' },
                  { value:'admin',    label:'🔑 Admin',            desc:'Edita tudo' },
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm(f=>({...f,role:opt.value}))}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left
                      ${form.role===opt.value?'bg-q-750 border-q-500 text-q-300':'bg-q-900 border-q-750 text-earth-stone'}`}>
                    <div>{opt.label}</div>
                    <div className={`text-[10px] font-medium mt-0.5 ${form.role===opt.value?'text-earth-stone':'text-earth-stone/50'}`}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {msg?.err && <p className="text-earth-terra text-sm font-semibold">{msg.err}</p>}
          {msg?.ok  && <p className="text-earth-sage  text-sm font-semibold">✅ {msg.ok}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={resetForm} className="flex-1 py-2.5 bg-q-800 text-earth-stone font-bold rounded-xl text-sm hover:bg-q-750">Cancelar</button>
            <button onClick={handleSave} className="flex-1 py-2.5 bg-q-300 text-q-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2">
              <Check size={14}/>{editId ? 'Salvar' : 'Criar usuário'}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => { setEditId(null); setForm({ name:'', email:'', password:'', role:'readonly' }); setShowForm(true) }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-q-800 hover:bg-q-750 border border-q-700 text-earth-sand font-bold text-sm rounded-xl transition-all">
          <Plus size={16}/> Adicionar usuário
        </button>
      )}
    </div>
  )
}

// ── Main Settings Page ────────────────────────────────────────────────────────
export default function Settings() {
  const { lang, setLang, apiKey, setApiKey, currentUser,
          exportExcel, importExcel,
          users, addUser, updateUser, deleteUser, changePassword } = useStore(s => ({
    lang: s.lang, setLang: s.setLang, apiKey: s.apiKey,
    setApiKey: s.setApiKey, currentUser: s.currentUser,
    exportExcel: s.exportExcel, importExcel: s.importExcel,
    users: s.users, addUser: s.addUser, updateUser: s.updateUser,
    deleteUser: s.deleteUser, changePassword: s.changePassword,
  }))

  const isAdmin      = currentUser?.role === 'admin'
  const isSuperAdmin = currentUser?.email === SUPER_ADMIN

  const [localKey,  setLocalKey]  = useState(apiKey || '')
  const [keySaved,  setKeySaved]  = useState(false)
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const fileRef = useRef()

  function handleSaveKey() {
    setApiKey(localKey)
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const result = await importExcel(file)
      setImportMsg({ type:'success', count: result.added || 0 })
    } catch (err) {
      setImportMsg({ type:'error', msg: err.message })
    }
    setImporting(false)
    e.target.value = ''
  }

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in max-w-lg">
      <h1 className="font-display text-xl tracking-widest text-earth-cream font-semibold">Configurações</h1>

      {/* Planilha Excel */}
      <Section icon={Upload} title="Planilha Excel" subtitle="Importar ou exportar dados do festival">
        {isAdmin ? (
          <>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange}/>
            <button onClick={() => fileRef.current?.click()} disabled={importing}
              className="w-full flex items-center justify-center gap-2 py-4 bg-q-300 hover:bg-q-200 disabled:opacity-60 text-q-950 font-bold text-base rounded-xl transition-all">
              <Upload size={20}/>{importing ? 'Importando...' : 'Subir Planilha Excel'}
            </button>
            {importMsg && (
              <p className={`text-sm font-semibold text-center py-2 rounded-lg ${importMsg.type==='success'?'text-earth-sage bg-earth-sage/10':'text-earth-terra bg-earth-terra/10'}`}>
                {importMsg.type==='success' ? `✅ ${importMsg.count} registros importados` : `❌ ${importMsg.msg}`}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-earth-stone bg-q-850 rounded-xl px-4 py-3 text-center">🔒 Faça login como admin para subir planilhas</p>
        )}
        <button onClick={() => exportExcel()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-q-750 hover:bg-q-700 text-earth-sand font-semibold text-sm rounded-xl transition-all border border-q-600">
          <Download size={16}/>Baixar Excel Atual
        </button>
        <p className="text-[11px] text-earth-stone text-center">Campos editados manualmente aparecem com [*] no Excel</p>
      </Section>

      {/* Idioma */}
      <Section icon={Globe} title="Idioma da interface">
        <div className="flex gap-2">
          {['pt','en'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all
                ${lang===l?'bg-q-750 border-q-500 text-q-300':'bg-q-850 border-q-750 text-earth-stone'}`}>
              {l==='pt'?'🇧🇷 Português':'🇺🇸 English'}
            </button>
          ))}
        </div>
      </Section>

      {/* Alterar senha — qualquer usuário logado */}
      {currentUser && (
        <Section icon={Lock} title="Alterar minha senha" subtitle={`Conta: ${currentUser.email}`}>
          <ChangePassword currentUser={currentUser} changePassword={changePassword}/>
        </Section>
      )}

      {/* Gerenciar usuários — só super-admin */}
      {isSuperAdmin && (
        <Section
          icon={Users}
          title="Gerenciar usuários"
          subtitle="Somente você (Aidden) pode adicionar ou remover contas"
          color="text-q-300"
        >
          <UserManagement
            users={users}
            addUser={addUser}
            updateUser={updateUser}
            deleteUser={deleteUser}
            currentUser={currentUser}
          />
        </Section>
      )}

      {/* API Key — só admin */}
      {isAdmin && (
        <Section icon={Key} title="Chave API Anthropic" subtitle="Para o assistente IA funcionar" color="text-earth-gold">
          <p className="text-xs text-earth-stone leading-relaxed bg-q-850 rounded-xl px-3 py-2">
            Recomendado: configure <code className="bg-q-800 px-1 rounded text-q-200">ANTHROPIC_API_KEY</code> nas variáveis de ambiente do Netlify. Salvar aqui é apenas temporário.
          </p>
          <div className="flex gap-2">
            <PasswordInput value={localKey} onChange={e => setLocalKey(e.target.value)} placeholder="sk-ant-api03-..." className="flex-1 font-mono text-sm"/>
            <button onClick={handleSaveKey}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${keySaved?'bg-earth-sage text-q-950':'btn-primary'}`}>
              {keySaved ? <><Check size={14}/></> : 'Salvar'}
            </button>
          </div>
        </Section>
      )}

      {/* Danger zone */}
      {isAdmin && (
        <Section icon={AlertTriangle} title="Zona de Risco" color="text-earth-terra">
          <p className="text-xs text-earth-stone leading-relaxed">Apaga todos os dados do localStorage e restaura o estado inicial.</p>
          <button onClick={() => { if(window.confirm('Apagar todos os dados locais?')) { localStorage.removeItem('quartzo-2026-store'); window.location.reload() }}}
            className="w-full flex items-center justify-center gap-2 py-3 bg-earth-terra/10 hover:bg-earth-terra/20 border border-earth-terra/30 text-earth-terra text-sm font-bold rounded-xl transition-all">
            <AlertTriangle size={14}/> Resetar dados locais
          </button>
        </Section>
      )}

      {!currentUser && (
        <div className="text-center py-8 text-earth-stone">
          <Shield size={32} className="mx-auto mb-3 opacity-30"/>
          <p className="font-semibold">Faça login para ver as configurações completas</p>
        </div>
      )}

      <p className="text-center text-[10px] text-earth-stone/40 font-medium pt-2">
        QUARTZO LOGISTICS v1.0 · React + Zustand + Netlify
      </p>
    </div>
  )
}
