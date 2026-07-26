// date/time display helpers, no libraries, easy to unit test

export function formatDate(isoDate: string, locale = 'en-US'): string {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}

// "18:30" -> "6:30 PM"
export function formatTime(time?: string | null): string {
  if (!time) return ''
  const [hoursStr, minutesStr] = time.split(':')
  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
}

export function formatDateTimeRange(date: string, startTime: string, endTime?: string | null): string {
  const day = formatDate(date)
  const start = formatTime(startTime)
  if (!endTime) return `${day} · ${start}`
  return `${day} · ${start} – ${formatTime(endTime)}`
}

// used in the image uploader preview, e.g. "1.4 MB"
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

export function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}