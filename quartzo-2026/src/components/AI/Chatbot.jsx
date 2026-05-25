import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Trash2, Sparkles } from 'lucide-react'
import { useStore } from '../../store'
import { useI18n } from '../../i18n'

const EXAMPLE_PROMPTS = {
  pt: [
    'Quais artistas chegam amanhã?',
    'Liste os alertas críticos de logística',
    'Quem toca no dia 04/06?',
    'Quais artistas estão no hotel BAGUA?',
    'Algum voo com problema de timing?',
  ],
  en: [
    'Which artists arrive tomorrow?',
    'List critical logistics alerts',
    'Who performs on June 4th?',
    'Which artists are at BAGUA hotel?',
    'Any flights with timing issues?',
  ],
}

export default function Chatbot() {
  const { lang, chatMessages, sendChat, clearChat, chatLoading } = useStore(s => ({
    lang: s.lang, chatMessages: s.chatMessages,
    sendChat: s.sendChat, clearChat: s.clearChat, chatLoading: s.chatLoading,
  }))
  const { t } = useI18n(lang)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, open])

  async function handleSend() {
    const msg = input.trim()
    if (!msg || chatLoading) return
    setInput('')
    await sendChat(msg)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-q-300 hover:bg-q-200 text-q-950 flex items-center justify-center shadow-lg shadow-q-950/60 transition-all hover:scale-105 z-[150]"
        title={t('aiChatbot')}
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[480px] bg-q-900 border border-q-750 rounded-2xl shadow-2xl flex flex-col z-[150] animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-q-750 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-q-300" />
              <span className="text-xs font-medium text-earth-cream">{t('aiChatbot')}</span>
            </div>
            <button onClick={clearChat} className="text-earth-stone hover:text-earth-terra p-1" title={t('clearChat')}>
              <Trash2 size={12} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.length === 0 && (
              <div>
                <p className="text-[11px] text-earth-stone mb-3 text-center">
                  {lang === 'pt' ? 'Olá! Como posso ajudar?' : 'Hello! How can I help?'}
                </p>
                <div className="space-y-1.5">
                  {EXAMPLE_PROMPTS[lang].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(p); }}
                      className="w-full text-left text-[10px] bg-q-850 hover:bg-q-800 border border-q-750 text-earth-stone hover:text-earth-cream rounded-lg px-2.5 py-1.5 transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user'
                    ? 'bg-q-750 text-earth-cream rounded-br-sm'
                    : 'bg-q-850 text-earth-sand rounded-bl-sm border border-q-750'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-q-850 border border-q-750 rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-q-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-q-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-q-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-q-750 shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={lang === 'pt' ? 'Pergunte algo...' : 'Ask something...'}
                className="input flex-1 text-xs py-1.5"
                disabled={chatLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || chatLoading}
                className="w-8 h-8 rounded-lg bg-q-300 hover:bg-q-200 disabled:opacity-40 text-q-950 flex items-center justify-center transition-all"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
