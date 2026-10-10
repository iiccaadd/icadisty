import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { isAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const BUCKET = 'photos'

// Returns a one-time signed URL; the browser uploads straight to Supabase Storage,
// which avoids Vercel's 4.5 MB request body limit on API routes.
export async function POST(request) {
  try {
    if (!(await isAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type } = await request.json()
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[type]
    if (!ext) {
      return NextResponse.json({ error: 'Format harus JPG, PNG, WEBP, atau GIF' }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    // Fails harmlessly with "already exists" after the first upload
    await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: '10MB', allowedMimeTypes: ['image/*'] })

    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ signedUrl: data.signedUrl, publicUrl: pub.publicUrl })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
