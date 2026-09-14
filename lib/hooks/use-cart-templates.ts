'use client'

import { useState, useEffect } from 'react'
import type { StoredItem } from './use-cart'

export interface CartTemplate {
  id: string
  name: string
  createdAt: string
  items: StoredItem[]
}

const STORAGE_KEY = 'supplyhub_cart_templates'

function readStorage(): CartTemplate[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeStorage(templates: CartTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch {}
}

export function useCartTemplates() {
  const [templates, setTemplates] = useState<CartTemplate[]>([])

  useEffect(() => {
    // Deliberately deferred: localStorage is unavailable during SSR, so state
    // starts empty and is populated post-hydration to avoid a markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemplates(readStorage())
  }, [])

  function persist(next: CartTemplate[]) {
    setTemplates(next)
    writeStorage(next)
  }

  function saveTemplate(name: string, items: StoredItem[]) {
    const template: CartTemplate = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      items,
    }
    persist([template, ...readStorage()])
  }

  function deleteTemplate(id: string) {
    persist(readStorage().filter((tpl) => tpl.id !== id))
  }

  return { templates, saveTemplate, deleteTemplate }
}
