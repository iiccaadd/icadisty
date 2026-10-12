import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, FAMILY_COOKIE, adminToken, familyKey, isAdmin, isFamily } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

// Verify active session
export async function GET(request) {
  try {
    const admin = await isAdmin(request)
    const role = admin ? 'admin' : (await isFamily(request)) ? 'family' : null
    const familyLink = admin ? `${new URL(request.url).origin}/admin/keluarga?k=${await familyKey()}` : undefined
    return NextResponse.json({ authenticated: Boolean(role), role, familyLink })
  } catch (err) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 })
  }
}

// Log in and create session
export async function POST(request) {
  try {
    const { password } = await request.json()
    const token = await adminToken()

    if (!token) {
      return NextResponse.json({ error: 'ADMIN_SECRET_PASSWORD belum diatur di server' }, { status: 500 })
    }

    if (password === process.env.ADMIN_SECRET_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Kata sandi salah' }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Log out and destroy session
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  cookieStore.delete(FAMILY_COOKIE)
  return NextResponse.json({ success: true })
}
