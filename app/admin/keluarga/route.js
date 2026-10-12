import { NextResponse } from 'next/server'
import { FAMILY_COOKIE, familyKey, familyToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

// Shared family link: /admin/keluarga?k=<key> opens the guest list without the admin password
export async function GET(request) {
  const key = await familyKey()
  const given = new URL(request.url).searchParams.get('k')

  if (!key || given !== key) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const res = NextResponse.redirect(new URL('/admin/guests', request.url))
  res.cookies.set(FAMILY_COOKIE, await familyToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 60, // 60 days, past the wedding day
    path: '/',
  })
  return res
}
