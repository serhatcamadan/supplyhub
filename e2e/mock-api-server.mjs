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
