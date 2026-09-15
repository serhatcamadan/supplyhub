import { serverApiFetch } from '@/lib/api/server-client'
import { BuyerOrdersContent } from '@/components/buyer/buyer-orders-content'
import type { OrderWithDetails } from '@/types'

export default async function BuyerOrdersPage() {
  let orders: OrderWithDetails[] = []
  try {
    orders = await serverApiFetch<OrderWithDetails[]>('/orders')
  } catch {
    orders = []
  }

  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">
      <BuyerOrdersContent orders={orders} />
    </div>
  )
}
