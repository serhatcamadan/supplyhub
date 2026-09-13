'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'supplyhub_favorites'

function readStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(readStorage())
  }, [])

  function toggleFavorite(productId: string) {
    setFavorites((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
      writeStorage(next)
      return next
    })
  }

  function isFavorited(productId: string) {
    return favorites.includes(productId)
  }

  return { favorites, isFavorited, toggleFavorite }
}
