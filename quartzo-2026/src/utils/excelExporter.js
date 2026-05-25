import * as XLSX from 'xlsx'
import { isoToShort } from './dateUtils'

function styledCell(value, modified = false) {
  return modified ? `${value} [*]` : value
}

function buildFlightsSheet(artists) {
  const rows = [['DATA','HORA VOO','CIA AÉREA','Nº DO VOO','ORIGEM','CHEGADA','DESTINO','PASSAGEIRO','STATUS','OBSERVAÇÕES']]
  const allFlights = []
  for (const a of artists) {
    for (const f of [...(a.flightsIn || []), ...(a.flightsOut || [])]) {
      allFlights.push({ ...f, artistName: a.name, modified: f.modifiedInApp || a.modifiedInApp })
    }
  }
  allFlights.sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.departureTime || '').localeCompare(b.departureTime || ''))

  for (const f of allFlights) {
    rows.push([
      styledCell(isoToShort(f.date) || '', f.modified),
      f.departureTime || '',
      f.airline || '',
      f.flightNumber || '',
      f.origin || '',
      f.arrivalTime || '',
      f.destination || '',
      f.passenger || f.artistName,
      f.status || '',
      f.notes || '',
    ])
  }
  return rows
}

function buildHospedagemSheet(hotels) {
  const rows = [['HOTEL','QUARTO','CATEGORIA','CHECK IN','Nº DE DIÁRIAS','CHECK OUT','HOSPEDE','REF ARTISTA','TELEFONE','STATUS','OBSERVAÇÕES']]
  for (const h of hotels) {
    rows.push([
      styledCell(h.hotel, h.modifiedInApp),
      h.room, h.category,
      isoToShort(h.checkIn), h.nights, isoToShort(h.checkOut),
      h.guest, h.artistRef, h.phone, h.status, h.notes,
    ])
  }
  return rows
}

function buildTransferSheet(transfers) {
  const rows = [['DATA','HORA','VEÍCULO','CATEGORIA','PLACA','ORIGEM','CHEGADA','DESTINO','STATUS PASS','PASSAGEIRO','TEL RESPONSÁVEL','MOTORISTA','TEL MOTORISTA','STATUS','OBSERVAÇÕES']]
  for (const t of transfers) {
    rows.push([
      styledCell(isoToShort(t.date), t.modifiedInApp),
      t.time, t.vehicle, t.category, t.plate,
      t.origin, t.arrivalTime, t.destination,
      t.passengerStatus, t.passenger, t.contactPassenger,
      t.driverName, t.contactDriver, t.status, t.notes,
    ])
  }
  return rows
}

export function exportToExcel(artists, hotels, transfersAero, transfersInterno) {
  const wb = XLSX.utils.book_new()

  const ws1 = XLSX.utils.aoa_to_sheet(buildFlightsSheet(artists))
  const ws2 = XLSX.utils.aoa_to_sheet(buildHospedagemSheet(hotels))
  const ws3 = XLSX.utils.aoa_to_sheet(buildTransferSheet(transfersAero))
  const ws4 = XLSX.utils.aoa_to_sheet(buildTransferSheet(transfersInterno))

  // Artist summary sheet
  const summaryRows = [['ARTISTA','PALCO','DIA','HORÁRIO','HOTEL','CHECK-IN','VOOS IN','VOOS OUT','MOTORISTA IN','STATUS CHECKS']]
  for (const a of artists) {
    const sets = (a.sets || []).map(s => `${isoToShort(s.day)} ${s.startTime} - ${s.stage}`).join(' | ')
    const flIn  = (a.flightsIn  || []).map(f => `${f.flightNumber} ${isoToShort(f.date)} ${f.departureTime}`).join(' | ')
    const flOut = (a.flightsOut || []).map(f => `${f.flightNumber} ${isoToShort(f.date)} ${f.departureTime}`).join(' | ')
    const checksComplete = Object.values(a.checks || {}).filter(Boolean).length
    const checksTotal = Object.keys(a.checks || {}).length
    summaryRows.push([
      styledCell(a.name, a.modifiedInApp), a.sets?.[0]?.stage || '', a.sets?.[0]?.day || '',
      a.sets?.[0]?.startTime || '', a.hotel?.name || (a.accommodationType === 'proprio' ? 'Resolve próprio' : ''),
      a.hotel?.checkIn || '', flIn, flOut,
      a.transfersIn?.[0]?.driverName || '',
      `${checksComplete}/${checksTotal}`,
    ])
  }
  const ws5 = XLSX.utils.aoa_to_sheet(summaryRows)

  XLSX.utils.book_append_sheet(wb, ws1, 'VOOS')
  XLSX.utils.book_append_sheet(wb, ws2, 'HOSPEDAGEM')
  XLSX.utils.book_append_sheet(wb, ws3, 'TRANSFER IN E OUT AERO')
  XLSX.utils.book_append_sheet(wb, ws4, 'TRASFER INTERNO CHAPADA')
  XLSX.utils.book_append_sheet(wb, ws5, 'RESUMO ARTISTAS')

  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`
  XLSX.writeFile(wb, `LOG_QUARTZO_2026_export_${stamp}.xlsx`)
}
