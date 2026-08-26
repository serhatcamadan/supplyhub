import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

// Sadece sunucu tarafında — service_role key istemciye hiç gönderilmez

// Sabit UUID'ler — tekrar çalıştırıldığında aynı kayıtları üretir
const C_SELLER = 'c0000001-0000-0000-0000-000000000001'
const C_BUYER1 = 'c0000002-0000-0000-0000-000000000002'
const C_BUYER2 = 'c0000003-0000-0000-0000-000000000003'

const P1 = 'f0000001-0000-0000-0000-000000000001'
const P2 = 'f0000002-0000-0000-0000-000000000002'
const P3 = 'f0000003-0000-0000-0000-000000000003'
const P4 = 'f0000004-0000-0000-0000-000000000004'

const O1 = 'b0000001-0000-0000-0000-000000000001'
const O2 = 'b0000002-0000-0000-0000-000000000002'
const O3 = 'b0000003-0000-0000-0000-000000000003'
const O4 = 'b0000004-0000-0000-0000-000000000004'

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

const DEMO_USERS = [
  { email: 'ali@freshfarm.com',    password: 'Demo1234!', name: 'Ali Yılmaz',   company_type: 'seller' as const, role: 'admin' as const, company_id: C_SELLER },
  { email: 'ayse@gunespazar.com',  password: 'Demo1234!', name: 'Ayşe Demir',   company_type: 'buyer'  as const, role: 'admin' as const, company_id: C_BUYER1 },
  { email: 'fatma@gunespazar.com', password: 'Demo1234!', name: 'Fatma Çelik',  company_type: 'buyer'  as const, role: 'staff' as const, company_id: C_BUYER1 },
  { email: 'kemal@lezzet.com',     password: 'Demo1234!', name: 'Kemal Arslan', company_type: 'buyer'  as const, role: 'admin' as const, company_id: C_BUYER2 },
]

export async function POST() {
  const admin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Zaten seed yapılmış mı?
  const { count } = await admin.from('companies').select('*', { count: 'exact', head: true })
  if (count && count > 0) {
    return Response.json({ ok: true, message: 'Zaten hazır, tekrar çalıştırılmadı.' })
  }

  // ── 1. Şirketler ─────────────────────────────────────────────
  const { error: companyErr } = await admin.from('companies').insert([
    { id: C_SELLER, name: 'FreshFarm Gıda A.Ş.',    type: 'seller' },
    { id: C_BUYER1, name: 'Güneş Market Zinciri',   type: 'buyer'  },
    { id: C_BUYER2, name: 'Lezzet Restoranları',    type: 'buyer'  },
  ])
  if (companyErr) return Response.json({ error: `Şirket: ${companyErr.message}` }, { status: 500 })

  // ── 2. Auth kullanıcıları (GoTrue admin API) ──────────────────
  const authIds: Record<string, string> = {}
  for (const u of DEMO_USERS) {
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        name: u.name,
        company_type: u.company_type,
        role: u.role,
        company_id: u.company_id,
      },
    })
    if (error) return Response.json({ error: `Auth (${u.email}): ${error.message}` }, { status: 500 })
    authIds[u.email] = data.user.id
  }

  // ── 3. Kullanıcı profilleri ───────────────────────────────────
  const { error: profileErr } = await admin.from('users').insert(
    DEMO_USERS.map((u) => ({
      id: authIds[u.email],
      company_id: u.company_id,
      email: u.email,
      role: u.role,
      name: u.name,
    }))
  )
  if (profileErr) return Response.json({ error: `Profil: ${profileErr.message}` }, { status: 500 })

  // ── 4. Ürünler ────────────────────────────────────────────────
  const { error: productErr } = await admin.from('products').insert([
    {
      id: P1, seller_id: C_SELLER, name: 'Organik Zeytinyağı (5L)', status: 'active',
      description: 'Soğuk sıkım, sertifikalı organik zeytinyağı. Ege bölgesi.',
      category: 'Yağlar', min_order_qty: 10,
      price_tiers: [
        { min_qty: 10,  max_qty: 49,  price: 185 },
        { min_qty: 50,  max_qty: 199, price: 165 },
        { min_qty: 200, max_qty: null, price: 145 },
      ],
    },
    {
      id: P2, seller_id: C_SELLER, name: 'Tam Buğday Unu (25kg)', status: 'active',
      description: 'Değirmenden doğrudan, gluten oranı yüksek ekmeklik un.',
      category: 'Tahıllar', min_order_qty: 20,
      price_tiers: [
        { min_qty: 20,  max_qty: 99,  price: 42 },
        { min_qty: 100, max_qty: 499, price: 38 },
        { min_qty: 500, max_qty: null, price: 34 },
      ],
    },
    {
      id: P3, seller_id: C_SELLER, name: 'Doğal Bal (1kg)', status: 'active',
      description: 'Karadeniz yayla balı, saf ve katkısız.',
      category: 'Doğal Ürünler', min_order_qty: 12,
      price_tiers: [
        { min_qty: 12,  max_qty: 59,  price: 220 },
        { min_qty: 60,  max_qty: 299, price: 195 },
        { min_qty: 300, max_qty: null, price: 175 },
      ],
    },
    {
      id: P4, seller_id: C_SELLER, name: 'Taze Makarna (500g)', status: 'draft',
      description: 'Yumurtalı ev yapımı makarna, günlük üretim.',
      category: 'Baklagiller & Makarna', min_order_qty: 24,
      price_tiers: [
        { min_qty: 24,  max_qty: 119, price: 28 },
        { min_qty: 120, max_qty: null, price: 24 },
      ],
    },
  ])
  if (productErr) return Response.json({ error: `Ürün: ${productErr.message}` }, { status: 500 })

  // ── 5. Teklif talepleri ───────────────────────────────────────
  const { error: quoteErr } = await admin.from('quote_requests').insert([
    { buyer_id: C_BUYER1, product_id: P1, quantity: 300, status: 'pending',
      buyer_note: 'Düzenli aylık sipariş için fiyat alıyoruz.', created_at: daysAgo(2) },
    { buyer_id: C_BUYER1, product_id: P2, quantity: 600, status: 'responded',
      seller_response_price: 36, seller_message: '600 adet için özel iskonto uygulandı.', created_at: daysAgo(5) },
    { buyer_id: C_BUYER2, product_id: P3, quantity: 150, status: 'accepted',
      buyer_note: 'Restoran menüsü için kullanacağız.',
      seller_response_price: 180, seller_message: 'Anlaşma sağlandı, teşekkürler.', created_at: daysAgo(10) },
    { buyer_id: C_BUYER2, product_id: P1, quantity: 50, status: 'declined', created_at: daysAgo(15) },
  ])
  if (quoteErr) return Response.json({ error: `Teklif: ${quoteErr.message}` }, { status: 500 })

  // ── 6. Siparişler ─────────────────────────────────────────────
  const uBuyer1Admin = authIds['ayse@gunespazar.com']
  const uBuyer1Staff = authIds['fatma@gunespazar.com']
  const uBuyer2Admin = authIds['kemal@lezzet.com']

  const { error: orderErr } = await admin.from('orders').insert([
    { id: O1, buyer_id: C_BUYER1, seller_id: C_SELLER, status: 'delivered',
      total: 16500, needs_approval: false, created_by: uBuyer1Staff, created_at: daysAgo(42) },
    { id: O2, buyer_id: C_BUYER1, seller_id: C_SELLER, status: 'shipped',
      total: 42000, needs_approval: true, approved_by: uBuyer1Admin, created_by: uBuyer1Staff, created_at: daysAgo(27) },
    { id: O3, buyer_id: C_BUYER2, seller_id: C_SELLER, status: 'pending',
      total: 58000, needs_approval: true, created_by: uBuyer2Admin, created_at: daysAgo(11) },
    { id: O4, buyer_id: C_BUYER1, seller_id: C_SELLER, status: 'confirmed',
      total: 8900, needs_approval: false, created_by: uBuyer1Staff, created_at: daysAgo(7) },
  ])
  if (orderErr) return Response.json({ error: `Sipariş: ${orderErr.message}` }, { status: 500 })

  // ── 7. Sipariş kalemleri ──────────────────────────────────────
  const { error: itemErr } = await admin.from('order_items').insert([
    { order_id: O1, product_id: P1, quantity: 100, unit_price: 165 },
    { order_id: O2, product_id: P2, quantity: 500, unit_price: 38  },
    { order_id: O2, product_id: P3, quantity: 100, unit_price: 175 },
    { order_id: O3, product_id: P2, quantity: 500, unit_price: 34  },
    { order_id: O3, product_id: P1, quantity: 200, unit_price: 145 },
    { order_id: O4, product_id: P3, quantity: 40,  unit_price: 220 },
    { order_id: O4, product_id: P4, quantity: 10,  unit_price: 90  },
  ])
  if (itemErr) return Response.json({ error: `Sipariş kalemi: ${itemErr.message}` }, { status: 500 })

  return Response.json({
    ok: true,
    message: 'Seed tamamlandı',
    accounts: DEMO_USERS.map((u) => ({
      email: u.email,
      password: u.password,
      portal: u.company_type,
      role: u.role,
    })),
  })
}
