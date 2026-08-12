import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

const admin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const C_SELLER = 'c0000001-0000-0000-0000-000000000001'
const C_BUYER1 = 'c0000002-0000-0000-0000-000000000002'
const C_BUYER2 = 'c0000003-0000-0000-0000-000000000003'

const P1 = 'a0000001-0000-0000-0000-000000000001'
const P2 = 'a0000002-0000-0000-0000-000000000002'
const P3 = 'a0000003-0000-0000-0000-000000000003'
const P4 = 'a0000004-0000-0000-0000-000000000004'

const O1 = 'b0000001-0000-0000-0000-000000000001'
const O2 = 'b0000002-0000-0000-0000-000000000002'
const O3 = 'b0000003-0000-0000-0000-000000000003'
const O4 = 'b0000004-0000-0000-0000-000000000004'

export async function POST() {
  // Zaten seed edilmişse tekrar çalıştırma
  const { data: existing } = await admin.auth.admin.listUsers()
  if ((existing?.users?.length ?? 0) > 0) {
    return Response.json({ message: 'Already seeded', count: existing!.users.length })
  }

  // 1. Auth kullanıcıları — GoTrue admin API ile, doğrudan auth.users insert değil
  const demoUsers = [
    { email: 'ali@freshfarm.com',    name: 'Ali Yılmaz',  companyType: 'seller', role: 'admin',  companyId: C_SELLER },
    { email: 'ayse@gunespazar.com',  name: 'Ayşe Demir',  companyType: 'buyer',  role: 'admin',  companyId: C_BUYER1 },
    { email: 'fatma@gunespazar.com', name: 'Fatma Çelik', companyType: 'buyer',  role: 'staff',  companyId: C_BUYER1 },
    { email: 'kemal@lezzet.com',     name: 'Kemal Arslan', companyType: 'buyer', role: 'admin',  companyId: C_BUYER2 },
  ] as const

  const createdIds: Record<string, string> = {}

  for (const u of demoUsers) {
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: 'Demo1234!',
      email_confirm: true,
      user_metadata: { name: u.name, company_type: u.companyType, role: u.role, company_id: u.companyId },
    })
    if (error) return Response.json({ error: `Auth createUser failed (${u.email}): ${error.message}` }, { status: 500 })
    createdIds[u.email] = data.user.id
  }

  const U_SELLER = createdIds['ali@freshfarm.com']
  const U_BUYER1_ADMIN = createdIds['ayse@gunespazar.com']
  const U_BUYER1_STAFF = createdIds['fatma@gunespazar.com']
  const U_BUYER2_ADMIN = createdIds['kemal@lezzet.com']

  // 2. Şirketler
  const { error: compErr } = await admin.from('companies').insert([
    { id: C_SELLER, name: 'FreshFarm Gıda A.Ş.',    type: 'seller' },
    { id: C_BUYER1, name: 'Güneş Market Zinciri',   type: 'buyer' },
    { id: C_BUYER2, name: 'Lezzet Restoran Grubu',  type: 'buyer' },
  ])
  if (compErr) return Response.json({ error: `companies: ${compErr.message}` }, { status: 500 })

  // 3. Kullanıcı profilleri
  const { error: usrErr } = await admin.from('users').insert([
    { id: U_SELLER,      company_id: C_SELLER, email: 'ali@freshfarm.com',    role: 'admin', name: 'Ali Yılmaz' },
    { id: U_BUYER1_ADMIN, company_id: C_BUYER1, email: 'ayse@gunespazar.com',  role: 'admin', name: 'Ayşe Demir' },
    { id: U_BUYER1_STAFF, company_id: C_BUYER1, email: 'fatma@gunespazar.com', role: 'staff', name: 'Fatma Çelik' },
    { id: U_BUYER2_ADMIN, company_id: C_BUYER2, email: 'kemal@lezzet.com',     role: 'admin', name: 'Kemal Arslan' },
  ])
  if (usrErr) return Response.json({ error: `users: ${usrErr.message}` }, { status: 500 })

  // 4. Ürünler
  const { error: prodErr } = await admin.from('products').insert([
    {
      id: P1, seller_id: C_SELLER, name: 'Organik Zeytinyağı (5L)',
      description: 'Soğuk sıkım, sertifikalı organik zeytinyağı. Ege bölgesi.',
      category: 'Yağlar', min_order_qty: 10,
      price_tiers: [{ min_qty: 10, max_qty: 49, price: 185 }, { min_qty: 50, max_qty: 199, price: 165 }, { min_qty: 200, max_qty: null, price: 145 }],
      status: 'active',
    },
    {
      id: P2, seller_id: C_SELLER, name: 'Tam Buğday Unu (25kg)',
      description: 'Değirmenden doğrudan, gluten oranı yüksek ekmeklik un.',
      category: 'Tahıllar', min_order_qty: 20,
      price_tiers: [{ min_qty: 20, max_qty: 99, price: 42 }, { min_qty: 100, max_qty: 499, price: 38 }, { min_qty: 500, max_qty: null, price: 34 }],
      status: 'active',
    },
    {
      id: P3, seller_id: C_SELLER, name: 'Doğal Bal (1kg)',
      description: 'Karadeniz yayla balı, saf ve katkısız.',
      category: 'Doğal Ürünler', min_order_qty: 12,
      price_tiers: [{ min_qty: 12, max_qty: 59, price: 220 }, { min_qty: 60, max_qty: 299, price: 195 }, { min_qty: 300, max_qty: null, price: 175 }],
      status: 'active',
    },
    {
      id: P4, seller_id: C_SELLER, name: 'Taze Makarna (500g)',
      description: 'Yumurtalı ev yapımı makarna, günlük üretim.',
      category: 'Baklagiller & Makarna', min_order_qty: 24,
      price_tiers: [{ min_qty: 24, max_qty: 119, price: 28 }, { min_qty: 120, max_qty: null, price: 24 }],
      status: 'draft',
    },
  ])
  if (prodErr) return Response.json({ error: `products: ${prodErr.message}` }, { status: 500 })

  // 5. Teklif talepleri
  const now = new Date()
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString()

  const { error: quoteErr } = await admin.from('quote_requests').insert([
    { buyer_id: C_BUYER1, product_id: P1, quantity: 300, buyer_note: 'Düzenli aylık sipariş için fiyat alıyoruz.', status: 'pending',   seller_response_price: null, seller_message: null, created_at: daysAgo(2) },
    { buyer_id: C_BUYER1, product_id: P2, quantity: 600, buyer_note: null, status: 'responded', seller_response_price: 36, seller_message: '600 adet için özel iskonto uygulandı.', created_at: daysAgo(5) },
    { buyer_id: C_BUYER2, product_id: P3, quantity: 150, buyer_note: 'Restoran menüsü için kullanacağız.', status: 'accepted', seller_response_price: 180, seller_message: 'Anlaşma sağlandı, teşekkürler.', created_at: daysAgo(10) },
    { buyer_id: C_BUYER2, product_id: P1, quantity: 50,  buyer_note: null, status: 'declined',  seller_response_price: null, seller_message: null, created_at: daysAgo(15) },
  ])
  if (quoteErr) return Response.json({ error: `quote_requests: ${quoteErr.message}` }, { status: 500 })

  // 6. Siparişler
  const { error: ordErr } = await admin.from('orders').insert([
    { id: O1, buyer_id: C_BUYER1, seller_id: C_SELLER, status: 'delivered', total: 16500, needs_approval: false, approved_by: null,         created_by: U_BUYER1_STAFF, created_at: daysAgo(42) },
    { id: O2, buyer_id: C_BUYER1, seller_id: C_SELLER, status: 'shipped',   total: 42000, needs_approval: true,  approved_by: U_BUYER1_ADMIN, created_by: U_BUYER1_STAFF, created_at: daysAgo(27) },
    { id: O3, buyer_id: C_BUYER2, seller_id: C_SELLER, status: 'pending',   total: 58000, needs_approval: true,  approved_by: null,         created_by: U_BUYER2_ADMIN, created_at: daysAgo(11) },
    { id: O4, buyer_id: C_BUYER1, seller_id: C_SELLER, status: 'confirmed', total: 8900,  needs_approval: false, approved_by: null,         created_by: U_BUYER1_STAFF, created_at: daysAgo(7) },
  ])
  if (ordErr) return Response.json({ error: `orders: ${ordErr.message}` }, { status: 500 })

  // 7. Sipariş kalemleri
  const { error: itemErr } = await admin.from('order_items').insert([
    { order_id: O1, product_id: P1, quantity: 100, unit_price: 165 },
    { order_id: O2, product_id: P2, quantity: 500, unit_price: 38 },
    { order_id: O2, product_id: P3, quantity: 100, unit_price: 175 },
    { order_id: O3, product_id: P2, quantity: 500, unit_price: 34 },
    { order_id: O3, product_id: P1, quantity: 200, unit_price: 145 },
    { order_id: O4, product_id: P3, quantity: 40,  unit_price: 220 },
    { order_id: O4, product_id: P4, quantity: 10,  unit_price: 90 },
  ])
  if (itemErr) return Response.json({ error: `order_items: ${itemErr.message}` }, { status: 500 })

  return Response.json({ success: true, message: 'Demo data seeded successfully' })
}
