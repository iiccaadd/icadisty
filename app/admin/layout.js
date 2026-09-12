'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  const [loading, setLoading] = useState(!isLoginPage)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    // Verify session
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/auth')
        const data = await res.json()
        if (data.authenticated) {
          setAuthenticated(true)
        } else {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
        }
      } catch (e) {
        router.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [pathname, isLoginPage, router])

  const handleLogout = async () => {
    if (!confirm('Keluar dari sesi portal admin?')) return
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      setAuthenticated(false)
      router.replace('/admin/login')
    } catch (e) {
      console.error(e)
    }
  }

  if (isLoginPage) {
    return <div className="admin-body">{children}</div>
  }

  if (loading) {
    return (
      <div className="admin-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <div className="admin-spinner" />
        <p style={{ color: '#F1C193', fontFamily: '"Playfair Display", serif', letterSpacing: '0.1em', fontSize: 14 }}>
          Memverifikasi Sesi Admin...
        </p>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="admin-body">
      {/* Top Header (Desktop & Mobile Brand) */}
      <header className="admin-header">
        <Link href="/admin" className="admin-brand">
          <div className="admin-brand-logo">IA</div>
          <div>
            <h1 className="admin-brand-title">Irsyad &amp; Adisty</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, letterSpacing: '0.15em', color: 'var(--admin-muted)', textTransform: 'uppercase' }}>
                Admin Portal
              </span>
              <span className="admin-session-badge">
                <span className="pulse-dot" /> Aktif
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="admin-nav admin-nav-desktop">
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
          <Link
            href="/admin/settings"
            className={`admin-nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}
          >
            ⚙️ Pengaturan Foto &amp; Latar
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-link"
            style={{ color: 'var(--admin-gold)' }}
          >
            👁️ Preview ↗
          </a>
          <button
            onClick={handleLogout}
            className="admin-nav-link btn-logout"
            title="Keluar dari Portal Admin"
          >
            🚪 Keluar
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="admin-container">{children}</main>

      {/* Mobile App Bottom Navigation Bar */}
      <nav className="admin-mobile-bottom-nav" aria-label="Mobile Admin Navigation">
        <Link
          href="/admin"
          className={`bottom-nav-item ${pathname === '/admin' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">📊</span>
          <span className="bottom-nav-label">Ringkasan</span>
        </Link>
        <Link
          href="/admin/rsvp"
          className={`bottom-nav-item ${pathname === '/admin/rsvp' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">💌</span>
          <span className="bottom-nav-label">RSVP</span>
        </Link>
        <Link
          href="/admin/guests"
          className={`bottom-nav-item ${pathname === '/admin/guests' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">👥</span>
          <span className="bottom-nav-label">Tamu</span>
        </Link>
        <Link
          href="/admin/settings"
          className={`bottom-nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">⚙️</span>
          <span className="bottom-nav-label">Setting</span>
        </Link>
        <button
          onClick={handleLogout}
          className="bottom-nav-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="bottom-nav-icon">🚪</span>
          <span className="bottom-nav-label">Keluar</span>
        </button>
      </nav>
    </div>
  )
}
