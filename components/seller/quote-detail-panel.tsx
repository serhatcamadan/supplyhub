import { formatCurrency } from '@/lib/utils'

interface QuoteDetailPanelProps {
  buyerName: string
  buyerInitials: string
  buyerMessage: string | null
  productName: string
  productId: string
  productCategory: string
  quantity: number
  listPrice: number | null
  minOrderQty: number
}

export function QuoteDetailPanel({
  buyerName,
  buyerInitials,
  buyerMessage,
  productName,
  productId,
  productCategory,
  quantity,
  listPrice,
  minOrderQty,
}: QuoteDetailPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-surface rounded-2xl shadow-sm overflow-hidden border border-outline-variant/30">

      {/* Buyer header */}
      <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xl font-bold border-2 border-surface shadow-sm shrink-0">
          {buyerInitials}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">{buyerName}</h2>
          <div className="flex items-center gap-2 mt-1 text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
            <span className="text-sm">Turkey</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="text-sm">Wholesale Buyer</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">

        {/* Requested Products */}
        <section>
          <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
              inventory_2
            </span>
            Requested Products
          </h3>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Item
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                    Qty
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                    List Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span
                          className="material-symbols-outlined text-outline-variant"
                          style={{ fontSize: '22px' }}
                        >
                          inventory_2
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{productName}</p>
                        <p className="text-xs text-on-surface-variant font-mono">
                          SKU: {productId.toUpperCase()} · {productCategory}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-on-surface">
                    {quantity.toLocaleString('tr-TR')} adet
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-on-surface">
                    {listPrice ? `${formatCurrency(listPrice)}/adet` : '—'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">
                Total at list price:{' '}
                <strong className="text-on-surface">
                  {listPrice ? formatCurrency(listPrice * quantity) : '—'}
                </strong>
              </span>
              <span className="text-xs text-on-surface-variant">
                Min. order:{' '}
                <strong className="text-on-surface">{minOrderQty} adet</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Buyer Message */}
        {buyerMessage ? (
          <section>
            <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                chat
              </span>
              Buyer Message
            </h3>
            <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 relative overflow-hidden">
              <span
                className="material-symbols-outlined absolute top-3 left-3 text-outline-variant/20 select-none pointer-events-none"
                style={{ fontSize: '48px' }}
              >
                format_quote
              </span>
              <p className="text-sm text-on-surface leading-relaxed relative z-10">
                {buyerMessage}
              </p>
            </div>
          </section>
        ) : (
          <section>
            <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                chat
              </span>
              Buyer Message
            </h3>
            <div className="p-5 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/50 text-center">
              <p className="text-sm text-on-surface-variant italic">No message provided.</p>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
