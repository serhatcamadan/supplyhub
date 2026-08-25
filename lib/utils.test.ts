import { formatCurrency, formatDate, getInitials } from './utils'

describe('formatCurrency', () => {
  it('formats TRY by default', () => {
    expect(formatCurrency(1250)).toBe('₺1.250')
  })

  it('formats TRY when locale is tr', () => {
    expect(formatCurrency(1250, 'tr')).toBe('₺1.250')
  })

  it('formats USD when locale is en', () => {
    expect(formatCurrency(1250, 'en')).toBe('$1,250')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0, 'tr')).toBe('₺0')
    expect(formatCurrency(0, 'en')).toBe('$0')
  })

  it('handles large amounts', () => {
    expect(formatCurrency(50000, 'tr')).toBe('₺50.000')
    expect(formatCurrency(50000, 'en')).toBe('$50,000')
  })
})

describe('formatDate', () => {
  it('formats date in Turkish by default', () => {
    expect(formatDate('2024-01-15')).toBe('15 Ocak 2024')
  })

  it('formats date in Turkish when locale is tr', () => {
    expect(formatDate('2024-01-15', 'tr')).toBe('15 Ocak 2024')
  })

  it('formats date in English when locale is en', () => {
    expect(formatDate('2024-01-15', 'en')).toBe('January 15, 2024')
  })

  it('formats different months correctly', () => {
    expect(formatDate('2024-06-01', 'tr')).toBe('1 Haziran 2024')
    expect(formatDate('2024-12-31', 'en')).toBe('December 31, 2024')
  })
})

describe('getInitials', () => {
  it('returns two initials for full name', () => {
    expect(getInitials('Ali Veli')).toBe('AV')
  })

  it('returns one initial for single name', () => {
    expect(getInitials('Ali')).toBe('A')
  })

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })

  it('uses only first two words for names with three or more parts', () => {
    expect(getInitials('Ali Veli Mehmet')).toBe('AV')
  })

  it('handles extra whitespace between words', () => {
    expect(getInitials('Ali  Veli')).toBe('AV')
  })

  it('uppercases initials', () => {
    expect(getInitials('ali veli')).toBe('AV')
  })
})
