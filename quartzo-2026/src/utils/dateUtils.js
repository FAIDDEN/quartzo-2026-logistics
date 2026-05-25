// Excel serial date to JS Date
// Excel epoch: Dec 30, 1899 (with leap year bug)
export function excelDateToISO(serial) {
  if (!serial || isNaN(serial)) return null
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000))
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Excel time fraction (0–1) to HH:MM string
export function excelTimeToHHMM(frac) {
  if (frac === undefined || frac === null || isNaN(frac)) return null
  const totalMin = Math.round(frac * 1440)
  const h = Math.floor(totalMin / 60) % 24
  const m = totalMin % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// "2026-06-04" → "04/06"
export function isoToShort(iso) {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

// "2026-06-04" → label
export const DAY_LABELS = {
  '2026-06-02': 'Pré-evento',
  '2026-06-03': 'WELCOME',
  '2026-06-04': 'AMETISTA',
  '2026-06-05': 'JADE',
  '2026-06-06': 'AFTER / ÁGATA',
  '2026-06-07': 'Pós (Sáb)',
  '2026-06-08': 'Pós (Dom)',
}

export function dayLabel(iso) {
  return DAY_LABELS[iso] || iso
}

// Add hours to a "HH:MM" string
export function addHours(hhmm, h) {
  if (!hhmm) return null
  const [hh, mm] = hhmm.split(':').map(Number)
  const total = (hh + h) * 60 + mm
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

// Minutes between two HH:MM strings (can cross midnight)
export function minutesBetween(from, to) {
  if (!from || !to) return null
  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  let diff = toMin(to) - toMin(from)
  if (diff < 0) diff += 1440
  return diff
}

// Format datetime for display
export function formatDateTime(iso, hhmm) {
  if (!iso && !hhmm) return '—'
  const parts = []
  if (iso) parts.push(isoToShort(iso))
  if (hhmm) parts.push(hhmm)
  return parts.join(' · ')
}

export const EVENT_STAGES = {
  '2026-06-03': { name: 'WELCOME',  start: '20:00', end: '02:00' },
  '2026-06-04': { name: 'AMETISTA', start: '16:00', end: '02:00' },
  '2026-06-05': { name: 'JADE',     start: '16:00', end: '02:00' },
  '2026-06-06': { name: 'ÁGATA',    start: '22:00', end: '08:00' },
}

export function getEventWindow(day) {
  return EVENT_STAGES[day] || null
}
