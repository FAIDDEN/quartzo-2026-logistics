import { useState } from 'react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Login() {
  const login = useStore(s => s.login)
  const lang = useStore(s => s.lang)
  const { t } = useI18n(lang)
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [err, setErr]     = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!login(email, pass)) setErr(t('loginError'))
  }

  return (
    <div className="min-h-screen bg-q-950 flex items-center justify-center relative overflow-hidden">
      {/* Background grain texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(200,151,58,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-sm mx-4 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <polygon points="30,4 56,20 56,40 30,56 4,40 4,20" fill="none" stroke="#C8973A" strokeWidth="1.5" opacity="0.6"/>
              <polygon points="30,12 48,22 48,38 30,48 12,38 12,22" fill="none" stroke="#C8973A" strokeWidth="1" opacity="0.8"/>
              <polygon points="30,20 40,26 40,34 30,40 20,34 20,26" fill="#C8973A" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl tracking-[0.15em] text-earth-cream">QUARTZO</h1>
          <p className="text-earth-stone text-xs tracking-widest mt-1 uppercase">Logistics 2026</p>
        </div>

        {/* Card */}
        <div className="bg-q-900 border border-q-750 rounded-xl p-6">
          <h2 className="text-earth-sand text-sm font-medium mb-4">{t('login')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('email')}</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="logistica@quartzo.com"
              />
            </div>
            <div>
              <label className="label">{t('password')}</label>
              <input
                type="password" required
                value={pass} onChange={e => setPass(e.target.value)}
                className="input" placeholder="••••••••"
              />
            </div>
            {err && <p className="text-earth-terra text-xs">{err}</p>}
            <button type="submit" className="btn-primary w-full">{t('enter')}</button>
          </form>
          <p className="text-earth-stone text-xs mt-4 text-center">
            admin@quartzo.com · admin123 &nbsp;|&nbsp; view@quartzo.com · view123
          </p>
        </div>

        <p className="text-center text-earth-stone text-xs mt-6 tracking-widest">
          SINCRONICIDADE · 03–06 JUN 2026
        </p>
      </div>
    </div>
  )
}
