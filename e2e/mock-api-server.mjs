/**
 * Lightweight mock for the NestJS backend used in E2E tests.
 * - Auth endpoints (/auth/login, /auth/logout)
 * - Product endpoints (/seller/products, /products)
 *
 * On login, queries Supabase (when credentials are available) for real user IDs
 * so pages that query Supabase by companyId (approvals, quotes, cart) work correctly.
 */
import http from 'http'
import { SignJWT } from 'jose'

const SECRET        = process.env.JWT_ACCESS_SECRET
const PORT          = parseInt(process.env.MOCK_API_PORT ?? '3001', 10)
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'Demo1234!'
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SECRET) {
  console.error('[mock-api] JWT_ACCESS_SECRET env var is required')
  process.exit(1)
}

const key = new TextEncoder().encode(SECRET)

// Fallback user data used when Supabase is not configured
const FALLBACK_USERS = {
  'ali@freshfarm.com':   { id: 'user-seller-1', name: 'Ali Demir',    companyId: 'company-seller-1', role: 'admin', companyType: 'seller' },
  'ayse@gunespazar.com': { id: 'user-buyer-1',  name: 'Ayşe Kaya',   companyId: 'company-buyer-1',  role: 'admin', companyType: 'buyer'  },
  'fatma@gunespazar.com':{ id: 'user-buyer-2',  name: 'Fatma Yılmaz',companyId: 'company-buyer-1',  role: 'staff', companyType: 'buyer'  },
  'kemal@lezzet.com':    { id: 'user-buyer-3',  name: 'Kemal Arslan', companyId: 'company-buyer-2',  role: 'admin', companyType: 'buyer'  },
}

async function sbFetch(table, params) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  try {
    const res = await fetch(url.toString(), {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function sbWrite(table, method, params, body) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v)
  const hasBody = method !== 'DELETE' && body !== undefined
  try {
    const res = await fetch(url.toString(), {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      ...(hasBody ? { body: JSON.stringify(body) } : {}),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getRealUser(email) {
  const users = await sbFetch('users', { 'email': `eq.${email}`, 'select': 'id,company_id,role,name' })
  if (!users?.[0]) return null
  const user = users[0]
  const companies = await sbFetch('companies', { 'id': `eq.${user.company_id}`, 'select': 'type' })
  if (!companies?.[0]) return null
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    companyId: user.company_id,
    companyType: companies[0].type,
  }
}

async function sign(payload, expiresIn) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key)
}

function cookie(name, value, opts = {}) {
  const parts = [`${name}=${value}`, 'Path=/']
  if (opts.httpOnly) parts.push('HttpOnly')
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`)
  parts.push('SameSite=Lax')
  return parts.join('; ')
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')) } catch { reject(new Error('Bad JSON')) }
    })
    req.on('error', reject)
  })
}

// Decode JWT payload without verification (mock server only)
function parseJwtPayload(authHeader) {
  const token = (authHeader ?? '').replace(/^Bearer\s+/, '')
  if (!token) return null
  try {
    const payloadB64 = token.split('.')[1]
    return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'))
  } catch {
    return null
  }
}

// Seed-matching mock products returned by /seller/products
const MOCK_SELLER_PRODUCTS = [
  {
    id: 'prod-1', seller_id: 'seed-seller', name: 'Organik Zeytinyağı', description: 'Soğuk sıkım, erken hasat',
    category: 'Yağlar', min_order_qty: 10, status: 'active', image_url: null, created_at: new Date().toISOString(),
    price_tiers: [{ min_qty: 1, max_qty: 49, price: 185 }, { min_qty: 50, max_qty: null, price: 165 }],
    companies: { id: 'seed-seller', name: 'FreshFarm Gıda' },
  },
  {
    id: 'prod-2', seller_id: 'seed-seller', name: 'Tam Buğday Unu', description: 'Stone-ground tam buğday',
    category: 'Tahıl', min_order_qty: 20, status: 'active', image_url: null, created_at: new Date().toISOString(),
    price_tiers: [{ min_qty: 1, max_qty: 99, price: 42 }, { min_qty: 100, max_qty: null, price: 38 }],
    companies: { id: 'seed-seller', name: 'FreshFarm Gıda' },
  },
  {
    id: 'prod-3', seller_id: 'seed-seller', name: 'Organik Çiçek Balı', description: 'Yöresel çiçek balı',
    category: 'Doğal Ürünler', min_order_qty: 5, status: 'active', image_url: null, created_at: new Date().toISOString(),
    price_tiers: [{ min_qty: 1, max_qty: 49, price: 195 }, { min_qty: 50, max_qty: null, price: 175 }],
    companies: { id: 'seed-seller', name: 'FreshFarm Gıda' },
  },
]

const server = http.createServer(async (req, res) => {
  cors(res)
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname

  try {
    // ── Health ────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && path === '/health') {
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
      return
    }

    // ── POST /auth/login ──────────────────────────────────────────────────────
    if (req.method === 'POST' && path === '/auth/login') {
      const { email, password } = await readBody(req)
      const lowerEmail = email?.toLowerCase?.() ?? ''

      if (password !== TEST_PASSWORD || !FALLBACK_USERS[lowerEmail]) {
        res.writeHead(401)
        res.end(JSON.stringify({ statusCode: 401, message: 'Invalid credentials' }))
        return
      }

      // Try real Supabase user data first; fall back to hardcoded
      const realUser = await getRealUser(lowerEmail)
      const user = realUser ?? FALLBACK_USERS[lowerEmail]

      const payload = {
        sub: user.id, email: lowerEmail, name: user.name,
        companyId: user.companyId, role: user.role, companyType: user.companyType,
      }
      const access_token  = await sign(payload, '15m')
      const refresh_token = await sign(payload, '7d')

      res.setHeader('Set-Cookie', [
        cookie('access_token',  access_token,  { maxAge: 900 }),
        cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 604800 }),
      ])
      res.writeHead(200)
      res.end(JSON.stringify({
        access_token,
        user: { id: user.id, email: lowerEmail, name: user.name, role: user.role, companyType: user.companyType },
      }))
      return
    }

    // ── POST /auth/logout ─────────────────────────────────────────────────────
    if (req.method === 'POST' && path === '/auth/logout') {
      res.setHeader('Set-Cookie', [
        cookie('access_token',  '', { maxAge: 0 }),
        cookie('refresh_token', '', { httpOnly: true, maxAge: 0 }),
      ])
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
      return
    }

    // ── GET /seller/products ──────────────────────────────────────────────────
    if (req.method === 'GET' && path === '/seller/products') {
      // Try to fetch real products from Supabase; fall back to seed-matching mock data
      const sellerId = url.searchParams.get('sellerId')
      let products = null
      if (sellerId && SUPABASE_URL && SUPABASE_KEY) {
        products = await sbFetch('products', {
          'seller_id': `eq.${sellerId}`,
          'select': 'id,name,description,category,min_order_qty,price_tiers,status,image_url,created_at,seller_id',
          'order': 'created_at.asc',
        })
      }
      // Shape into ApiProduct (add stub companies field)
      const result = (products?.length ? products : MOCK_SELLER_PRODUCTS).map((p) => ({
        ...p,
        companies: p.companies ?? { id: p.seller_id ?? sellerId ?? '', name: 'FreshFarm Gıda' },
        created_at: p.created_at ?? new Date().toISOString(),
      }))
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    // ── POST /seller/products ─────────────────────────────────────────────────
    if (req.method === 'POST' && path === '/seller/products') {
      const body = await readBody(req)
      const sellerId = url.searchParams.get('sellerId') ?? 'mock-seller'
      const created = {
        id: `prod-${Date.now()}`,
        seller_id: sellerId,
        created_at: new Date().toISOString(),
        companies: { id: sellerId, name: 'FreshFarm Gıda' },
        ...body,
      }
      res.writeHead(201)
      res.end(JSON.stringify(created))
      return
    }

    // ── GET /products ─────────────────────────────────────────────────────────
    if (req.method === 'GET' && path === '/products') {
      let products = null
      if (SUPABASE_URL && SUPABASE_KEY) {
        products = await sbFetch('products', {
          'status': 'eq.active',
          'select': 'id,name,description,category,min_order_qty,price_tiers,status,image_url,created_at,seller_id',
          'order': 'created_at.asc',
        })
      }
      const result = (products?.length ? products : MOCK_SELLER_PRODUCTS).map((p) => ({
        ...p,
        companies: p.companies ?? { id: p.seller_id ?? '', name: 'FreshFarm Gıda' },
        created_at: p.created_at ?? new Date().toISOString(),
      }))
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    // ── POST /orders/:id/approve ──────────────────────────────────────────────
    if (req.method === 'POST' && /^\/orders\/[^/]+\/approve$/.test(path)) {
      const id = path.split('/')[2]
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      if (SUPABASE_URL && SUPABASE_KEY) {
        await sbWrite('orders', 'PATCH', { id: `eq.${id}` }, { approved_by: payload.sub })
      }
      res.writeHead(200)
      res.end(JSON.stringify({ id, approved_by: payload.sub }))
      return
    }

    // ── POST /orders/:id/reject ───────────────────────────────────────────────
    if (req.method === 'POST' && /^\/orders\/[^/]+\/reject$/.test(path)) {
      const id = path.split('/')[2]
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      if (SUPABASE_URL && SUPABASE_KEY) {
        await sbWrite('order_items', 'DELETE', { order_id: `eq.${id}` }, {})
        await sbWrite('orders', 'DELETE', { id: `eq.${id}` }, {})
      }
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
      return
    }

    // ── POST /orders ─────────────────────────────────────────────────────────
    if (req.method === 'POST' && path === '/orders') {
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      const body = await readBody(req)
      let orderId = `order-${Date.now()}`
      if (SUPABASE_URL && SUPABASE_KEY) {
        const rows = await sbWrite('orders', 'POST', {}, {
          buyer_id: payload.companyId,
          seller_id: body.sellerId,
          status: 'pending',
          total: 0,
          needs_approval: false,
          created_by: payload.sub,
        })
        if (rows?.[0]?.id) orderId = rows[0].id
      }
      res.writeHead(201)
      res.end(JSON.stringify({ id: orderId, status: 'pending' }))
      return
    }

    // ── GET /orders ───────────────────────────────────────────────────────────
    if (req.method === 'GET' && path === '/orders') {
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) {
        res.writeHead(401)
        res.end(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }))
        return
      }
      const { companyId, companyType } = payload
      let orders = null
      if (SUPABASE_URL && SUPABASE_KEY) {
        const filterKey = companyType === 'buyer' ? 'buyer_id' : 'seller_id'
        orders = await sbFetch('orders', {
          select: '*,buyer:companies!orders_buyer_id_fkey(id,name,type),seller:companies!orders_seller_id_fkey(id,name,type),created_by_user:users!orders_created_by_fkey(id,name,role),approved_by_user:users!orders_approved_by_fkey(id,name),items:order_items(id,order_id,product_id,quantity,unit_price,product:products(id,name,image_url))',
          [filterKey]: `eq.${companyId}`,
          order: 'created_at.desc',
        })
      }
      res.writeHead(200)
      res.end(JSON.stringify(orders ?? []))
      return
    }

    // ── GET /quote-requests/:id ───────────────────────────────────────────────
    if (req.method === 'GET' && /^\/quote-requests\/[^/]+$/.test(path)) {
      const id = path.split('/')[2]
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      let quote = null
      if (SUPABASE_URL && SUPABASE_KEY) {
        const rows = await sbFetch('quote_requests', {
          id: `eq.${id}`,
          select: '*,buyer:companies(id,name,type),product:products(id,name,category,min_order_qty,price_tiers,status,image_url,seller_id,companies(id,name,type))',
          limit: '1',
        })
        if (rows?.[0]) {
          const r = rows[0]
          quote = {
            ...r,
            seller_response_price: r.seller_response_price !== null ? Number(r.seller_response_price) : null,
          }
        }
      }
      if (!quote) { res.writeHead(404); res.end(JSON.stringify({ statusCode: 404 })); return }
      res.writeHead(200)
      res.end(JSON.stringify(quote))
      return
    }

    // ── PATCH /quote-requests/:id/respond ────────────────────────────────────
    if (req.method === 'PATCH' && /^\/quote-requests\/[^/]+\/respond$/.test(path)) {
      const id = path.split('/')[2]
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      const body = await readBody(req)
      if (SUPABASE_URL && SUPABASE_KEY) {
        await sbWrite('quote_requests', 'PATCH', { id: `eq.${id}` }, {
          seller_response_price: body.seller_response_price,
          seller_message: body.seller_message ?? null,
          status: 'responded',
        })
      }
      res.writeHead(200)
      res.end(JSON.stringify({ id, status: 'responded', ...body }))
      return
    }

    // ── PATCH /quote-requests/:id/seller-decline ──────────────────────────────
    if (req.method === 'PATCH' && /^\/quote-requests\/[^/]+\/seller-decline$/.test(path)) {
      const id = path.split('/')[2]
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      if (SUPABASE_URL && SUPABASE_KEY) {
        await sbWrite('quote_requests', 'PATCH', { id: `eq.${id}` }, { status: 'declined' })
      }
      res.writeHead(200)
      res.end(JSON.stringify({ id, status: 'declined' }))
      return
    }

    // ── POST /quote-requests ──────────────────────────────────────────────────
    if (req.method === 'POST' && path === '/quote-requests') {
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) { res.writeHead(401); res.end(JSON.stringify({ statusCode: 401 })); return }
      const body = await readBody(req)
      let created = null
      if (SUPABASE_URL && SUPABASE_KEY) {
        const rows = await sbWrite('quote_requests', 'POST', {}, {
          buyer_id: payload.companyId,
          product_id: body.productId,
          quantity: body.quantity,
          buyer_note: body.buyer_note ?? null,
          status: 'pending',
        })
        created = rows?.[0] ?? null
      }
      res.writeHead(201)
      res.end(JSON.stringify(created ?? { id: `qr-${Date.now()}`, status: 'pending', ...body }))
      return
    }

    // ── GET /quote-requests ───────────────────────────────────────────────────
    if (req.method === 'GET' && path === '/quote-requests') {
      const payload = parseJwtPayload(req.headers['authorization'])
      if (!payload) {
        res.writeHead(401)
        res.end(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }))
        return
      }
      const { companyId, companyType } = payload
      let quotes = null
      if (SUPABASE_URL && SUPABASE_KEY) {
        if (companyType === 'buyer') {
          quotes = await sbFetch('quote_requests', {
            select: '*,buyer:companies(id,name,type),product:products(id,name,category,min_order_qty,price_tiers,status,image_url,seller_id,companies(id,name,type))',
            buyer_id: `eq.${companyId}`,
            order: 'created_at.desc',
          })
        } else {
          // Seller: get products first, then match quote requests
          const sellerProducts = await sbFetch('products', {
            seller_id: `eq.${companyId}`,
            select: 'id,name,category,min_order_qty,price_tiers,status,image_url,seller_id',
          })
          if (sellerProducts?.length) {
            const productIds = sellerProducts.map((p) => p.id)
            const rawQuotes = await sbFetch('quote_requests', {
              product_id: `in.(${productIds.join(',')})`,
              select: '*,buyer:companies(id,name,type)',
              order: 'created_at.desc',
            })
            const sellerCompanies = await sbFetch('companies', {
              id: `eq.${companyId}`,
              select: 'id,name,type',
            })
            const sellerCompany = sellerCompanies?.[0] ?? { id: companyId, name: 'FreshFarm Gıda', type: 'seller' }
            const productMap = Object.fromEntries(sellerProducts.map((p) => [p.id, p]))
            quotes = (rawQuotes ?? []).map((q) => ({
              ...q,
              product: { ...productMap[q.product_id], companies: sellerCompany },
            }))
          } else {
            quotes = []
          }
        }
      }
      res.writeHead(200)
      res.end(JSON.stringify(quotes ?? []))
      return
    }

    // ── POST /test/reset ─────────────────────────────────────────────────────
    if (req.method === 'POST' && path === '/test/reset') {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const companies = await sbFetch('companies', { select: 'id,name,type' }) ?? []
        const seller = companies.find((c) => c.name === 'FreshFarm Gıda')

        // Demo users'dan company_id türet — sıra bağımsız, yeni kayıtlı şirketlerden etkilenmez
        const users = await sbFetch('users', { email: `in.(ayse@gunespazar.com,kemal@lezzet.com,ali@freshfarm.com)`, select: 'id,email,company_id' }) ?? []
        const uBuyer1Admin = users.find((u) => u.email === 'ayse@gunespazar.com')?.id
        const uBuyer2Admin = users.find((u) => u.email === 'kemal@lezzet.com')?.id
        const cBuyer1 = users.find((u) => u.email === 'ayse@gunespazar.com')?.company_id
        const cBuyer2 = users.find((u) => u.email === 'kemal@lezzet.com')?.company_id
        const cSeller = users.find((u) => u.email === 'ali@freshfarm.com')?.company_id ?? seller?.id

        if (!cSeller || !cBuyer1 || !cBuyer2) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'Demo company IDs not found' })); return
        }
        if (!uBuyer1Admin || !uBuyer2Admin) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'Demo users not found' })); return
        }

        const products = await sbFetch('products', { seller_id: `eq.${cSeller}`, select: 'id,name' }) ?? []
        const p1 = products.find((p) => p.name.includes('Zeytinyağı'))?.id
        const p2 = products.find((p) => p.name.includes('Buğday'))?.id
        const p3 = products.find((p) => p.name.includes('Bal'))?.id
        if (!p1 || !p2 || !p3) {
          res.writeHead(400); res.end(JSON.stringify({ error: 'Products not found' })); return
        }

        const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString()
        const productIds = products.map((p) => p.id)
        await sbWrite('quote_requests', 'DELETE', { product_id: `in.(${productIds.join(',')})` })
        await sbWrite('quote_requests', 'POST', {}, [
          { buyer_id: cBuyer1, product_id: p1, quantity: 300, status: 'pending', buyer_note: 'Düzenli aylık sipariş için fiyat alıyoruz.', created_at: daysAgo(2) },
          { buyer_id: cBuyer1, product_id: p2, quantity: 600, status: 'responded', seller_response_price: 36, seller_message: '600 adet için özel iskonto uygulandı.', created_at: daysAgo(5) },
          { buyer_id: cBuyer2, product_id: p3, quantity: 150, status: 'accepted', buyer_note: 'Restoran menüsü için kullanacağız.', seller_response_price: 180, seller_message: 'Anlaşma sağlandı, teşekkürler.', created_at: daysAgo(10) },
          { buyer_id: cBuyer2, product_id: p1, quantity: 50, status: 'declined', created_at: daysAgo(15) },
        ])

        const existingOrders = await sbFetch('orders', { seller_id: `eq.${cSeller}`, select: 'id' }) ?? []
        const orderIds = existingOrders.map((o) => o.id)
        if (orderIds.length) {
          await sbWrite('order_items', 'DELETE', { order_id: `in.(${orderIds.join(',')})` })
          await sbWrite('orders', 'DELETE', { id: `in.(${orderIds.join(',')})` })
        }

        const newOrders = await sbWrite('orders', 'POST', {}, [
          { buyer_id: cBuyer1, seller_id: cSeller, status: 'delivered', total: 16500, needs_approval: false, created_by: uBuyer1Admin, created_at: daysAgo(42) },
          { buyer_id: cBuyer1, seller_id: cSeller, status: 'shipped',   total: 42000, needs_approval: true,  approved_by: uBuyer1Admin, created_by: uBuyer1Admin, created_at: daysAgo(27) },
          { buyer_id: cBuyer2, seller_id: cSeller, status: 'pending',   total: 58000, needs_approval: true,  created_by: uBuyer2Admin, created_at: daysAgo(11) },
          { buyer_id: cBuyer1, seller_id: cSeller, status: 'confirmed', total: 8900,  needs_approval: false, created_by: uBuyer1Admin, created_at: daysAgo(7) },
        ]) ?? []
        const [oDelivered, oShipped, oPending, oConfirmed] = newOrders.map((o) => o.id)
        if (oDelivered && oShipped && oPending && oConfirmed) {
          await sbWrite('order_items', 'POST', {}, [
            { order_id: oDelivered, product_id: p1, quantity: 100, unit_price: 165 },
            { order_id: oShipped,   product_id: p2, quantity: 500, unit_price: 38  },
            { order_id: oShipped,   product_id: p3, quantity: 100, unit_price: 175 },
            { order_id: oPending,   product_id: p2, quantity: 500, unit_price: 34  },
            { order_id: oPending,   product_id: p1, quantity: 200, unit_price: 145 },
            { order_id: oConfirmed, product_id: p3, quantity:  40, unit_price: 220 },
            { order_id: oConfirmed, product_id: p1, quantity:  10, unit_price: 145 },
          ])
        }
      }
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true, message: 'Test data reset to seed state' }))
      return
    }

    res.writeHead(404)
    res.end(JSON.stringify({ statusCode: 404, message: 'Not found' }))
  } catch (err) {
    console.error('[mock-api] Unhandled error:', err)
    res.writeHead(500)
    res.end(JSON.stringify({ statusCode: 500, message: 'Internal server error' }))
  }
})

server.listen(PORT, () => {
  console.log(`[mock-api] Listening on http://localhost:${PORT}`)
  if (SUPABASE_URL) console.log('[mock-api] Supabase integration: enabled')
  else              console.log('[mock-api] Supabase integration: disabled (using fallback data)')
})
