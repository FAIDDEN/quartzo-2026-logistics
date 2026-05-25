import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import { INITIAL_ARTISTS, INITIAL_HOTEL_ROOMS, INITIAL_DRIVERS,
  INITIAL_TRANSFERS_AERO, INITIAL_TRANSFERS_INTERNO, DEFAULT_USERS } from '../data/seed'
import { runAllAlerts } from '../utils/alertEngine'
import { parseExcelFile } from '../utils/excelParser'
import { exportToExcel } from '../utils/excelExporter'

const AI_ENDPOINT = '/.netlify/functions/claude'

// ─── helpers ─────────────────────────────────────────────────────────────────
function buildContext(state) {
  const { artists, hotels, transfersAero, transfersInterno, drivers } = state
  return JSON.stringify({
    festival: {
      name: 'Quartzo 2026', theme: 'Sincronicidade',
      location: 'Fazenda Água Fria, Alto Paraíso de Goiás - GO',
      schedule: [
        { day:'03/06', name:'WELCOME',  time:'20h-02h' },
        { day:'04/06', name:'AMETISTA', time:'16h-02h' },
        { day:'05/06', name:'JADE',     time:'16h-02h' },
        { day:'06/06', name:'AFTER',    time:'02h-07h' },
        { day:'06/06', name:'ÁGATA',    time:'22h-08h' },
      ],
    },
    artists: artists.map(a => ({
      name: a.name, sets: a.sets, hotel: a.hotel,
      flightsIn: a.flightsIn, flightsOut: a.flightsOut,
      contact: a.contact, checks: a.checks,
      notes: a.notes, accommodationType: a.accommodationType,
    })),
    drivers, hotelsCount: hotels.length,
  }, null, 2).slice(0, 12000) // trim for token budget
}

// ─── store ────────────────────────────────────────────────────────────────────

// ─── data normalizer (bridges seed format → component format) ────────────────
function fmtDate(d) {
  // '2026-06-04' → '04/06', already '04/06' passes through
  if (!d) return ''
  if (d.includes('-')) {
    const parts = d.split('-')
    return `${parts[2]}/${parts[1]}`
  }
  return d
}

function normalizeArtist(a) {
  return {
    ...a,
    // hotel: object → flat string + room field
    hotel: a.hotel ? (typeof a.hotel === 'string' ? a.hotel : a.hotel.name) : '',
    room:  a.hotel && typeof a.hotel === 'object' ? a.hotel.room : (a.room || ''),
    hotelDates: a.hotel && typeof a.hotel === 'object'
      ? `${fmtDate(a.hotel.checkIn)} → ${fmtDate(a.hotel.checkOut)}`
      : (a.hotelDates || ''),
    // sets: normalize day format and time
    sets: (a.sets || []).map(s => ({
      ...s,
      day:   fmtDate(s.day || s.date || ''),
      stage: s.stage || '',
      time:  s.time || (s.startTime && s.endTime ? `${s.startTime}–${s.endTime}` : s.startTime || ''),
      logisticsType: s.logisticsType || '',
    })),
    // flightsIn: normalize field names
    flightsIn: (a.flightsIn || []).map(f => ({
      ...f,
      flightNo:  f.flightNo  || f.flightNumber || f.flight || '',
      from:      f.from      || f.origin       || f.departure_airport || '',
      to:        f.to        || f.destination  || f.arrival_airport   || '',
      departure: f.departure || f.departureTime || f.dep_time || '',
      arrival:   f.arrival   || f.arrivalTime   || f.arr_time || '',
      date:      fmtDate(f.date || ''),
    })),
    flightsOut: (a.flightsOut || []).map(f => ({
      ...f,
      flightNo:  f.flightNo  || f.flightNumber || f.flight || '',
      from:      f.from      || f.origin       || '',
      to:        f.to        || f.destination  || '',
      departure: f.departure || f.departureTime || '',
      arrival:   f.arrival   || f.arrivalTime   || '',
      date:      fmtDate(f.date || ''),
    })),
    // language
    language: a.language || (a.languages ? a.languages[0] : '') || '',
    // ensure arrays exist
    incidents: a.incidents || [],
    transfersAero:    a.transfersAero    || a.transfersIn  || [],
    transfersInterno: a.transfersInterno || a.transfersOut || [],
    checks: a.checks || {},
  }
}

const useStore = create(
  persist(
    (set, get) => ({
      // ── auth ──────────────────────────────────────────────────────────────
      currentUser: null,
      users: DEFAULT_USERS,

      login(email, password) {
        const u = get().users.find(u => u.email === email && u.password === password)
        if (!u) return false
        set({ currentUser: u })
        return true
      },
      logout() { set({ currentUser: null }) },

      // ── data ──────────────────────────────────────────────────────────────
      artists:           INITIAL_ARTISTS.map(normalizeArtist),
      hotels:            INITIAL_HOTEL_ROOMS,
      drivers:           INITIAL_DRIVERS,
      transfersAero:     INITIAL_TRANSFERS_AERO,
      transfersInterno:  INITIAL_TRANSFERS_INTERNO,

      // ── ui ────────────────────────────────────────────────────────────────
      lang:         'pt',
      page:         'dashboard',
      sidebarOpen:  true,
      chatOpen:     false,
      importOpen:   false,
      apiKey:       '',

      chatLoading:    false,

      setLang:        (l)  => set({ lang: l }),
      navigate:       (p)  => set({ page: p }),
      setPage:        (p)  => set({ page: p }),
      setSidebar:     (v)  => set({ sidebarOpen: v }),
      toggleChat:     ()   => set(s => ({ chatOpen: !s.chatOpen })),
      toggleImport:   ()   => set(s => ({ importOpen: !s.importOpen })),
      setApiKey:      (k)  => set({ apiKey: k }),

      // ── artists ───────────────────────────────────────────────────────────
      updateArtist(id, data) {
        set(s => ({
          artists: s.artists.map(a =>
            a.id === id ? { ...a, ...data, modifiedInApp: true, modifiedAt: new Date().toISOString() } : a
          )
        }))
      },

      addArtist(data) {
        const artist = {
          id: uuid(), modifiedInApp: true, modifiedAt: new Date().toISOString(),
          checks: { flightInConfirmed:false,airportPickup:false,hotelCheckin:false,
            transferToVenue:false,setPlayed:false,transferFromVenue:false,
            hotelCheckout:false,airportDropoff:false,flightOutConfirmed:false },
          incidents: [], sets: [], flightsIn: [], flightsOut: [],
          transfersIn: [], transfersOut: [],
          ...data,
        }
        set(s => ({ artists: [...s.artists, artist] }))
        return artist.id
      },

      deleteArtist(id) {
        set(s => ({ artists: s.artists.filter(a => a.id !== id) }))
      },

      addIncident(artistId, description) {
        const incident = { id: uuid(), timestamp: new Date().toISOString(), description, author: get().currentUser?.name || 'Sistema' }
        set(s => ({
          artists: s.artists.map(a =>
            a.id === artistId
              ? { ...a, incidents: [...(a.incidents || []), incident], modifiedInApp: true }
              : a
          )
        }))
      },

      toggleCheck(artistId, checkKey) {
        set(s => ({
          artists: s.artists.map(a => {
            if (a.id !== artistId) return a
            const checks = { ...(a.checks || {}), [checkKey]: !a.checks?.[checkKey] }
            return { ...a, checks, modifiedInApp: true, modifiedAt: new Date().toISOString() }
          })
        }))
      },

      addFlightToArtist(artistId, flight, dir) {
        const f = { ...flight, id: uuid(), direction: dir, modifiedInApp: true }
        set(s => ({
          artists: s.artists.map(a =>
            a.id === artistId
              ? { ...a, [dir === 'in' ? 'flightsIn' : 'flightsOut']: [...(a[dir === 'in' ? 'flightsIn' : 'flightsOut'] || []), f], modifiedInApp: true }
              : a
          )
        }))
      },

      updateFlight(artistId, flightId, data, dir) {
        const key = dir === 'in' ? 'flightsIn' : 'flightsOut'
        set(s => ({
          artists: s.artists.map(a =>
            a.id === artistId
              ? { ...a, [key]: (a[key] || []).map(f => f.id === flightId ? { ...f, ...data, modifiedInApp: true } : f), modifiedInApp: true }
              : a
          )
        }))
      },

      addTransfer(t, type) {
        const rec = { ...t, id: uuid(), modifiedInApp: true }
        set(s => ({
          [type === 'aero' ? 'transfersAero' : 'transfersInterno']:
            [...s[type === 'aero' ? 'transfersAero' : 'transfersInterno'], rec]
        }))
      },

      updateTransfer(id, data, type) {
        const key = type === 'aero' ? 'transfersAero' : 'transfersInterno'
        set(s => ({
          [key]: s[key].map(t => t.id === id ? { ...t, ...data, modifiedInApp: true } : t)
        }))
      },

      updateHotel(id, data) {
        set(s => ({
          hotels: s.hotels.map(h => h.id === id ? { ...h, ...data, modifiedInApp: true } : h)
        }))
      },

      addDriver(d) {
        set(s => ({ drivers: [...s.drivers, { ...d, id: uuid(), modifiedInApp: true }] }))
      },

      updateDriver(id, data) {
        set(s => ({ drivers: s.drivers.map(d => d.id === id ? { ...d, ...data, modifiedInApp: true } : d) }))
      },

      deleteDriver(id) {
        set(s => ({ drivers: s.drivers.filter(d => d.id !== id) }))
      },

      // ── alerts (computed on access, safe with Zustand persist) ────────────
      getAlerts() { return runAllAlerts(get().artists) },

      // ── excel import ──────────────────────────────────────────────────────
      importResult: null,

      async processImport(fileBuffer) {
        const parsed = parseExcelFile(fileBuffer)
        // Detect conflicts with existing data
        const conflicts = []
        const newItems  = []

        // Match flights to existing artists by passenger name
        for (const f of parsed.flights) {
          const match = get().artists.find(a =>
            f.passenger && (
              f.passenger.toLowerCase().includes(a.name.toLowerCase()) ||
              (a.fullName && f.passenger.toLowerCase().includes(a.fullName.toLowerCase()))
            )
          )
          if (match) {
            const dir = f.direction
            const existing = (match[dir === 'in' ? 'flightsIn' : 'flightsOut'] || [])
            const dup = existing.find(e => e.flightNumber === f.flightNumber && e.date === f.date)
            if (dup) conflicts.push({ type: 'flight', artistId: match.id, old: dup, new: f })
            else newItems.push({ type: 'flight', artistId: match.id, data: f, dir })
          }
        }

        // Hotels
        for (const h of parsed.hotels) {
          const dup = get().hotels.find(e => e.hotel === h.hotel && e.room === h.room && e.checkIn === h.checkIn)
          if (dup) conflicts.push({ type: 'hotel', old: dup, new: h })
          else newItems.push({ type: 'hotel', data: h })
        }

        // Timetable entries → update artist sets
        for (const entry of parsed.timetable) {
          const match = get().artists.find(a => a.name.toLowerCase().includes(entry.artistName.toLowerCase()))
          if (match) {
            const dup = (match.sets || []).find(s => s.day === entry.day && s.stage === entry.stage)
            if (!dup) newItems.push({ type: 'set', artistId: match.id, data: entry })
          } else {
            newItems.push({ type: 'newArtist', data: entry })
          }
        }

        set({ importResult: { conflicts, newItems, parsed } })
        return { conflicts, newItems }
      },

      applyImport(overwriteConflicts = false) {
        const { importResult } = get()
        if (!importResult) return

        for (const item of importResult.newItems) {
          if (item.type === 'flight')
            get().addFlightToArtist(item.artistId, item.data, item.dir)
          else if (item.type === 'hotel')
            set(s => ({ hotels: [...s.hotels, { ...item.data, id: uuid() }] }))
          else if (item.type === 'set')
            set(s => ({ artists: s.artists.map(a => a.id === item.artistId ? { ...a, sets: [...(a.sets||[]), { ...item.data, id: uuid() }] } : a) }))
          else if (item.type === 'newArtist') {
            get().addArtist({ name: item.data.artistName, sets: [{ ...item.data, id: uuid() }] })
          }
        }

        if (overwriteConflicts) {
          for (const c of importResult.conflicts) {
            if (c.type === 'hotel') get().updateHotel(c.old.id, c.new)
            else if (c.type === 'flight') get().updateFlight(c.artistId, c.old.id, c.new, c.old.direction)
          }
        }
        set({ importResult: null })
      },


      // ── importExcel (called from UI components) ───────────────────────────
      async importExcel(file) {
        const buf = await file.arrayBuffer()
        const result = await get().processImport(buf)
        get().applyImport(false)
        return { added: result.newItems?.length || 0, conflicts: result.conflicts || [] }
      },

      // ── exportExcel (called from UI components) ───────────────────────────
      exportExcel() {
        const { artists, hotels, transfersAero, transfersInterno } = get()
        exportToExcel(artists, hotels, transfersAero, transfersInterno)
      },

      clearImportResult() { set({ importResult: null }) },

      // ── AI ────────────────────────────────────────────────────────────────
      chatMessages: [],

      async sendChat(userMsg) {
        set(s => ({ chatMessages: [...s.chatMessages, { role:'user', content: userMsg }], chatLoading: true }))

        const ctx = buildContext(get())
        const messages = [
          ...get().chatMessages,
          { role:'user', content: userMsg },
        ]
        const systemPrompt = `Você é o assistente de logística do Festival Quartzo 2026, realizado de 03 a 06 de junho de 2026 na Fazenda Água Fria, Alto Paraíso de Goiás (Chapada dos Veadeiros). Responda de forma concisa e direta. Sempre que possível use emojis relevantes para facilitar leitura rápida.\n\nDados atuais do sistema:\n${ctx}`

        try {
          const res = await fetch(AI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1000,
              system: systemPrompt,
              messages: messages.slice(-10), // last 10 for context
            }),
          })
          const data = await res.json()
          const reply = data.content?.[0]?.text || 'Sem resposta.'
          set(s => ({ chatMessages: [...s.chatMessages, { role:'assistant', content: reply }], chatLoading: false }))
          return reply
        } catch (e) {
          const err = 'Erro ao conectar com a IA. Verifique a configuração.'
          set(s => ({ chatMessages: [...s.chatMessages, { role:'assistant', content: err }], chatLoading: false }))
          return err
        }
      },

      clearChat() { set({ chatMessages: [] }) },
    }),
    {
      name: 'quartzo-2026-store',
      onRehydrateStorage: () => (state) => {
        // Normalize artists that were stored in old format
        if (state?.artists) {
          state.artists = state.artists.map(normalizeArtist)
        }
      },
      partialize: s => ({
        currentUser: s.currentUser, users: s.users,
        artists: s.artists, hotels: s.hotels, drivers: s.drivers,
        transfersAero: s.transfersAero, transfersInterno: s.transfersInterno,
        lang: s.lang, apiKey: s.apiKey, chatMessages: s.chatMessages,
      }),
    }
  )
)

export { useStore }
export default useStore
