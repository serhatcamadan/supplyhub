import type { PriceTier } from '@/types'

/**
 * Returns the unit price for a given quantity based on the product's price tiers.
 * Returns null if quantity is below the minimum order quantity.
 */
export function getUnitPrice(quantity: number, tiers: PriceTier[]): number | null {
  const sorted = [...tiers].sort((a, b) => a.min_qty - b.min_qty)

  let matched: PriceTier | null = null
  for (const tier of sorted) {
    if (quantity >= tier.min_qty) {
      if (tier.max_qty === null || quantity <= tier.max_qty) {
        matched = tier
        break
      }
    }
  }

  return matched ? matched.price : null
}

/**
 * Returns the total price for a given quantity.
 * Returns null if quantity is below the minimum order quantity.
 */
export function getTotalPrice(quantity: number, tiers: PriceTier[]): number | null {
  const unit = getUnitPrice(quantity, tiers)
  return unit !== null ? unit * quantity : null
}

/**
 * Returns the next price tier that unlocks a lower price, or null if already on the best tier.
 */
export function getNextTier(quantity: number, tiers: PriceTier[]): PriceTier | null {
  const sorted = [...tiers].sort((a, b) => a.min_qty - b.min_qty)
  const currentPrice = getUnitPrice(quantity, sorted)

  for (const tier of sorted) {
    const tierPrice = tier.min_qty <= quantity
      ? getUnitPrice(quantity, sorted)
      : getUnitPrice(tier.min_qty, sorted)

    if (tierPrice !== null && currentPrice !== null && tierPrice < currentPrice && tier.min_qty > quantity) {
      return tier
    }
  }

  return null
}
