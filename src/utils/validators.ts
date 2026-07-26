// each of these returns an error string, or '' if the value is fine —
// keeps the form code simple, e.g. errors.email = validateEmail(email)

export function validateRequired(value: string, fieldLabel = 'This field'): string {
  return value.trim().length === 0 ? `${fieldLabel} is required.` : ''
}

export function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required.'
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(value) ? '' : 'Enter a valid email address.'
}

export function validatePassword(value: string): string {
  if (!value) return 'Password is required.'
  if (value.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

export function validateMaxLength(value: string, max: number, fieldLabel = 'This field'): string {
  return value.length > max ? `${fieldLabel} must be ${max} characters or fewer.` : ''
}

export function validateDate(value: string): string {
  if (!value) return 'Date is required.'
  return Number.isNaN(new Date(value).getTime()) ? 'Enter a valid date.' : ''
}

export function validateTime(value: string): string {
  if (!value) return 'Start time is required.'
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/
  return timePattern.test(value) ? '' : 'Enter a valid time (HH:MM).'
}

export function validateTimeRange(startTime: string, endTime: string): string {
  if (!endTime) return ''
  if (!startTime) return ''
  return endTime <= startTime ? 'End time must be after start time.' : ''
}

export interface ImageValidationOptions {
  maxSizeMb?: number
  allowedTypes?: string[]
}

export function validateImageFile(
  file: File,
  { maxSizeMb = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] }: ImageValidationOptions = {},
): string {
  if (!allowedTypes.includes(file.type)) {
    return 'Unsupported image format. Please upload a JPG, PNG, or WEBP file.'
  }
  const maxBytes = maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return `Image is too large. Maximum allowed size is ${maxSizeMb}MB.`
  }
  return ''
}