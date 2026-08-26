import { formatCurrency, formatDate, getInitials } from './utils'

describe('formatCurrency', () => {
  it('formats with TR locale by default', () => {
    const result = formatCurrency(1234.5, 'tr')
    expect(result).toMatch(/1\.234/)
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0, 'tr')
    expect(result).toMatch(/0/)
  })

  it('formats large amounts', () => {
    const result = formatCurrency(1_000_000, 'tr')
    expect(result).toMatch(/1\.000\.000/)
  })

  it('formats with EN locale', () => {
    const result = formatCurrency(1234, 'en')
    expect(result).toMatch(/1,234/)
  })
})

describe('formatDate', () => {
  const iso = '2026-07-28T10:00:00Z'

  it('returns a non-empty string', () => {
    expect(formatDate(iso, 'tr')).toBeTruthy()
  })

  it('returns a non-empty string for EN locale', () => {
    expect(formatDate(iso, 'en')).toBeTruthy()
  })

  it('includes the year', () => {
    expect(formatDate(iso, 'tr')).toMatch(/2026/)
  })
})

describe('getInitials', () => {
  it('returns two initials for a full name', () => {
    expect(getInitials('Ali Veli')).toBe('AV')
  })

  it('returns one initial for a single name', () => {
    expect(getInitials('Ali')).toBe('A')
  })

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })

  it('uses first two words only for three-word names', () => {
    expect(getInitials('Ali Veli Kaya')).toBe('AV')
  })

  it('uppercases initials from lowercase input', () => {
    expect(getInitials('ali veli')).toBe('AV')
  })

  it('handles extra whitespace', () => {
    expect(getInitials('  Ali  Veli  ')).toBe('AV')
  })
})
