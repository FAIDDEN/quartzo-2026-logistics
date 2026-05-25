import * as XLSX from 'xlsx'
import { excelDateToISO, excelTimeToHHMM } from './dateUtils'
import { v4 as uuidv4 } from 'uuid'

function parseFlightsSheet(ws) {
  const flights = []
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
  if (!rows || rows.length < 2) return flights
  // Header: DATA, HORA VOO, CIA AÉREA, Nº DO VOO, ORIGEM, CHEGADA, DESTINO, PASSAGEIRO, STATUS, OBSERVAÇÕES
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length < 8) continue
    const dateRaw = r[0], timeRaw = r[1], airline = r[2], flightNum = r[3]
    const origin = r[4], arrivalRaw = r[5], dest = r[6], pax = r[7], status = r[8], obs = r[9]

    const date = typeof dateRaw === 'number' ? excelDateToISO(dateRaw) : dateRaw
    const time = typeof timeRaw === 'number' ? excelTimeToHHMM(timeRaw) : (timeRaw || null)
    const arrTime = typeof arrivalRaw === 'number' ? excelTimeToHHMM(arrivalRaw) : (String(arrivalRaw || ''))

    if (!pax && !date) continue

    const isIntl = String(airline || '').toLowerCase().includes('int') ||
      ['MIA','LIM','LIS','GRU'].includes(String(origin || '').toUpperCase()) && String(dest || '').toUpperCase() !== 'BSB'

    flights.push({
      id: uuidv4(),
      date,
      departureTime: time,
      airline: String(airline || ''),
      flightNumber: String(flightNum || ''),
      origin: String(origin || ''),
      destination: String(dest || ''),
      arrivalTime: arrTime,
      passenger: String(pax || ''),
      status: String(status || 'PENDENTE'),
      notes: String(obs || ''),
      isInternational: isIntl,
      direction: ['BSB','GYN'].includes(String(dest || '').toUpperCase()) ? 'in' : 'out',
      modifiedInApp: false,
    })
  }
  return flights
}

function parseHospedagemSheet(ws) {
  const rooms = []
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
  if (!rows || rows.length < 2) return rooms
  // Header: HOTEL, QUARTO, CATEGORIA, CHECK IN, Nº DE DIÁRIAS, CHECK OUT, HOSPEDE, REF ARTISTA, TELEFONE, STATUS, OBSERVAÇÕES
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length < 7) continue
    const hotel = r[0], room = r[1], cat = r[2], ciRaw = r[3], nights = r[4], coRaw = r[5]
    const guest = r[6], ref = r[7], tel = r[8], status = r[9], obs = r[10]
    if (!hotel && !guest) continue

    rooms.push({
      id: uuidv4(),
      hotel: String(hotel || ''),
      room: String(room || ''),
      category: String(cat || ''),
      checkIn: typeof ciRaw === 'number' ? excelDateToISO(ciRaw) : String(ciRaw || ''),
      nights: nights || 1,
      checkOut: typeof coRaw === 'number' ? excelDateToISO(coRaw) : String(coRaw || ''),
      guest: String(guest || 'Livre'),
      artistRef: String(ref || ''),
      phone: String(tel || ''),
      status: String(status || ''),
      notes: String(obs || ''),
      modifiedInApp: false,
    })
  }
  return rooms
}

function parseTimetableSheet(ws) {
  const entries = []
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
  if (!rows || rows.length < 3) return entries

  // Row 0: day headers (QUARTA - 03.06, etc.)
  // Row 1: stage labels (WELCOME, MAINSTAGE, ALQUIMIA, etc.)
  // Row 2: sub-headers (Horário, Artista)
  // Row 3+: data rows

  const days = ['2026-06-03','2026-06-04','2026-06-05','2026-06-06']
  const dayColMap = {} // colIndex → dayISO
  const stageColMap = {} // colIndex → stageName

  // Parse column mapping from rows 0-2
  const headerRow0 = rows[0] || []
  const headerRow1 = rows[1] || []
  const headerRow2 = rows[2] || []

  let dayIdx = 0
  for (let c = 0; c < headerRow0.length; c++) {
    const cell = String(headerRow0[c] || '')
    if (cell.includes('03.06') || cell.includes('QUARTA')) { dayColMap[c] = '2026-06-03'; dayIdx = 0 }
    else if (cell.includes('04.06') || cell.includes('QUINTA')) { dayColMap[c] = '2026-06-04'; dayIdx = 1 }
    else if (cell.includes('05.06') || cell.includes('SEXTA'))  { dayColMap[c] = '2026-06-05'; dayIdx = 2 }
    else if (cell.includes('06.06') || cell.includes('SÁBADO')) { dayColMap[c] = '2026-06-06'; dayIdx = 3 }
  }

  // Find stage columns from row1
  for (let c = 0; c < headerRow1.length; c++) {
    const cell = String(headerRow1[c] || '').toUpperCase()
    if (cell.includes('MAINSTAGE') || cell.includes('MAIN STAGE')) stageColMap[c] = 'MAINSTAGE'
    else if (cell.includes('ALQUIMIA')) stageColMap[c] = 'ALQUIMIA'
    else if (cell.includes('BÉSAME') || cell.includes('BESAME')) stageColMap[c] = 'BÉSAME'
    else if (cell.includes('AFTER')) stageColMap[c] = 'AFTER'
    else if (cell.includes('WELCOME')) stageColMap[c] = 'WELCOME'
  }

  // Find time/artist column pairs
  const colPairs = [] // [{dayISO, stage, timeCol, artistCol}]
  for (let c = 0; c < headerRow2.length; c += 2) {
    const timeHeader = String(headerRow2[c] || '').toLowerCase()
    const artHeader = String(headerRow2[c + 1] || '').toLowerCase()
    if (!timeHeader.includes('hor') && !artHeader.includes('art')) continue

    // Find which day and stage this column belongs to by looking at headers above
    let assignedDay = null, assignedStage = null
    for (let bk = c; bk >= 0; bk--) {
      if (dayColMap[bk] && !assignedDay) assignedDay = dayColMap[bk]
      if (stageColMap[bk] && !assignedStage) assignedStage = stageColMap[bk]
    }
    if (assignedDay && assignedStage) colPairs.push({ day: assignedDay, stage: assignedStage, timeCol: c, artistCol: c + 1 })
  }

  // Parse data rows
  for (let r = 3; r < rows.length; r++) {
    const row = rows[r] || []
    for (const cp of colPairs) {
      const timeRaw = row[cp.timeCol]
      const artRaw = row[cp.artistCol]
      if (!artRaw) continue
      const artistStr = String(artRaw).trim()
      if (!artistStr || artistStr === 'xxxxxxx') continue

      // Parse logistics type from artist name: "(H+T)", "(C)", "(T INTERNO)", etc.
      const logMatch = artistStr.match(/\(([^)]+)\)$/)
      const logisticsType = logMatch ? logMatch[1] : 'C'
      const cleanName = artistStr.replace(/\s*\([^)]*\)$/, '').trim()

      const timeStr = typeof timeRaw === 'number' ? excelTimeToHHMM(timeRaw) : (timeRaw ? String(timeRaw) : null)

      entries.push({
        id: uuidv4(),
        artistName: cleanName,
        day: cp.day,
        startTime: timeStr,
        stage: cp.stage,
        logisticsType,
        checked: false,
      })
    }
  }

  return entries
}

function parseTransferSheet(ws) {
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
  if (!rows || rows.length < 2) return []
  const transfers = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length < 10) continue
    const dateRaw = r[0], timeRaw = r[1], vehicle = r[2], cat = r[3], plate = r[4]
    const origin = r[5], arrival = r[6], dest = r[7], paxStatus = r[8], pax = r[9]
    const telPax = r[10], driver = r[11], telDriver = r[12], status = r[13], obs = r[14]
    if (!pax && !date) continue
    transfers.push({
      id: uuidv4(),
      date: typeof dateRaw === 'number' ? excelDateToISO(dateRaw) : String(dateRaw || ''),
      time: typeof timeRaw === 'number' ? excelTimeToHHMM(timeRaw) : String(timeRaw || ''),
      vehicle: String(vehicle || ''), category: String(cat || ''), plate: String(plate || ''),
      origin: String(origin || ''), arrivalTime: String(arrival || ''), destination: String(dest || ''),
      passengerStatus: String(paxStatus || ''), passenger: String(pax || ''),
      contactPassenger: String(telPax || ''), driverName: String(driver || ''),
      contactDriver: String(telDriver || ''), status: String(status || 'PENDENTE'),
      notes: String(obs || ''), modifiedInApp: false,
    })
  }
  return transfers
}

export function parseExcelFile(buffer) {
  const wb = XLSX.read(buffer, { type: 'array' })
  const result = {
    flights: [],
    hotels: [],
    timetable: [],
    transfersAero: [],
    transfersInterno: [],
    raw: {},
  }

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName]
    const name = sheetName.toUpperCase()
    result.raw[sheetName] = XLSX.utils.sheet_to_json(ws, { header: 1 })

    if (name.includes('VOO'))            result.flights = parseFlightsSheet(ws)
    else if (name.includes('HOSPEDAGEM'))result.hotels  = parseHospedagemSheet(ws)
    else if (name.includes('TIME'))      result.timetable = parseTimetableSheet(ws)
    else if (name.includes('AERO'))      result.transfersAero = parseTransferSheet(ws)
    else if (name.includes('INTERNO') || name.includes('CHAPADA')) result.transfersInterno = parseTransferSheet(ws)
  }

  return result
}
