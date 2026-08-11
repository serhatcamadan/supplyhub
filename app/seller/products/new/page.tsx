'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import type { PriceTier } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function NewProductPage() {
  const router = useRouter()
  const [tiers, setTiers] = useState<PriceTier[]>([
    { min_qty: 1, max_qty: 49, price: 0 },
    { min_qty: 50, max_qty: null, price: 0 },
  ])

  function addTier() {
    setTiers([...tiers, { min_qty: 0, max_qty: null, price: 0 }])
  }

  function removeTier(idx: number) {
    setTiers(tiers.filter((_, i) => i !== idx))
  }

  function updateTier(idx: number, field: keyof PriceTier, value: number | null) {
    setTiers(tiers.map((t, i) => (i === idx ? { ...t, [field]: value } : t)))
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Yeni Ürün Ekle</h1>
        <p className="text-sm text-slate-500 mt-1">Kademeli fiyatlandırmayla ürün oluşturun</p>
      </div>

      <div className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Temel Bilgiler</h2>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Ürün Adı</label>
            <input
              type="text"
              required
              placeholder="Ürün adı"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Açıklama</label>
            <textarea
              rows={3}
              placeholder="Ürün açıklaması"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Kategori</label>
              <input
                type="text"
                placeholder="ör. Yağlar, Tahıllar"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Min. Sipariş Adedi
              </label>
              <input
                type="number"
                min={1}
                placeholder="10"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>

        {/* Price tiers */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Kademeli Fiyatlandırma</h2>
            <button
              type="button"
              onClick={addTier}
              className="flex items-center gap-1.5 text-xs font-medium text-[#1e3a5f] hover:underline"
            >
              <Plus size={14} />
              Kademe Ekle
            </button>
          </div>

          <div className="space-y-2">
            {tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Min. Adet</label>
                    <input
                      type="number"
                      value={tier.min_qty}
                      onChange={(e) => updateTier(idx, 'min_qty', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Maks. Adet</label>
                    <input
                      type="number"
                      value={tier.max_qty ?? ''}
                      placeholder="Sınırsız"
                      onChange={(e) =>
                        updateTier(idx, 'max_qty', e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Birim Fiyat (₺)</label>
                    <input
                      type="number"
                      value={tier.price || ''}
                      onChange={(e) => updateTier(idx, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    />
                  </div>
                </div>
                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="mt-5 p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#16304f] transition-colors"
          >
            Kaydet (Taslak)
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Yayınla
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}
