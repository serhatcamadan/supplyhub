import { createServiceClient } from '@/lib/supabase/server'

export async function POST() {
  const sb = createServiceClient()

  // Find demo users by email (order-independent, immune to extra signup companies)
  const { data: users, error: usersErr } = await sb
    .from('users')
    .select('id,email,company_id')
    .in('email', ['ayse@gunespazar.com', 'kemal@lezzet.com', 'ali@freshfarm.com'])
  if (usersErr || !users?.length) {
    return Response.json({ error: 'Demo users not found' }, { status: 400 })
  }

  const uBuyer1Admin = users.find((u) => u.email === 'ayse@gunespazar.com')?.id
  const uBuyer2Admin = users.find((u) => u.email === 'kemal@lezzet.com')?.id
  const cBuyer1     = users.find((u) => u.email === 'ayse@gunespazar.com')?.company_id
  const cBuyer2     = users.find((u) => u.email === 'kemal@lezzet.com')?.company_id
  const cSeller     = users.find((u) => u.email === 'ali@freshfarm.com')?.company_id

  if (!cSeller || !cBuyer1 || !cBuyer2 || !uBuyer1Admin || !uBuyer2Admin) {
    return Response.json({ error: 'Demo company/user IDs not found' }, { status: 400 })
  }

  // Find products for this seller
  const { data: products, error: prodErr } = await sb
    .from('products')
    .select('id,name')
    .eq('seller_id', cSeller)
  if (prodErr || !products?.length) {
    return Response.json({ error: 'Products not found' }, { status: 400 })
  }

  const p1 = products.find((p) => p.name.includes('Zeytinyağı'))?.id
  const p2 = products.find((p) => p.name.includes('Buğday'))?.id
  const p3 = products.find((p) => p.name.includes('Bal'))?.id
  if (!p1 || !p2 || !p3) {
    return Response.json({ error: 'Seed products not found' }, { status: 400 })
  }

  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()
  const productIds = products.map((p) => p.id)

  // Reset quote_requests
  await sb.from('quote_requests').delete().in('product_id', productIds)
  const { error: quoteErr } = await sb.from('quote_requests').insert([
    { buyer_id: cBuyer1, product_id: p1, quantity: 300, status: 'pending',   buyer_note: 'Düzenli aylık sipariş için fiyat alıyoruz.', created_at: daysAgo(2) },
    { buyer_id: cBuyer1, product_id: p2, quantity: 600, status: 'responded', seller_response_price: 36, seller_message: '600 adet için özel iskonto uygulandı.', created_at: daysAgo(5) },
    { buyer_id: cBuyer2, product_id: p3, quantity: 150, status: 'accepted',  buyer_note: 'Restoran menüsü için kullanacağız.', seller_response_price: 180, seller_message: 'Anlaşma sağlandı, teşekkürler.', created_at: daysAgo(10) },
    { buyer_id: cBuyer2, product_id: p1, quantity:  50, status: 'declined',  created_at: daysAgo(15) },
  ])
  if (quoteErr) return Response.json({ error: `Quote reset: ${quoteErr.message}` }, { status: 500 })

  // Reset orders
  const { data: existingOrders } = await sb.from('orders').select('id').eq('seller_id', cSeller)
  const orderIds = (existingOrders ?? []).map((o) => o.id)
  if (orderIds.length) {
    await sb.from('order_items').delete().in('order_id', orderIds)
    await sb.from('orders').delete().in('id', orderIds)
  }

  const { data: newOrders, error: orderErr } = await sb.from('orders').insert([
    { buyer_id: cBuyer1, seller_id: cSeller, status: 'delivered', total: 16500, needs_approval: false, created_by: uBuyer1Admin, created_at: daysAgo(42) },
    { buyer_id: cBuyer1, seller_id: cSeller, status: 'shipped',   total: 42000, needs_approval: true,  approved_by: uBuyer1Admin, created_by: uBuyer1Admin, created_at: daysAgo(27) },
    { buyer_id: cBuyer2, seller_id: cSeller, status: 'pending',   total: 58000, needs_approval: true,  created_by: uBuyer2Admin, created_at: daysAgo(11) },
    { buyer_id: cBuyer1, seller_id: cSeller, status: 'confirmed', total:  8900, needs_approval: false, created_by: uBuyer1Admin, created_at: daysAgo(7) },
  ]).select('id')
  if (orderErr) return Response.json({ error: `Order reset: ${orderErr.message}` }, { status: 500 })

  if (newOrders?.length === 4) {
    const [oDelivered, oShipped, oPending, oConfirmed] = newOrders.map((o) => o.id)
    await sb.from('order_items').insert([
      { order_id: oDelivered, product_id: p1, quantity: 100, unit_price: 165 },
      { order_id: oShipped,   product_id: p2, quantity: 500, unit_price:  38 },
      { order_id: oShipped,   product_id: p3, quantity: 100, unit_price: 175 },
      { order_id: oPending,   product_id: p2, quantity: 500, unit_price:  34 },
      { order_id: oPending,   product_id: p1, quantity: 200, unit_price: 145 },
      { order_id: oConfirmed, product_id: p3, quantity:  40, unit_price: 220 },
      { order_id: oConfirmed, product_id: p1, quantity:  10, unit_price: 145 },
    ])
  }

  return Response.json({ ok: true, message: 'Test data reset to seed state' })
}
