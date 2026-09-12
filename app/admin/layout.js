'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (e) {
      console.error(e)
    }
  }

  if (isLoginPage) {
    return <div className="admin-body">{children}</div>
  }

  return (
    <div className="admin-body">
      <header className="admin-header">
        <Link href="/admin" className="admin-brand">
          <div className="admin-brand-logo">IA</div>
          <div>
            <h1 className="admin-brand-title">Irsyad &amp; Adisty</h1>
            <span style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--admin-muted)', textTransform: 'uppercase' }}>
              Admin Portal
            </span>
          </div>
        </Link>

        <nav className="admin-nav">
          <Link
            href="/admin"
            className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/rsvp"
            className={`admin-nav-link ${pathname === '/admin/rsvp' ? 'active' : ''}`}
          >
            💌 RSVP &amp; Doa
          </Link>
          <Link
            href="/admin/guests"
            className={`admin-nav-link ${pathname === '/admin/guests' ? 'active' : ''}`}
          >
            👥 Buku Tamu
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-link"
            style={{ color: 'var(--admin-gold)' }}
          >
            👁️ Lihat Undangan ↗
          </a>
          <button
            onClick={handleLogout}
            className="admin-nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            🚪 Keluar
          </button>
        </nav>
      </header>

      <main className="admin-container">{children}</main>
    </div>
  )
}
