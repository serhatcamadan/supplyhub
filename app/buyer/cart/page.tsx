'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sepet</h1>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <ShoppingCart size={40} className="text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Sepetiniz boş</p>
        <p className="text-sm text-slate-400 mt-1">Ürün keşfine gidin ve ürün ekleyin.</p>
        <Link
          href="/buyer/discover"
          className="inline-block mt-4 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#16304f] transition-colors"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    </div>
  )
}
