import { useState, useMemo } from 'react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

const EVENT_DAYS = [
  { key: '03/06', label: 'WELCOME',  color: 'border-earth-sage text-earth-sage',   bg: 'bg-earth-sage/10' },
  { key: '04/06', label: 'AMETISTA', color: 'border-purple-500 text-purple-400',   bg: 'bg-purple-500/10' },
  { key: '05/06', label: 'JADE',     color: 'border-green-500 text-green-400',     bg: 'bg-green-500/10'  },
  { key: '06/06', label: 'AFTER/ÁGATA', color: 'border-q-300 text-q-300',         bg: 'bg-q-300/10'     },
]

const STAGES = ['MAINSTAGE', 'ALQUIMIA', 'BÉSAME', 'AFTER', 'WELCOME']

export default function TimeTable() {
  const { artists, lang } = useStore(s => ({ artists: s.artists, lang: s.lang }))
  const { t } = useI18n(lang)
  const [selectedDay, setSelectedDay] = useState('04/06')

  const dayInfo = EVENT_DAYS.find(d => d.key === selectedDay)

  const byStage = useMemo(() => {
    const map = {}
    STAGES.forEach(st => { map[st] = [] })
    artists.forEach(artist => {
      (artist.sets || []).forEach(set => {
        if (set.day === selectedDay && map[set.stage]) {
          map[set.stage].push({ artist, set })
        } else if (set.day === selectedDay && !map[set.stage]) {
          map[set.stage] = [{ artist, set }]
        }
      })
    })
    // Sort by time within each stage
    Object.keys(map).forEach(st => {
      map[st].sort((a, b) => (a.set.time || '').localeCompare(b.set.time || ''))
    })
    return map
  }, [artists, selectedDay])

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div>
        <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('timetable')}</h1>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 flex-wrap">
        {EVENT_DAYS.map(d => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`px-4 py-2 rounded-xl text-xs border transition-all ${selectedDay === d.key
              ? `${d.color} ${d.bg} border-current font-medium`
              : 'border-q-750 text-earth-stone hover:text-earth-cream hover:border-q-600'}`}
          >
            <div className="font-display tracking-wider">{d.label}</div>
            <div className="text-[9px] mt-0.5 opacity-70">{d.key}</div>
          </button>
        ))}
      </div>

      {/* Stage columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const acts = byStage[stage] || []
          return (
            <div key={stage} className="bg-q-900 border border-q-750 rounded-xl overflow-hidden">
              <div className="bg-q-850 px-3 py-2 border-b border-q-750">
                <div className={`font-display text-[11px] tracking-widest ${dayInfo?.color}`}>{stage}</div>
                <div className="text-[10px] text-earth-stone">{acts.length} {lang === 'pt' ? 'atrações' : 'acts'}</div>
              </div>
              <div className="p-2 space-y-1.5 min-h-[80px]">
                {acts.length === 0 && (
                  <p className="text-[10px] text-earth-stone italic text-center pt-4">{lang === 'pt' ? 'Sem atrações' : 'No acts'}</p>
                )}
                {acts.map(({ artist, set }, i) => (
                  <div key={i} className={`${dayInfo?.bg} border ${dayInfo?.color.split(' ')[0]} rounded-lg px-2 py-1.5`}>
                    {set.time && (
                      <div className="text-[9px] text-earth-stone font-mono">{set.time}</div>
                    )}
                    <div className="text-xs text-earth-cream font-medium truncate">{artist.name}</div>
                    {set.logisticsType && (
                      <div className="text-[9px] text-earth-stone mt-0.5">{set.logisticsType}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
