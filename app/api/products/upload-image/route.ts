import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAccessToken } from '@/lib/auth/verify-token'

const BUCKET = 'product-images'
const MAX_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value
    const user = token ? await verifyAccessToken(token) : null
    if (!user || user.companyType !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const productId = formData.get('productId') as string | null
    const slot = formData.get('slot') as string | null

    if (!file || !productId) {
      return NextResponse.json({ error: 'file and productId required' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 8MB limit' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Only the product's own seller may write its images.
    const { data: product } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single()
    if (!product || product.seller_id !== user.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create bucket if it doesn't exist yet
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Unsupported file extension' }, { status: 400 })
    }
    const filename = slot !== null ? `img-${slot}` : 'main'
    const path = `${productId}/${filename}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { upsert: true, contentType: file.type })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
