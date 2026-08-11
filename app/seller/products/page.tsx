'use client'

import { useState } from 'react'
import Link from 'next/link'
import { products } from '@/lib/mock-data'
import { ProductControls } from '@/components/seller/product-controls'
import { ProductTable } from '@/components/seller/product-table'

const SELLER_ID = 'company-seller-1'

export default function SellerProductsPage() {
  const [search, setSearch] = useState('')

  const sellerProducts = products.filter((p) => p.seller_id === SELLER_ID)

  const filtered = search
    ? sellerProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      )
    : sellerProducts

  return (
    <div className="p-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Product Catalog</h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
            Manage your inventory, update pricing, and monitor stock levels across all your active
            and draft listings.
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="bg-primary text-on-primary hover:bg-primary-container transition-colors px-5 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md shrink-0 ml-6"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          New Product
        </Link>
      </div>

      <ProductControls
        search={search}
        onSearch={setSearch}
        totalCount={sellerProducts.length}
        filteredCount={filtered.length}
      />

      <ProductTable products={filtered} />

    </div>
  )
}
