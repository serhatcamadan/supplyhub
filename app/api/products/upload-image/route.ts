import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const BUCKET = 'product-images'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const productId = formData.get('productId') as string | null

    if (!file || !productId) {
      return NextResponse.json({ error: 'file and productId required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Create bucket if it doesn't exist yet
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${productId}/main.${ext}`
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
