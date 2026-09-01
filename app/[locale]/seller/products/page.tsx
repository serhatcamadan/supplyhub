'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getSellerProducts } from '@/lib/api/products'
import type { Product } from '@/types'
import { buttonVariants } from '@/components/ui/button'
import { ProductControls } from '@/components/seller/product-controls'
import { ProductTable } from '@/components/seller/product-table'
import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { IconPlus } from '@tabler/icons-react'

export default function SellerProductsPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('seller')
  const locale = useLocale()

  useEffect(() => {
    getSellerProducts()
      .then((data) => setProducts(data as unknown as Product[]))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products

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
      />

      <ProductTable products={filtered} />

    </div>
  )
}
