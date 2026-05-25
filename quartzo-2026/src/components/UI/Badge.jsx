const variants = {
  ok:      'badge-ok',
  warn:    'badge-warn',
  danger:  'badge-danger',
  pending: 'badge-pending',
  intl:    'badge-intl',
  info:    'bg-q-700 text-earth-sand',
  neutral: 'bg-q-800 text-earth-stone',
}

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span className={`${variants[variant] || variants.neutral} text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${className}`}>
      {children}
    </span>
  )
}
