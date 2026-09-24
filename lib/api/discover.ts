import { serverApiFetch } from './server-client'

export interface TrendData {
  category: string
  growth: number
  demandPct: number
  buyerCount: number
}

export interface PriceComparisonData {
  product: string
  category: string
  myPrice: number
  marketPrice: number
}

export interface RecommendationData {
  category: string
  buyerCount: number
}

export interface BuyerSearchData {
  keyword: string
  count: number
  dailyCounts: number[]
  growing: boolean
}

export function getTrends(): Promise<TrendData[]> {
  return serverApiFetch<TrendData[]>('/seller/discover/trends')
}

export function getPriceIndex(): Promise<PriceComparisonData[]> {
  return serverApiFetch<PriceComparisonData[]>('/seller/discover/price-index')
}

export function getRecommendations(): Promise<RecommendationData[]> {
  return serverApiFetch<RecommendationData[]>('/seller/discover/recommendations')
}

export function getBuyerSearches(): Promise<BuyerSearchData[]> {
  return serverApiFetch<BuyerSearchData[]>('/seller/discover/buyer-searches')
}
