import { minutesBetween, addHours, getEventWindow } from './dateUtils'

// Timing constants (in minutes)
const DRIVE_BSB_CHAPADA = 180      // 3h Brasília → Chapada
const DRIVE_SJ_VENUE    = 60       // 1h São Jorge → Venue
const BUFFER_VENUE      = 30       // 30min before show
const BUFFER_HOTEL_STOP = 60       // 1h to stop at hotel first
const INTL_CHECKIN_MIN  = 90       // 1h30 before boarding
const DOMESTIC_CHECKIN  = 30       // 30min before boarding
const RED_MARGIN        = 120      // < 2h = RED alert
const YELLOW_MARGIN     = 180      // < 3h = YELLOW alert

// Returns { level: 'ok'|'yellow'|'red', message }
export function checkFlightInTiming(flight, artist) {
  if (!flight || !flight.arrivalTime || !flight.date) return null
  const sets = (artist.sets || []).filter(s => s.day >= flight.date)
  if (!sets.length) return null

  const firstSet = sets.sort((a, b) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime))[0]
  const eventDay  = getEventWindow(firstSet.day)
  if (!eventDay) return null

  // Available time from airport landing to needing to be at venue
  // Landing time + transfer to chapada + hotel stop + drive to venue + buffer = must arrive before set
  const landingTime  = flight.arrivalTime
  const setTime      = firstSet.startTime

  // Minutes from landing → set time (accounting for date wrap if set is next day)
  let totalMinutesAvail = minutesBetween(landingTime, setTime)
  if (flight.date < firstSet.day) totalMinutesAvail += 1440 // next day set

  // Required: drive to chapada (180min) + hotel (60min) + drive to venue (60min) + buffer (30min) = 330min
  const required = DRIVE_BSB_CHAPADA + BUFFER_HOTEL_STOP + DRIVE_SJ_VENUE + BUFFER_VENUE

  const margin = totalMinutesAvail - required

  if (margin < RED_MARGIN) {
    return {
      level: 'red',
      message: `⛔ ${artist.name} — Voo chega ${landingTime} e toca ${setTime} em ${firstSet.day}. Margem crítica: ${Math.round(totalMinutesAvail / 60 * 10) / 10}h`,
      artistId: artist.id,
      flightId: flight.id,
    }
  }
  if (margin < YELLOW_MARGIN) {
    return {
      level: 'yellow',
      message: `⚠️ ${artist.name} — Voo chega ${landingTime}, apresentação ${setTime}. Margem apertada.`,
      artistId: artist.id,
      flightId: flight.id,
    }
  }
  return null
}

export function checkFlightOutTiming(flight, artist) {
  if (!flight || !flight.date || !flight.departureTime) return null
  const sets = (artist.sets || []).filter(s => s.day <= flight.date)
  if (!sets.length) return null

  const lastSet = sets.sort((a, b) => b.day.localeCompare(a.day) || b.startTime.localeCompare(a.startTime))[0]
  if (!lastSet.endTime) return null

  const minNeeded = flight.isInternational
    ? DRIVE_SJ_VENUE + DRIVE_BSB_CHAPADA + INTL_CHECKIN_MIN
    : DRIVE_SJ_VENUE + DRIVE_BSB_CHAPADA + DOMESTIC_CHECKIN

  const available = minutesBetween(lastSet.endTime, flight.departureTime)

  if (available !== null && available < minNeeded) {
    return {
      level: 'red',
      message: `⛔ ${artist.name} — Set termina ${lastSet.endTime}, voo ${flight.departureTime}. Tempo insuficiente para aeroporto.`,
      artistId: artist.id,
      flightId: flight.id,
    }
  }
  return null
}

export function getMissingInfo(artist) {
  const missing = []
  const needsLogistic = ['H+T', 'T', 'H+T (van)', 'H alto+T'].some(t => 
    (artist.sets || []).some(s => s.logisticsType?.includes(t.split(' ')[0]))
  )
  const hasH = (artist.sets || []).some(s => s.logisticsType?.startsWith('H'))
  const hasT = (artist.sets || []).some(s => s.logisticsType?.includes('T') && !s.logisticsType?.includes('C'))

  if (hasH && !artist.hotel?.name) missing.push('hotel')
  if (hasT && !artist.flightsIn?.length && artist.accommodationType !== 'proprio') missing.push('flightIn')
  if (hasT && !artist.flightsOut?.length && artist.accommodationType !== 'proprio') missing.push('flightOut')
  if ((hasH || hasT) && !artist.contact?.phone) missing.push('contact')
  if (needsLogistic && !artist.transfersIn?.length) missing.push('transferIn')
  if (needsLogistic && !artist.transfersOut?.length) missing.push('transferOut')

  return missing
}

export function runAllAlerts(artists) {
  const alerts = []
  for (const artist of artists) {
    // Missing info
    const missing = getMissingInfo(artist)
    if (missing.length > 0) {
      alerts.push({
        level: 'info',
        message: `📋 ${artist.name} — Faltam informações: ${missing.join(', ')}`,
        artistId: artist.id,
        type: 'missing',
      })
    }
    // Flight in timing
    for (const f of (artist.flightsIn || [])) {
      const a = checkFlightInTiming(f, artist)
      if (a) alerts.push({ ...a, type: 'timing_in' })
    }
    // Flight out timing
    for (const f of (artist.flightsOut || [])) {
      const a = checkFlightOutTiming(f, artist)
      if (a) alerts.push({ ...a, type: 'timing_out' })
    }
    // Check order warnings
    const checks = artist.checks || {}
    const order = ['flightInConfirmed','airportPickup','hotelCheckin','transferToVenue','setPlayed','transferFromVenue','hotelCheckout','airportDropoff','flightOutConfirmed']
    for (let i = 1; i < order.length; i++) {
      if (checks[order[i]] && !checks[order[i - 1]]) {
        alerts.push({
          level: 'yellow',
          message: `⚠️ ${artist.name} — "${order[i]}" marcado mas "${order[i - 1]}" não. Verificar.`,
          artistId: artist.id,
          type: 'check_order',
        })
        break
      }
    }
  }
  return alerts.sort((a, b) => {
    const order = { red: 0, yellow: 1, info: 2 }
    return (order[a.level] ?? 3) - (order[b.level] ?? 3)
  })
}
