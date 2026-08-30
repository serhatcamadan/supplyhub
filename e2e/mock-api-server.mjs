/**
 * Lightweight mock for the NestJS backend used in E2E tests.
 * Handles only the auth endpoints the Playwright suite needs.
 * Reads JWT_ACCESS_SECRET from env (must match the value Next.js uses in proxy.ts).
 */
import http from 'http'
import { SignJWT } from 'jose'

const SECRET = process.env.JWT_ACCESS_SECRET
const PORT = parseInt(process.env.MOCK_API_PORT ?? '3001', 10)
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'Demo1234!'

if (!SECRET) {
  console.error('[mock-api] JWT_ACCESS_SECRET env var is required')
  process.exit(1)
}

const key = new TextEncoder().encode(SECRET)

const USERS = {
  'ali@freshfarm.com': {
    id: 'user-seller-1', name: 'Ali Demir',
    companyId: 'company-seller-1', role: 'admin', companyType: 'seller',
  },
  'ayse@gunespazar.com': {
    id: 'user-buyer-1', name: 'Ayşe Kaya',
    companyId: 'company-buyer-1', role: 'admin', companyType: 'buyer',
  },
  'fatma@gunespazar.com': {
    id: 'user-buyer-2', name: 'Fatma Yılmaz',
    companyId: 'company-buyer-1', role: 'staff', companyType: 'buyer',
  },
  'kemal@lezzet.com': {
    id: 'user-buyer-3', name: 'Kemal Arslan',
    companyId: 'company-buyer-2', role: 'admin', companyType: 'buyer',
  },
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

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
      return
    }

    if (req.method === 'POST' && req.url === '/auth/login') {
      const { email, password } = await readBody(req)
      const user = USERS[email?.toLowerCase?.()]

      if (!user || password !== TEST_PASSWORD) {
        res.writeHead(401)
        res.end(JSON.stringify({ statusCode: 401, message: 'Invalid credentials' }))
        return
      }

      const payload = {
        sub: user.id, email, name: user.name,
        companyId: user.companyId, role: user.role, companyType: user.companyType,
      }
      const access_token = await sign(payload, '15m')
      const refresh_token = await sign(payload, '7d')

      res.setHeader('Set-Cookie', [
        cookie('access_token', access_token, { maxAge: 900 }),
        cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 604800 }),
      ])
      res.writeHead(200)
      res.end(JSON.stringify({
        access_token,
        user: { id: user.id, email, name: user.name, role: user.role, companyType: user.companyType },
      }))
      return
    }

    if (req.method === 'POST' && req.url === '/auth/logout') {
      res.setHeader('Set-Cookie', [
        cookie('access_token', '', { maxAge: 0 }),
        cookie('refresh_token', '', { httpOnly: true, maxAge: 0 }),
      ])
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
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
})
