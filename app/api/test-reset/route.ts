import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

const admin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

// Resets mutable test data (quotes + orders) to seed state by looking up real IDs from DB.
export async function POST() {
  const { data: companies } = await admin.from('companies').select('id, name, type').order('name')
  if (!companies?.length) return Response.json({ error: 'DB not seeded — call /api/seed first' }, { status: 400 })

  const seller  = companies.find((c) => c.type === 'seller')
  const buyers  = companies.filter((c) => c.type === 'buyer').sort((a, b) => a.name.localeCompare(b.name))
  if (!seller || buyers.length < 2) return Response.json({ error: 'Expected 1 seller + 2 buyers' }, { status: 400 })

  const cSeller = seller.id
  // buyers sorted alphabetically: Güneş Pazarı (buyer1/ayse), Lezzet Restoranları (buyer2/kemal)
  const cBuyer1 = buyers[0].id
  const cBuyer2 = buyers[1].id

  const { data: products } = await admin.from('products').select('id, name').eq('seller_id', cSeller)
  if (!products?.length) return Response.json({ error: 'No products found for seller' }, { status: 400 })

  const p1 = products.find((p) => p.name.includes('Zeytinyağı'))?.id
  const p2 = products.find((p) => p.name.includes('Buğday'))?.id
  const p3 = products.find((p) => p.name.includes('Bal'))?.id
  if (!p1 || !p2 || !p3) return Response.json({ error: `Products not found: p1=${p1} p2=${p2} p3=${p3}` }, { status: 400 })

  const { data: authData } = await admin.auth.admin.listUsers()
  const uMap: Record<string, string> = {}
  for (const u of authData.users) {
    if (u.email) uMap[u.email] = u.id
  }

  const uBuyer1Admin = uMap['ayse@gunespazar.com']
  const uBuyer2Admin = uMap['kemal@lezzet.com']

  // Reset quote_requests
  const productIds = products.map((p) => p.id)
  await admin.from('quote_requests').delete().in('product_id', productIds)
  const { error: quoteErr } = await admin.from('quote_requests').insert([
    { buyer_id: cBuyer1, product_id: p1, quantity: 300, status: 'pending',
      buyer_note: 'Düzenli aylık sipariş için fiyat alıyoruz.', created_at: daysAgo(2) },
    { buyer_id: cBuyer1, product_id: p2, quantity: 600, status: 'responded',
      seller_response_price: 36, seller_message: '600 adet için özel iskonto uygulandı.', created_at: daysAgo(5) },
    { buyer_id: cBuyer2, product_id: p3, quantity: 150, status: 'accepted',
      buyer_note: 'Restoran menüsü için kullanacağız.',
      seller_response_price: 180, seller_message: 'Anlaşma sağlandı, teşekkürler.', created_at: daysAgo(10) },
    { buyer_id: cBuyer2, product_id: p1, quantity: 50, status: 'declined', created_at: daysAgo(15) },
  ])
  if (quoteErr) return Response.json({ error: `Quote reset: ${quoteErr.message}` }, { status: 500 })

  // Reset orders
  const { data: existingOrders } = await admin.from('orders').select('id').eq('seller_id', cSeller)
  const orderIds = (existingOrders ?? []).map((o) => o.id)
  if (orderIds.length) {
    await admin.from('order_items').delete().in('order_id', orderIds)
    await admin.from('orders').delete().in('id', orderIds)
  }

  const { data: insertedOrders, error: orderErr } = await admin.from('orders').insert([
    { buyer_id: cBuyer1, seller_id: cSeller, status: 'delivered',
      total: 16500, needs_approval: false, created_by: uBuyer1Admin, created_at: daysAgo(42) },
    { buyer_id: cBuyer1, seller_id: cSeller, status: 'shipped',
      total: 42000, needs_approval: true, approved_by: uBuyer1Admin, created_by: uBuyer1Admin, created_at: daysAgo(27) },
    { buyer_id: cBuyer2, seller_id: cSeller, status: 'pending',
      total: 58000, needs_approval: true, created_by: uBuyer2Admin, created_at: daysAgo(11) },
    { buyer_id: cBuyer1, seller_id: cSeller, status: 'confirmed',
      total: 8900, needs_approval: false, created_by: uBuyer1Admin, created_at: daysAgo(7) },
  ]).select('id')
  if (orderErr) return Response.json({ error: `Order reset: ${orderErr.message}` }, { status: 500 })

  const [oDelivered, oShipped, oPending, oConfirmed] = (insertedOrders ?? []).map((o) => o.id)
  if (!oDelivered || !oShipped || !oPending || !oConfirmed) {
    return Response.json({ error: 'Order insert did not return IDs' }, { status: 500 })
  }

  const { error: itemErr } = await admin.from('order_items').insert([
    { order_id: oDelivered, product_id: p1, quantity: 100, unit_price: 165 },
    { order_id: oShipped,   product_id: p2, quantity: 500, unit_price: 38  },
    { order_id: oShipped,   product_id: p3, quantity: 100, unit_price: 175 },
    { order_id: oPending,   product_id: p2, quantity: 500, unit_price: 34  },
    { order_id: oPending,   product_id: p1, quantity: 200, unit_price: 145 },
    { order_id: oConfirmed, product_id: p3, quantity: 40,  unit_price: 220 },
    { order_id: oConfirmed, product_id: p1, quantity: 10,  unit_price: 145 },
  ])
  if (itemErr) return Response.json({ error: `Items reset: ${itemErr.message}` }, { status: 500 })

  return Response.json({ ok: true, message: 'Test data reset to seed state' })
}
