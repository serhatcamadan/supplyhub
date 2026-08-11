import { quoteRequests, products, companies } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Bekliyor',
  responded: 'Yanıtlandı',
  accepted: 'Kabul Edildi',
  declined: 'Reddedildi',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  responded: 'bg-blue-50 text-blue-700',
  accepted: 'bg-green-50 text-green-700',
  declined: 'bg-red-50 text-red-600',
}

export default function SellerQuotesPage() {
  const sellerProductIds = new Set(
    products.filter((p) => p.seller_id === 'company-seller-1').map((p) => p.id)
  )
  const relevantQuotes = quoteRequests.filter((q) => sellerProductIds.has(q.product_id))

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Teklif Talepleri</h1>
        <p className="text-sm text-slate-500 mt-1">
          {relevantQuotes.filter((q) => q.status === 'pending').length} bekleyen teklif
        </p>
      </div>

      <div className="space-y-3">
        {relevantQuotes.map((quote) => {
          const product = products.find((p) => p.id === quote.product_id)!
          const buyer = companies.find((c) => c.id === quote.buyer_id)!
          const listPrice = product.price_tiers.find(
            (t) => quote.quantity >= t.min_qty && (t.max_qty === null || quote.quantity <= t.max_qty)
          )?.price

          return (
            <div key={quote.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[quote.status]}`}
                    >
                      {STATUS_LABEL[quote.status]}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(quote.created_at)}</span>
                  </div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{buyer.name}</p>
                  {quote.buyer_note && (
                    <p className="text-sm text-slate-600 mt-2 italic border-l-2 border-slate-200 pl-3">
                      "{quote.buyer_note}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-slate-900">{quote.quantity}</p>
                  <p className="text-xs text-slate-400">adet talep</p>
                  {listPrice && (
                    <p className="text-xs text-slate-500 mt-1">
                      Liste: {formatCurrency(listPrice)}/adet
                    </p>
                  )}
                  {quote.seller_response_price && (
                    <p className="text-sm font-medium text-[#1e3a5f] mt-1">
                      Teklifiniz: {formatCurrency(quote.seller_response_price)}/adet
                    </p>
                  )}
                </div>
              </div>

              {quote.seller_message && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">Yanıtınız:</p>
                  <p className="text-sm text-slate-600">{quote.seller_message}</p>
                </div>
              )}

              {quote.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                  <input
                    type="number"
                    placeholder="Teklif fiyatı (₺/adet)"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                  />
                  <button className="px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#16304f] transition-colors">
                    Yanıtla
                  </button>
                  <button className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                    Reddet
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
