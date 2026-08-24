'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import { buttonVariants } from '@/components/ui/button'
import { ProductControls } from '@/components/seller/product-controls'
import { ProductTable } from '@/components/seller/product-table'

export default function SellerProductsPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const t = useTranslations('seller')
  const locale = useLocale()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const companyId = user?.user_metadata?.company_id
      if (!companyId) return
      const { data } = await supabase.from('products').select('*').eq('seller_id', companyId)
      setProducts((data as Product[]) ?? [])
    }
    load()
  }, [])

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products

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
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
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
