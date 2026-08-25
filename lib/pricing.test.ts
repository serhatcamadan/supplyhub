import { getUnitPrice, getTotalPrice, getNextTier } from './pricing'
import type { PriceTier } from '@/types'

const tiers: PriceTier[] = [
  { min_qty: 10, max_qty: 49, price: 185 },
  { min_qty: 50, max_qty: 199, price: 165 },
  { min_qty: 200, max_qty: null, price: 145 },
]

describe('getUnitPrice', () => {
  it('returns null below minimum order quantity', () => {
    expect(getUnitPrice(5, tiers)).toBeNull()
    expect(getUnitPrice(9, tiers)).toBeNull()
  })

  it('returns correct price for first tier', () => {
    expect(getUnitPrice(10, tiers)).toBe(185)
    expect(getUnitPrice(49, tiers)).toBe(185)
  })

  it('returns correct price for second tier', () => {
    expect(getUnitPrice(50, tiers)).toBe(165)
    expect(getUnitPrice(199, tiers)).toBe(165)
  })

  it('returns correct price for open-ended last tier', () => {
    expect(getUnitPrice(200, tiers)).toBe(145)
    expect(getUnitPrice(1000, tiers)).toBe(145)
  })
})

describe('getTotalPrice', () => {
  it('returns null below minimum', () => {
    expect(getTotalPrice(5, tiers)).toBeNull()
  })

  it('returns quantity × unit price', () => {
    expect(getTotalPrice(10, tiers)).toBe(1850)
    expect(getTotalPrice(50, tiers)).toBe(8250)
    expect(getTotalPrice(200, tiers)).toBe(29000)
  })
})

describe('getNextTier', () => {
  it('returns the next cheaper tier when one exists', () => {
    const next = getNextTier(20, tiers)
    expect(next).not.toBeNull()
    expect(next!.min_qty).toBe(50)
    expect(next!.price).toBe(165)
  })

  it('returns null when already on the best tier', () => {
    expect(getNextTier(200, tiers)).toBeNull()
    expect(getNextTier(500, tiers)).toBeNull()
  })

  it('returns null when quantity is below minimum', () => {
    expect(getNextTier(5, tiers)).toBeNull()
  })
})

describe('tier boundary edge cases', () => {
  it('getUnitPrice: one below minimum returns null', () => {
    expect(getUnitPrice(9, tiers)).toBeNull()
  })

  it('getUnitPrice: exact tier 1 upper boundary', () => {
    expect(getUnitPrice(49, tiers)).toBe(185)
  })

  it('getUnitPrice: exact tier 2 lower boundary (transition point)', () => {
    expect(getUnitPrice(50, tiers)).toBe(165)
  })

  it('getUnitPrice: exact tier 2 upper boundary', () => {
    expect(getUnitPrice(199, tiers)).toBe(165)
  })

  it('getUnitPrice: exact tier 3 lower boundary (transition point)', () => {
    expect(getUnitPrice(200, tiers)).toBe(145)
  })

  it('getTotalPrice: tier 1 upper boundary — 49 × 185 = 9065', () => {
    expect(getTotalPrice(49, tiers)).toBe(49 * 185)
  })

  it('getTotalPrice: tier 2 lower boundary — 50 × 165 = 8250', () => {
    expect(getTotalPrice(50, tiers)).toBe(50 * 165)
  })

  it('getTotalPrice: tier 3 lower boundary — 200 × 145 = 29000', () => {
    expect(getTotalPrice(200, tiers)).toBe(200 * 145)
  })
})
