'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../admin.css'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push('/admin')
      } else {
        setError(data.error || 'Kata sandi atau PIN salah')
      }
    } catch (err) {
      setError('Terjadi kendala saat login. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: `
          radial-gradient(ellipse at center, rgba(30, 18, 10, 0.8) 0%, #000 80%),
          url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="admin-card"
        style={{
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          border: '1px solid rgba(241, 193, 147, 0.3)',
          background: 'rgba(15, 11, 8, 0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F1C193, #8B5E3C)',
            color: '#000',
            fontSize: 22,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 20px rgba(241,193,147,0.3)',
          }}
        >
          IA
        </div>

        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            color: '#F1C193',
            fontSize: '1.6rem',
            margin: '0 0 4px',
          }}
        >
          Irsyad &amp; Adisty
        </h2>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
          Portal Admin Undangan
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(211, 47, 47, 0.15)',
              border: '1px solid rgba(211, 47, 47, 0.4)',
              color: '#ff8a80',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              PIN / Sandi Keamanan
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan PIN (Default: 2026)"
              required
              className="admin-input"
              style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-admin"
            style={{ justifyContent: 'center', padding: '12px 20px', marginTop: 8 }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
          PIN Default: <code style={{ color: '#F1C193' }}>2026</code> atau sandi <code style={{ color: '#F1C193' }}>icadisty2026</code>
        </p>
      </div>
    </div>
  )
}
