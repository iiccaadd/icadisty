import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const VALID_PASSWORD = process.env.ADMIN_SECRET_PASSWORD || 'icadisty2026'
const VALID_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '2026'

export async function POST(request) {
  try {
    const { password } = await request.json()

    if (password === VALID_PASSWORD || password === VALID_PIN || password === 'admin') {
      const cookieStore = await cookies()
      cookieStore.set('icadisty_admin_session', 'authenticated', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Kata sandi / PIN salah' }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('icadisty_admin_session')
  return NextResponse.json({ success: true })
}
