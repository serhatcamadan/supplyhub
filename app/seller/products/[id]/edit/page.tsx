'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { PriceTier } from '@/types'
import { Button } from '@/components/ui/button'
import { ProductBasicInfo } from '@/components/seller/product-basic-info'
import { ProductPricingTiers } from '@/components/seller/product-pricing-tiers'
import { ProductMedia } from '@/components/seller/product-media'
import { ProductLogistics } from '@/components/seller/product-logistics'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()

  const [productId, setProductId]     = useState<string | null>(null)
  const [name, setName]               = useState('')
  const [category, setCategory]       = useState('')
  const [minOrderQty, setMinOrderQty] = useState('')
  const [description, setDescription] = useState('')
  const [tiers, setTiers]             = useState<PriceTier[]>([])
  const [isLoading, setIsLoading]     = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { id } = await params
      setProductId(id)
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        setName(data.name)
        setCategory(data.category)
        setMinOrderQty(String(data.min_order_qty))
        setDescription(data.description ?? '')
        setTiers((data.price_tiers as PriceTier[]) ?? [])
      }
      setIsLoading(false)
    }
    load()
  }, [params])

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
    if (!name.trim() || !category || !minOrderQty || !productId) {
      setError('Ürün adı, kategori ve minimum sipariş adedi zorunludur.')
      return
    }
    setIsSubmitting(true)
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('products')
      .update({
        name:          name.trim(),
        description:   description.trim(),
        category,
        min_order_qty: parseInt(minOrderQty, 10),
        price_tiers:   tiers,
      })
      .eq('id', productId)

    if (dbError) { setError(dbError.message); setIsSubmitting(false); return }
    router.push('/seller/products')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        Yükleniyor…
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-full">

      <div className="flex items-center justify-between px-8 py-8 border-b border-outline-variant/20 bg-surface">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            <Link href="/seller/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface">Edit Product</span>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">{name || 'Ürün Düzenle'}</h1>
        </div>
        <div className="flex items-center gap-4">
          {error && <p className="text-sm text-error">{error}</p>}
          <Link href="/seller/products" className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
            Cancel
          </Link>
          <Button type="button" variant="secondary" onClick={handleSave} disabled={isSubmitting} className="active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSubmitting ? 'Kaydediliyor…' : 'Save Changes'}
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
