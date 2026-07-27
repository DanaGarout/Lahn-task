// Unit tests for the login form's client-side validation rules
// (bonus test coverage item: "Login form validation").
import { describe, expect, it } from 'vitest'
import { validateEmail, validatePassword, validateImageFile, validateTimeRange } from '@/utils/validators'

describe('validateEmail', () => {
  it('rejects an empty value', () => {
    expect(validateEmail('')).toBe('Email is required.')
  })

  it('rejects a malformed email', () => {
    expect(validateEmail('not-an-email')).toContain('valid email')
  })

  it('accepts a well-formed email', () => {
    expect(validateEmail('admin@eventify.dev')).toBe('')
  })
})

describe('validatePassword', () => {
  it('rejects an empty password', () => {
    expect(validatePassword('')).toBe('Password is required.')
  })

  it('rejects a too-short password', () => {
    expect(validatePassword('123')).toContain('6 characters')
  })

  it('accepts a valid password', () => {
    expect(validatePassword('password123')).toBe('')
  })
})

describe('validateImageFile', () => {
  function makeFile(type: string, sizeBytes: number): File {
    const blob = new Blob([new Uint8Array(sizeBytes)], { type })
    return new File([blob], 'test-image', { type })
  }

  it('rejects an unsupported file type', () => {
    const file = makeFile('application/pdf', 1024)
    expect(validateImageFile(file)).toContain('Unsupported')
  })

  it('rejects a file that is too large', () => {
    const file = makeFile('image/png', 6 * 1024 * 1024)
    expect(validateImageFile(file)).toContain('too large')
  })

  it('accepts a valid, appropriately-sized image', () => {
    const file = makeFile('image/png', 1024)
    expect(validateImageFile(file)).toBe('')
  })
})

describe('validateTimeRange', () => {
  it('rejects an end time before the start time', () => {
    expect(validateTimeRange('18:00', '17:00')).toContain('after start time')
  })

  it('accepts an end time after the start time', () => {
    expect(validateTimeRange('18:00', '19:00')).toBe('')
  })

  it('is a no-op when no end time is provided', () => {
    expect(validateTimeRange('18:00', '')).toBe('')
  })
})
