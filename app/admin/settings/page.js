'use client'

import { useState, useEffect } from 'react'

const PHOTO_PRESETS = {
  groom: [
    { label: 'Groom Classic Dark', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
    { label: 'Groom Elegant Suit', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' },
    { label: 'Groom Warm Lighting', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
  ],
  bride: [
    { label: 'Bride Warm Elegant', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
    { label: 'Bride White Veil', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop' },
    { label: 'Bride Golden Hour', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop' },
  ],
  heroBg: [
    { label: 'Night Romantic Lights', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Cinematic Sunset Glow', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Royal Arch Backdrop', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop' },
  ],
  closingBg: [
    { label: 'Luxury Lanterns Night', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Sparkler Celebration', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop' },
  ],
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('photos') // photos | moments | background

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const json = await res.json()
      if (json.data) {
        setSettings(json.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setToast('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setToast('✓ Pengaturan foto dan latar berhasil disimpan!')
        setTimeout(() => setToast(''), 4000)
      } else {
        alert(json.error || 'Gagal menyimpan pengaturan')
      }
    } catch (e) {
      alert('Terjadi kesalahan saat menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--admin-muted)' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 16px' }} />
        <p>Memuat pengaturan foto dan latar portal guest...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#F1C193', margin: '0 0 4px' }}>
            Pengaturan Foto &amp; Latar Undangan
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Ubah foto pria, foto wanita, galeri momen 3D, foto latar cover, dan nuansa tema secara langsung
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-admin-outline"
          >
            👁️ Preview Undangan Tamu ↗
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-admin"
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {toast && (
        <div
          style={{
            background: 'rgba(46, 125, 50, 0.25)',
            border: '1px solid rgba(129, 199, 132, 0.5)',
            color: '#a5d6a7',
            padding: '12px 20px',
            borderRadius: 10,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('photos')}
          className={`btn-admin-outline ${activeTab === 'photos' ? 'active' : ''}`}
          style={{ background: activeTab === 'photos' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          📸 Foto Pengantin (Pria &amp; Wanita)
        </button>
        <button
          onClick={() => setActiveTab('moments')}
          className={`btn-admin-outline ${activeTab === 'moments' ? 'active' : ''}`}
          style={{ background: activeTab === 'moments' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          🎞️ Galeri Momen 3D Slice
        </button>
        <button
          onClick={() => setActiveTab('background')}
          className={`btn-admin-outline ${activeTab === 'background' ? 'active' : ''}`}
          style={{ background: activeTab === 'background' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          🎨 Foto Latar &amp; Nuansa Tema
        </button>
      </div>

      {/* TAB 1: FOTO PENGANTIN */}
      {activeTab === 'photos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Groom Card */}
          <div className="admin-card">
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
              🤵 Foto Pengantin Pria (The Groom)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 14 }}>
              Foto ini tampil pada kartu 3D berputar di samping nama <strong>Muhammad Irsyad</strong>.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                URL Gambar Foto Pria
              </label>
              <input
                type="text"
                value={settings?.groomPhoto || ''}
                onChange={(e) => updateField('groomPhoto', e.target.value)}
                placeholder="https://..."
                className="admin-input"
              />
            </div>

            {/* Presets */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                Pilihan Cepat (Presets):
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PHOTO_PRESETS.groom.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => updateField('groomPhoto', p.url)}
                    className="btn-admin-outline"
                    style={{ padding: '4px 8px', fontSize: 10 }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block', marginBottom: 8 }}>
                Preview Kartu 3D Pria:
              </span>
              <div
                style={{
                  width: 160,
                  height: 220,
                  borderRadius: 20,
                  overflow: 'hidden',
                  margin: '0 auto',
                  border: '1px solid rgba(241, 193, 147, 0.4)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                  transform: 'perspective(600px) rotateY(-8deg) rotateZ(4deg)',
                }}
              >
                <img
                  src={settings?.groomPhoto}
                  alt="Preview Groom"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' }}
                />
              </div>
            </div>
          </div>

          {/* Bride Card */}
          <div className="admin-card">
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
              👰 Foto Pengantin Wanita (The Bride)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 14 }}>
              Foto ini tampil pada kartu 3D berputar di samping nama <strong>Adisty Vana Lestari</strong>.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                URL Gambar Foto Wanita
              </label>
              <input
                type="text"
                value={settings?.bridePhoto || ''}
                onChange={(e) => updateField('bridePhoto', e.target.value)}
                placeholder="https://..."
                className="admin-input"
              />
            </div>

            {/* Presets */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                Pilihan Cepat (Presets):
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PHOTO_PRESETS.bride.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => updateField('bridePhoto', p.url)}
                    className="btn-admin-outline"
                    style={{ padding: '4px 8px', fontSize: 10 }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block', marginBottom: 8 }}>
                Preview Kartu 3D Wanita:
              </span>
              <div
                style={{
                  width: 160,
                  height: 220,
                  borderRadius: 20,
                  overflow: 'hidden',
                  margin: '0 auto',
                  border: '1px solid rgba(241, 193, 147, 0.4)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                  transform: 'perspective(600px) rotateY(8deg) rotateZ(-4deg)',
                }}
              >
                <img
                  src={settings?.bridePhoto}
                  alt="Preview Bride"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GALERI MOMEN 3D SLICE */}
      {activeTab === 'moments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="admin-card">
              <h4 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 12px', fontSize: '1.15rem' }}>
                Momen 0{num} (Slide {num})
              </h4>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Judul Momen
                </label>
                <input
                  type="text"
                  value={settings?.[`moment${num}Title`] || ''}
                  onChange={(e) => updateField(`moment${num}Title`, e.target.value)}
                  className="admin-input"
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Tanggal / Babak
                </label>
                <input
                  type="text"
                  value={settings?.[`moment${num}Date`] || ''}
                  onChange={(e) => updateField(`moment${num}Date`, e.target.value)}
                  className="admin-input"
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={settings?.[`moment${num}Desc`] || ''}
                  onChange={(e) => updateField(`moment${num}Desc`, e.target.value)}
                  className="admin-input"
                  style={{ fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  URL Foto Momen
                </label>
                <input
                  type="text"
                  value={settings?.[`moment${num}Photo`] || ''}
                  onChange={(e) => updateField(`moment${num}Photo`, e.target.value)}
                  className="admin-input"
                  style={{ fontSize: 12 }}
                />
              </div>

              <div style={{ marginTop: 12, height: 110, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                  src={settings?.[`moment${num}Photo`]}
                  alt={`Moment ${num}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LATAR & NUANSA */}
      {activeTab === 'background' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Hero Background */}
          <div className="admin-card">
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
              🌟 Foto Latar Cover (Hero Section)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 14 }}>
              Foto latar belakang utama di bagian pembuka undangan (Hero).
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                URL Gambar Latar Cover
              </label>
              <input
                type="text"
                value={settings?.heroBgPhoto || ''}
                onChange={(e) => updateField('heroBgPhoto', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                Pilihan Cepat:
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PHOTO_PRESETS.heroBg.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => updateField('heroBgPhoto', p.url)}
                    className="btn-admin-outline"
                    style={{ padding: '4px 8px', fontSize: 10 }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 140, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img
                src={settings?.heroBgPhoto}
                alt="Hero Background"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Closing Background & Ambience */}
          <div className="admin-card">
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
              ✨ Foto Latar Doa &amp; Nuansa Warna
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 14 }}>
              Foto penutup pada bagian ayat suci / amplop digital serta pengaturan kegelapan latar.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                URL Gambar Latar Penutup (Closing)
              </label>
              <input
                type="text"
                value={settings?.closingBgPhoto || ''}
                onChange={(e) => updateField('closingBgPhoto', e.target.value)}
                className="admin-input"
              />
            </div>

            {/* Darkness Slider */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>
                  Tingkat Kegelapan Latar (Overlay Darkness)
                </label>
                <span style={{ fontSize: 12, color: '#F1C193', fontWeight: 600 }}>
                  {settings?.bgOverlayDarkness || 60}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={settings?.bgOverlayDarkness || 60}
                onChange={(e) => updateField('bgOverlayDarkness', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#F1C193', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                Semakin tinggi nilainya, latar foto semakin gelap dan tulisan emas semakin kontras.
              </span>
            </div>

            {/* Background Theme Nuance */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 8 }}>
                Pilihan Nuansa Warna Latar
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { id: 'midnight', label: '🌑 Midnight Onyx', desc: 'Hitam murni & elegan' },
                  { id: 'amber', label: '🍂 Royal Amber', desc: 'Gradasi coklat keemasan' },
                  { id: 'espresso', label: '☕ Dark Espresso', desc: 'Nuansa kopi gelap mewah' },
                  { id: 'velvet', label: '🍷 Deep Velvet', desc: 'Sentuhan anggun gelap' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateField('bgTheme', t.id)}
                    className="btn-admin-outline"
                    style={{
                      padding: '8px 10px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: settings?.bgTheme === t.id ? 'rgba(241, 193, 147, 0.2)' : 'rgba(0,0,0,0.3)',
                      borderColor: settings?.bgTheme === t.id ? 'var(--admin-gold)' : 'rgba(241, 193, 147, 0.2)',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>
                    <span style={{ fontSize: 9, color: 'var(--admin-muted)' }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Music Link */}
            <div>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                URL File Lagu / Musik Latar (.mp3)
              </label>
              <input
                type="text"
                value={settings?.musicUrl || ''}
                onChange={(e) => updateField('musicUrl', e.target.value)}
                placeholder="https://...mp3"
                className="admin-input"
                style={{ fontSize: 12 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 'calc(20px + env(safe-area-inset-bottom, 10px))',
          background: 'rgba(18, 13, 9, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(241, 193, 147, 0.3)',
          borderRadius: 14,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 28,
          boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--admin-muted)' }}>
          Pastikan untuk mengklik <strong>Simpan Perubahan</strong> agar perubahan aktif di undangan tamu.
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-admin"
          style={{ padding: '10px 24px' }}
        >
          {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
        </button>
      </div>
    </div>
  )
}
