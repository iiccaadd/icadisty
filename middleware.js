import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login'
    const isAuthenticated = await isAdmin(request)

    // If not authenticated and trying to access protected admin page
    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If already authenticated and trying to access /admin/login
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
