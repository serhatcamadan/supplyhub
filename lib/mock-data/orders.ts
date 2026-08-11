import type { Order, OrderItem, OrderWithDetails } from '@/types'
import { products } from './products'
import { companies } from './companies'
import { users } from './users'

export const orders: Order[] = [
  {
    id: 'order-1',
    buyer_id: 'company-buyer-1',
    seller_id: 'company-seller-1',
    status: 'delivered',
    total: 16500,
    needs_approval: false,
    approved_by: null,
    created_by: 'user-buyer-staff-1',
    created_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 'order-2',
    buyer_id: 'company-buyer-1',
    seller_id: 'company-seller-1',
    status: 'shipped',
    total: 42000,
    needs_approval: true,
    approved_by: 'user-buyer-admin-1',
    created_by: 'user-buyer-staff-1',
    created_at: '2026-07-15T09:00:00Z',
  },
  {
    id: 'order-3',
    buyer_id: 'company-buyer-2',
    seller_id: 'company-seller-1',
    status: 'pending',
    total: 58000,
    needs_approval: true,
    approved_by: null,
    created_by: 'user-buyer-admin-2',
    created_at: '2026-08-01T11:30:00Z',
  },
  {
    id: 'order-4',
    buyer_id: 'company-buyer-1',
    seller_id: 'company-seller-1',
    status: 'confirmed',
    total: 8900,
    needs_approval: false,
    approved_by: null,
    created_by: 'user-buyer-staff-1',
    created_at: '2026-08-05T14:00:00Z',
  },
]

export const orderItems: OrderItem[] = [
  { id: 'item-1', order_id: 'order-1', product_id: 'product-1', quantity: 100, unit_price: 165 },
  { id: 'item-2', order_id: 'order-2', product_id: 'product-2', quantity: 500, unit_price: 38 },
  { id: 'item-3', order_id: 'order-2', product_id: 'product-3', quantity: 100, unit_price: 175 },
  { id: 'item-4', order_id: 'order-3', product_id: 'product-2', quantity: 500, unit_price: 34 },
  { id: 'item-5', order_id: 'order-3', product_id: 'product-1', quantity: 200, unit_price: 145 },
  { id: 'item-6', order_id: 'order-4', product_id: 'product-3', quantity: 40, unit_price: 220 },
  { id: 'item-7', order_id: 'order-4', product_id: 'product-4', quantity: 10, unit_price: 90 },
]

export function getOrdersWithDetails(): OrderWithDetails[] {
  return orders.map((order) => {
    const items = orderItems
      .filter((i) => i.order_id === order.id)
      .map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.product_id)!,
      }))

    return {
      ...order,
      items,
      buyer: companies.find((c) => c.id === order.buyer_id)!,
      seller: companies.find((c) => c.id === order.seller_id)!,
      created_by_user: users.find((u) => u.id === order.created_by)!,
      approved_by_user: order.approved_by
        ? (users.find((u) => u.id === order.approved_by) ?? null)
        : null,
    }
  })
}

export const SELLER_REVENUE_BY_MONTH = [
  { month: 'Şub', revenue: 38000 },
  { month: 'Mar', revenue: 52000 },
  { month: 'Nis', revenue: 47000 },
  { month: 'May', revenue: 61000 },
  { month: 'Haz', revenue: 55000 },
  { month: 'Tem', revenue: 75000 },
  { month: 'Ağu', revenue: 82000 },
]
