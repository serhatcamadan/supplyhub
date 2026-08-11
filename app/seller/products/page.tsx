import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { products } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const STATUS_LABEL = { active: 'Aktif', draft: 'Taslak' }
const STATUS_COLOR = {
  active: 'bg-green-50 text-green-700',
  draft: 'bg-slate-100 text-slate-500',
}

export default function SellerProductsPage() {
  const sellerProducts = products.filter((p) => p.seller_id === 'company-seller-1')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ürünlerim</h1>
          <p className="text-sm text-slate-500 mt-1">{sellerProducts.length} ürün listelendi</p>
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#16304f] transition-colors"
        >
          <Plus size={16} />
          Ürün Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Ürün
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Kategori
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Min. Sipariş
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Başlangıç Fiyatı
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Durum
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {sellerProducts.map((product) => {
              const basePrice = product.price_tiers[0]?.price ?? 0
              return (
                <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {product.description}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{product.category}</td>
                  <td className="py-4 px-4 text-slate-600">{product.min_order_qty} adet</td>
                  <td className="py-4 px-4 font-medium text-slate-900">
                    {formatCurrency(basePrice)}
                    <span className="text-xs text-slate-400 font-normal ml-1">/ adet</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[product.status]}`}
                    >
                      {STATUS_LABEL[product.status]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-colors">
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
