'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { PriceTier } from '@/types'
import { Button } from '@/components/ui/button'
import { ProductBasicInfo } from '@/components/seller/product-basic-info'
import { ProductPricingTiers } from '@/components/seller/product-pricing-tiers'
import { ProductMedia } from '@/components/seller/product-media'
import { ProductLogistics } from '@/components/seller/product-logistics'

export default function NewProductPage() {
  const router = useRouter()

  const [name, setName]               = useState('')
  const [category, setCategory]       = useState('')
  const [minOrderQty, setMinOrderQty] = useState('')
  const [description, setDescription] = useState('')
  const [tiers, setTiers]             = useState<PriceTier[]>([
    { min_qty: 1,  max_qty: 10,   price: 0 },
    { min_qty: 11, max_qty: 50,   price: 0 },
    { min_qty: 51, max_qty: null, price: 0 },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  function addTier() {
    setTiers((prev) => {
      const prevLastMax = prev[prev.length - 2]?.max_qty ?? 0
      const newTier: PriceTier = { min_qty: prevLastMax + 1, max_qty: prevLastMax + 50, price: 0 }
      return [...prev.slice(0, -1), newTier, prev[prev.length - 1]]
    })
  }

  function removeTier(idx: number) {
    setTiers((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateMax(idx: number, value: number | null) {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, max_qty: value } : t)))
  }

  function updatePrice(idx: number, value: number) {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, price: value } : t)))
  }

  async function handleSave() {
    setError(null)
    if (!name.trim() || !category || !minOrderQty) {
      setError('Ürün adı, kategori ve minimum sipariş adedi zorunludur.')
      return
    }
    setIsSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const companyId = user?.user_metadata?.company_id
    if (!companyId) { setError('Oturum bulunamadı.'); setIsSubmitting(false); return }

    const { error: dbError } = await supabase.from('products').insert({
      seller_id:     companyId,
      name:          name.trim(),
      description:   description.trim(),
      category,
      min_order_qty: parseInt(minOrderQty, 10),
      price_tiers:   tiers,
      status:        'active',
      image_url:     null,
    })

    if (dbError) { setError(dbError.message); setIsSubmitting(false); return }
    router.push('/seller/products')
  }

  return (
    <div className="flex flex-col w-full min-h-full">

      <div className="flex items-center justify-between px-8 py-8 border-b border-outline-variant/20 bg-surface">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            <Link href="/seller/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface">Add New Product</span>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Create Product Listing</h1>
        </div>
        <div className="flex items-center gap-4">
          {error && <p className="text-sm text-error">{error}</p>}
          <Link href="/seller/products" className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
            Cancel
          </Link>
          <Button type="button" variant="secondary" onClick={handleSave} disabled={isSubmitting} className="active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSubmitting ? 'Kaydediliyor…' : 'Save Product'}
          </Button>
        </div>
      </div>

      <div className="flex-1 px-8 py-8">
        <div className="grid grid-cols-12 gap-8 max-w-300 mx-auto">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <ProductBasicInfo
              name={name}               onNameChange={setName}
              category={category}       onCategoryChange={setCategory}
              minOrderQty={minOrderQty} onMinOrderQtyChange={setMinOrderQty}
              description={description} onDescriptionChange={setDescription}
            />
            <ProductPricingTiers
              tiers={tiers}
              onAdd={addTier}
              onRemove={removeTier}
              onUpdateMax={updateMax}
              onUpdatePrice={updatePrice}
            />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <ProductMedia />
            <ProductLogistics />
          </div>
        </div>
      </div>

    </div>
  )
}
