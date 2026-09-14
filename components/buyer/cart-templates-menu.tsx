'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { formatDate } from '@/lib/utils'
import { useCartTemplates } from '@/lib/hooks/use-cart-templates'
import type { StoredItem } from '@/lib/hooks/use-cart'
import { IconBookmarkPlus, IconBookmarks, IconTrash, IconUpload } from '@tabler/icons-react'

interface CartTemplatesMenuProps {
  currentItems: StoredItem[]
  hasCartItems: boolean
  onLoadTemplate: (items: StoredItem[]) => void
  locale: string
}

export function CartTemplatesMenu({ currentItems, hasCartItems, onLoadTemplate, locale }: CartTemplatesMenuProps) {
  const t = useTranslations('buyer')
  const { templates, saveTemplate, deleteTemplate } = useCartTemplates()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
        setIsSaving(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSave() {
    if (!name.trim()) return
    saveTemplate(name.trim(), currentItems)
    setName('')
    setIsSaving(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <IconBookmarks size={18} />
        {t('cart.templates.menuLabel')}
        {templates.length > 0 && (
          <span className="w-4 h-4 flex items-center justify-center rounded-full bg-surface-container-high text-[10px] font-semibold">
            {templates.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-50 overflow-hidden">
          {hasCartItems && (
            <div className="p-3 border-b border-outline-variant/20">
              {isSaving ? (
                <div className="flex flex-col gap-2">
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave()
                    }}
                    placeholder={t('cart.templates.namePlaceholder')}
                    className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSaving(false)
                        setName('')
                      }}
                      className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-2 py-1"
                    >
                      {t('cart.templates.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!name.trim()}
                      className="text-xs font-semibold text-primary hover:underline px-2 py-1 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {t('cart.templates.save')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSaving(true)}
                  className="w-full flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <IconBookmarkPlus size={18} />
                  {t('cart.saveAsTemplate')}
                </button>
              )}
            </div>
          )}

          <div className="max-h-64 overflow-y-auto py-1">
            {templates.length === 0 ? (
              <p className="px-4 py-4 text-sm text-on-surface-variant text-center">{t('cart.templates.empty')}</p>
            ) : (
              templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-surface-container transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{tpl.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {t('cart.templates.itemCount', { count: tpl.items.length })} · {formatDate(tpl.createdAt, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadTemplate(tpl.items)
                        setIsOpen(false)
                      }}
                      title={t('cart.templates.load')}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-md transition-colors"
                    >
                      <IconUpload size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTemplate(tpl.id)}
                      title={t('cart.templates.delete')}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
