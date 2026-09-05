const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function POST() {
  try {
    const res = await fetch(`${API_URL}/test/reset`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: 'NestJS backend unreachable' }, { status: 503 })
  }
}
