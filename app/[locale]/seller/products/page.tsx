'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getSellerProducts, deleteProduct, updateProductStatus } from '@/lib/api/products'
import { getStockBucket } from '@/lib/utils'
import type { Product } from '@/types'
import { buttonVariants } from '@/components/ui/button'
import { TablePagination } from '@/components/ui/table-pagination'
import { ProductControls, EMPTY_FILTERS, type ProductFilters } from '@/components/seller/product-controls'
import { ProductTable } from '@/components/seller/product-table'
import { ProductGrid } from '@/components/seller/product-grid'
import { ProductBulkActionBar } from '@/components/seller/product-bulk-action-bar'
import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { IconPlus } from '@tabler/icons-react'

const ITEMS_PER_PAGE = 10

export default function SellerProductsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false)
  const t = useTranslations('seller')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  useEffect(() => {
    getSellerProducts()
      .then((data) => setProducts(data as unknown as Product[]))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function handleStatusChange(id: string, status: 'active' | 'draft') {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b)),
    [products]
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.category.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      if (filters.category && p.category !== filters.category) return false
      if (filters.status.size > 0 && !filters.status.has(p.status)) return false
      if (filters.stock.size > 0 && !filters.stock.has(getStockBucket(p.stock_quantity ?? 0))) return false
      return true
    })
  }, [products, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const allSelected = paged.length > 0 && paged.every((p) => next.has(p.id))
      paged.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)))
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  async function handleBulkStatus(status: 'active' | 'draft') {
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(ids.map((id) => updateProductStatus(id, status)))
    const succeeded = new Set(ids.filter((_, i) => results[i].status === 'fulfilled'))
    setProducts((prev) => prev.map((p) => (succeeded.has(p.id) ? { ...p, status } : p)))
    setSelectedIds(new Set())
  }

  async function performBulkDelete() {
    setConfirmBulkDeleteOpen(false)
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(ids.map((id) => deleteProduct(id)))
    const succeeded = new Set(ids.filter((_, i) => results[i].status === 'fulfilled'))
    setProducts((prev) => prev.filter((p) => !succeeded.has(p.id)))
    setSelectedIds(new Set())
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <PageHeaderSkeleton actionCount={1} />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-4 w-32 ml-auto" />
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
          <TableSkeleton rows={8} cols={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-6">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('products.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
            {t('products.subHeading')}
          </p>
        </div>
        <Link
          href={`/${locale}/seller/products/new`}
          className={buttonVariants({ variant: 'primary' }) + ' shrink-0 ml-6'}
        >
          <IconPlus size={20} />
          {t('products.newProduct')}
        </Link>
      </div>

      <ProductControls
        search={search}
        onSearch={setSearch}
        totalCount={products.length}
        filteredCount={filtered.length}
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
        view={view}
        onViewChange={setView}
      />

      {selectedIds.size > 0 && (
        <ProductBulkActionBar
          count={selectedIds.size}
          onSetActive={() => handleBulkStatus('active')}
          onSetDraft={() => handleBulkStatus('draft')}
          onDelete={() => setConfirmBulkDeleteOpen(true)}
          onClear={clearSelection}
        />
      )}

      <AlertDialog open={confirmBulkDeleteOpen} onOpenChange={setConfirmBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('products.bulk.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('products.bulk.confirmDelete', { count: selectedIds.size })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={performBulkDelete}>
              {t('products.bulk.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
        {view === 'list' ? (
          <ProductTable
            products={paged}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
          />
        ) : (
          <ProductGrid
            products={paged}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        )}

        <TablePagination
          label={t('products.table.pagination', { shown: paged.length, total: filtered.length })}
          page={page}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  )
}
