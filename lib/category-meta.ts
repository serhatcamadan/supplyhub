import type { ElementType } from 'react'
import { IconDroplet, IconWheat, IconLeaf, IconBowlSpoon, IconCategory } from '@tabler/icons-react'

// products.category serbest metin bir alan (enum değil) — burada bilinmeyen bir kategoriyle
// karşılaşılırsa DEFAULT_* değerleri kullanılır, hata fırlatılmaz.

export const CATEGORY_ICON: Record<string, ElementType> = {
  'Yağlar': IconDroplet,
  'Tahıllar': IconWheat,
  'Doğal Ürünler': IconLeaf,
  'Baklagiller & Makarna': IconBowlSpoon,
}

export const DEFAULT_CATEGORY_ICON: ElementType = IconCategory

export const CATEGORY_UNIT_KEY: Record<string, string> = {
  'Yağlar': 'bottle',
  'Tahıllar': 'sack',
  'Doğal Ürünler': 'piece',
  'Baklagiller & Makarna': 'pack',
}

export const DEFAULT_UNIT_KEY = 'piece'
