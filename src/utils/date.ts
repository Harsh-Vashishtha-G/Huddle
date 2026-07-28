// Parse PostgreSQL tstzrange to start and end dates
export function parseTstzrange(rangeStr: string) {
  const regex = /[\[\()]([^,]+),([^\]\)]+)[\]\)]/
  const match = rangeStr.match(regex)
  if (!match) return null
  const startStr = match[1].replace(/["']/g, '').trim()
  const endStr = match[2].replace(/["']/g, '').trim()
  return {
    start: new Date(startStr),
    end: new Date(endStr),
  }
}

// Format 24h time string (HH:mm) to 12h format with AM/PM
export function formatTimeAMPM(timeStr: string) {
  const [hourStr, minStr] = timeStr.split(':')
  const hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour.toString().padStart(2, '0')}:${minStr} ${ampm}`
}
