import { useState } from 'react'
import { Settings as SettingsIcon, Key, Globe, AlertTriangle, Check } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Settings() {
  const { lang, setLang, apiKey, setApiKey, currentUser } = useStore(s => ({
    lang: s.lang, setLang: s.setLang, apiKey: s.apiKey,
    setApiKey: s.setApiKey, currentUser: s.currentUser,
  }))
  const { t } = useI18n(lang)
  const isAdmin = currentUser?.role === 'admin'

  const [localKey, setLocalKey] = useState(apiKey || '')
  const [saved,    setSaved]    = useState(false)

  function handleSaveKey() {
    setApiKey(localKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    if (window.confirm(t('resetConfirm'))) {
      localStorage.removeItem('quartzo-2026-store')
      window.location.reload()
    }
  }

  return (
    <div className="p-5 space-y-6 animate-fade-in max-w-xl">
      <div>
        <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('settings')}</h1>
        <p className="text-xs text-earth-stone">{lang === 'pt' ? 'Configurações do sistema' : 'System configuration'}</p>
      </div>

      {/* Language */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} className="text-q-300" />
          <h2 className="text-xs font-medium text-earth-cream">{t('language')}</h2>
        </div>
        <div className="flex gap-2">
          {['pt', 'en'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${lang === l ? 'bg-q-750 border-q-500 text-q-300' : 'bg-q-850 border-q-750 text-earth-stone hover:text-earth-cream'}`}
            >
              {l === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Key size={14} className="text-q-300" />
          <h2 className="text-xs font-medium text-earth-cream">{t('apiKeyLabel')}</h2>
        </div>
        <p className="text-[11px] text-earth-stone leading-relaxed">{t('apiKeyDesc')}</p>
        <div className="bg-q-850 border border-earth-gold/30 rounded-lg px-3 py-2 text-[11px] text-earth-gold">
          ⚠️ {lang === 'pt'
            ? 'Recomendado: configure a variável de ambiente ANTHROPIC_API_KEY no painel do Netlify (Site settings → Environment variables). Não salve a chave no frontend em produção.'
            : 'Recommended: set ANTHROPIC_API_KEY as an environment variable in the Netlify dashboard (Site settings → Environment variables). Do not expose keys in frontend production.'
          }
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <input
              type="password"
              value={localKey}
              onChange={e => setLocalKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="input flex-1 text-xs font-mono"
            />
            <button
              onClick={handleSaveKey}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${saved ? 'bg-earth-sage text-q-950' : 'btn-primary'}`}
            >
              {saved ? <><Check size={13} />{t('saved')}</> : t('save')}
            </button>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <SettingsIcon size={14} className="text-q-300" />
          <h2 className="text-xs font-medium text-earth-cream">{lang === 'pt' ? 'Usuário atual' : 'Current user'}</h2>
        </div>
        <div className="bg-q-850 rounded-lg px-3 py-2 text-xs">
          <div className="text-earth-cream font-medium">{currentUser?.name}</div>
          <div className="text-earth-stone">{currentUser?.email}</div>
          <div className={`mt-1 text-[10px] uppercase tracking-wider font-medium ${currentUser?.role === 'admin' ? 'text-q-300' : 'text-earth-stone'}`}>
            {currentUser?.role === 'admin' ? (lang === 'pt' ? 'Administrador' : 'Administrator') : (lang === 'pt' ? 'Somente leitura' : 'Read only')}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      {isAdmin && (
        <div className="card border-earth-terra/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-earth-terra" />
            <h2 className="text-xs font-medium text-earth-terra">{t('dangerZone')}</h2>
          </div>
          <p className="text-[11px] text-earth-stone mb-3">
            {lang === 'pt'
              ? 'Apaga todos os dados salvos localmente (localStorage) e restaura o estado inicial com os dados de semente.'
              : 'Erases all locally saved data (localStorage) and restores the initial seed state.'
            }
          </p>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-earth-terra/10 hover:bg-earth-terra/20 border border-earth-terra/30 text-earth-terra text-xs rounded-lg transition-all"
          >
            <AlertTriangle size={12} />{t('resetData')}
          </button>
        </div>
      )}

      {/* Version info */}
      <div className="text-center text-[10px] text-earth-stone space-y-0.5 pt-4">
        <div className="font-display tracking-widest text-earth-stone/50">QUARTZO LOGISTICS</div>
        <div>v1.0 · Festival Quartzo 2026 · Chapada dos Veadeiros</div>
        <div>React 18 · Zustand · Vite · Netlify</div>
      </div>
    </div>
  )
}
