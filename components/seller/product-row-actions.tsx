'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { IconDotsVertical, IconEye, IconPencil, IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-react'
import { deleteProduct, updateProductStatus } from '@/lib/api/products'
import type { Product } from '@/types'

interface ProductRowActionsProps {
  productId: string
  status: Product['status']
  onDelete: () => void
  onStatusChange: (status: 'active' | 'draft') => void
}

export function ProductRowActions({ productId, status, onDelete, onStatusChange }: ProductRowActionsProps) {
  const locale = useLocale()
  const t = useTranslations('seller')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  async function handleStatusToggle() {
    setIsOpen(false)
    const newStatus = status === 'active' ? 'draft' : 'active'
    try {
      await updateProductStatus(productId, newStatus)
      onStatusChange(newStatus)
    } catch {}
  }

  async function handleDelete() {
    setIsOpen(false)
    if (!window.confirm(t('products.rowActions.confirmDelete'))) return
    try {
      await deleteProduct(productId)
      onDelete()
    } catch {}
  }

  return (
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/${locale}/seller/products/${productId}/edit`}
        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
        title={t('products.rowActions.edit')}
      >
        <IconPencil size={20} />
      </Link>
      <Link
        href={`/${locale}/seller/products/${productId}`}
        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
        title={t('products.rowActions.viewDetails')}
      >
        <IconEye size={20} />
      </Link>
      <div className="relative" ref={ref}>
        <button
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-colors"
          title={t('products.rowActions.moreActions')}
          onClick={() => setIsOpen((v) => !v)}
        >
          <IconDotsVertical size={20} />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-50 py-1 overflow-hidden">
            <button
              onClick={handleStatusToggle}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              {status === 'active'
                ? <IconToggleLeft size={16} className="text-on-surface-variant" />
                : <IconToggleRight size={16} className="text-secondary" />}
              {status === 'active' ? t('products.bulk.setDraft') : t('products.bulk.setActive')}
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-colors"
            >
              <IconTrash size={16} />
              {t('products.bulk.delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
