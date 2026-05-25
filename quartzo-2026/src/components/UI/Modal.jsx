import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-q-900 border border-q-750 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up ${wide ? 'w-full max-w-3xl' : 'w-full max-w-xl'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-q-750 shrink-0">
          <h2 className="font-display text-sm tracking-widest text-earth-cream">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-q-800 text-earth-stone hover:text-earth-cream transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
