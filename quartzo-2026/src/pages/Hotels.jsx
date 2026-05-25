import { useMemo } from 'react'
import { Hotel, Users } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

const HOTEL_ORDER = ['BAGUA', 'CAMINHO CACHOEIRA', 'BAMBU BRASIL']

export default function Hotels() {
  const { artists, hotelRooms, lang } = useStore(s => ({ artists: s.artists, hotelRooms: s.hotels, lang: s.lang }))
  const { t } = useI18n(lang)

  const hotelMap = useMemo(() => {
    const map = {}
    HOTEL_ORDER.forEach(h => { map[h] = [] })
    artists.forEach(a => {
      if (a.hotel && map[a.hotel]) {
        map[a.hotel].push(a)
      }
    })
    // Also handle colocados
    const colocados = artists.filter(a => a.accommodationType === 'C' || (!a.hotel && a.accommodationType))
    return { map, colocados }
  }, [artists])

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('hotels')}</h1>
        <p className="text-xs text-earth-stone">{lang === 'pt' ? '3 hotéis · São Jorge, GO' : '3 hotels · São Jorge, GO'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {HOTEL_ORDER.map(hotelName => {
          const guests = hotelMap.map[hotelName] || []
          const rooms = (hotelRooms || []).filter(r => r.hotel === hotelName)
          return (
            <div key={hotelName} className="bg-q-900 border border-q-750 rounded-xl overflow-hidden">
              {/* Hotel header */}
              <div className="bg-q-850 px-4 py-3 border-b border-q-750">
                <div className="flex items-center gap-2">
                  <Hotel size={14} className="text-q-300" />
                  <span className="font-display text-sm tracking-widest text-earth-cream">{hotelName}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-earth-stone">
                  <Users size={10} />
                  {guests.length} {lang === 'pt' ? 'hóspedes' : 'guests'}
                  {rooms.length > 0 && <> · {rooms.length} {lang === 'pt' ? 'quartos' : 'rooms'}</>}
                </div>
              </div>

              {/* Rooms */}
              <div className="p-3 space-y-2">
                {guests.length === 0 && (
                  <p className="text-xs text-earth-stone italic text-center py-4">{lang === 'pt' ? 'Sem hóspedes cadastrados' : 'No guests registered'}</p>
                )}
                {guests.map(a => (
                  <div key={a.id} className="bg-q-850 rounded-lg px-3 py-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-earth-cream font-medium">{a.name}</div>
                      <div className="text-[10px] text-earth-stone">
                        {a.room && `${lang === 'pt' ? 'Qt' : 'Rm'}. ${a.room}`}
                        {a.hotelDates && ` · ${a.hotelDates}`}
                      </div>
                    </div>
                    {a.sets?.[0] && (
                      <span className="text-[9px] bg-q-800 text-earth-sand rounded px-1.5 py-0.5">
                        {a.sets[0].day}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Colocados (self-arranged) */}
      {hotelMap.colocados.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-earth-stone mb-2 uppercase tracking-wider">
            {lang === 'pt' ? 'Colocados (hospedagem própria)' : 'Self-arranged accommodation'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {hotelMap.colocados.map(a => (
              <span key={a.id} className="text-xs bg-q-850 border border-q-750 text-earth-stone rounded-lg px-2.5 py-1">{a.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
