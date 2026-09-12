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
    { label: 'Floral Royal Arch', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop' },
  ],
  groomBg: [
    { label: 'Groom Classic Dark', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Groom Warm Lighting', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Groom Elegant Tuxedo', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop' },
  ],
  brideBg: [
    { label: 'Bride Warm Veil', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Bride Golden Hour', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Bride White Lace', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop' },
  ],
  coupleBg: [
    { label: 'Romantic Silhouette', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Candlelight Shadows', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Golden Hour Embrace', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop' },
  ],
  loveStoryBg: [
    { label: 'Holding Hands Walk', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Sunset Forest Trail', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Warm Evening Whisper', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
  ],
  eventsBg: [
    { label: 'Cathedral / Hall Arch', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Evening Candle Altar', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Starry Mosque / Venue', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop' },
  ],
  countdownBg: [
    { label: 'Starry Venue Lights', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Warm Bokeh Lamps', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Golden Sunset Aura', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1600&auto=format&fit=crop' },
  ],
  galleryBg: [
    { label: 'Canopy Fairy Lights', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Moody Night Glow', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Golden Amber Bokeh', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop' },
  ],
  rsvpBg: [
    { label: 'Sparkler Celebration', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Intimate Dinner Lights', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Warm Party Ambience', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
  ],
  closingBg: [
    { label: 'Luxury Lanterns Night', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Sparkler Celebration', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Gentle Candle Prayer', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop' },
  ],
  galleryMoment: [
    { label: 'Cincin & Bunga', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop' },
    { label: 'Genggam Tangan', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop' },
    { label: 'Pelukan Sunset', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' },
    { label: 'Lentera Malam', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
    { label: 'Senyum Bahagia', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop' },
    { label: 'Akad Khidmat', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' },
  ],
}

const SCROLL_SEGMENTS = [
  {
    key: 'heroBgPhoto',
    num: '01',
    badge: 'SEGMEN 01 • COVER & HERO',
    title: 'Cover / Pembuka Undangan',
    desc: 'Latar belakang utama saat tamu pertama kali membuka undangan digital.',
    presetKey: 'heroBg',
    defaultUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'groomBgPhoto',
    num: '02',
    badge: 'SEGMEN 02 • THE GROOM',
    title: 'Adegan Mempelai Pria (The Groom)',
    desc: 'Latar belakang layar penuh adegan mempelai pria & kartu 3D berputar.',
    presetKey: 'groomBg',
    defaultUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'brideBgPhoto',
    num: '03',
    badge: 'SEGMEN 03 • THE BRIDE',
    title: 'Adegan Mempelai Wanita (The Bride)',
    desc: 'Latar belakang layar penuh adegan mempelai wanita & kartu 3D berputar.',
    presetKey: 'brideBg',
    defaultUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'loveStoryBgPhoto',
    num: '04',
    badge: 'SEGMEN 04 • OUR JOURNEY',
    title: 'Kisah Cinta (Love Story)',
    desc: 'Latar belakang layar penuh di balik linimasa cerita cinta pengantin.',
    presetKey: 'loveStoryBg',
    defaultUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'eventsBgPhoto',
    num: '05',
    badge: 'SEGMEN 05 • SAVE THE DATE',
    title: 'Waktu & Lokasi (Akad & Resepsi)',
    desc: 'Latar belakang di balik kartu jadwal acara dan petunjuk Google Maps.',
    presetKey: 'eventsBg',
    defaultUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'countdownBgPhoto',
    num: '06',
    badge: 'SEGMEN 06 • COUNTDOWN',
    title: 'Hitung Mundur Waktu & Doa',
    desc: 'Latar belakang di balik jam hitung mundur dan kutipan ayat suci QS Ar-Rum.',
    presetKey: 'countdownBg',
    defaultUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'galleryBgPhoto',
    num: '07',
    badge: 'SEGMEN 07 • OUR MOMENTS',
    title: 'Galeri Momen 3D Perspective Slice',
    desc: 'Latar belakang sinematik di balik carousel foto 3D slice berputar.',
    presetKey: 'galleryBg',
    defaultUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'rsvpBgPhoto',
    num: '08',
    badge: 'SEGMEN 08 • RSVP & WISHES',
    title: 'Konfirmasi Kehadiran & Doa Tamu',
    desc: 'Latar belakang di balik form kehadiran dan kartu daftar ucapan tamu.',
    presetKey: 'rsvpBg',
    defaultUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'closingBgPhoto',
    num: '09',
    badge: 'SEGMEN 09 • DIGITAL GIFT & CLOSING',
    title: 'Penutup, Doa Restu & Amplop Digital',
    desc: 'Latar belakang penutup di balik tanda kasih amplop digital dan ucapan terima kasih.',
    presetKey: 'closingBg',
    defaultUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  },
]

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
      const res = await fetch('/api/settings?t=' + Date.now(), { cache: 'no-store' })
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
        if (json.data) setSettings(json.data)
        setToast('✓ Pengaturan foto dan latar berhasil disimpan ke cloud database!')
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

  const getMoments = () => {
    if (Array.isArray(settings?.galleryMoments) && settings.galleryMoments.length > 0) {
      return settings.galleryMoments
    }
    return [
      {
        id: 1,
        photo: settings?.moment1Photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment1Title || 'Pertama Bertemu',
        date: settings?.moment1Date || 'November 2020',
        desc: settings?.moment1Desc || 'Sebuah perjumpaan tak terduga di Muara Teweh yang menjadi awal mula lembaran kisah kasih kami.',
      },
      {
        id: 2,
        photo: settings?.moment2Photo || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment2Title || 'Merajut Janji',
        date: settings?.moment2Date || 'Agustus 2022',
        desc: settings?.moment2Desc || 'Melangkah bersama melewati ragam cerita, bertumbuh dalam cinta, saling menjaga dan menguatkan.',
      },
      {
        id: 3,
        photo: settings?.moment3Photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment3Title || 'Restu Keluarga',
        date: settings?.moment3Date || 'Mei 2024',
        desc: settings?.moment3Desc || 'Dua keluarga besar bersatu dalam doa dan restu yang tulus menyongsong mahligai suci.',
      },
      {
        id: 4,
        photo: settings?.moment4Photo || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment4Title || 'Hari Bahagia',
        date: settings?.moment4Date || '11 November 2026',
        desc: 'Masjid H. Muhammad Sidik Islamic Center Muara Teweh, mengikat janji suci seumur hidup.',
      },
    ]
  }

  const updateMoment = (index, field, value) => {
    const list = [...getMoments()]
    list[index] = { ...list[index], [field]: value }
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
  }

  const addMomentSlot = () => {
    const list = [...getMoments()]
    const nextNum = list.length + 1
    list.push({
      id: Date.now(),
      photo: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
      title: `Kenangan 0${nextNum}`,
      date: '2026',
      desc: 'Momen berharga dalam perjalanan cinta kami.',
    })
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
  }

  const removeMomentSlot = (index) => {
    const list = [...getMoments()]
    if (list.length <= 1) {
      alert('Minimal harus ada 1 foto di dalam galeri!')
      return
    }
    list.splice(index, 1)
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
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
          🎞️ Galeri Foto &amp; Momen (Stack 3D)
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

      {/* TAB 2: GALERI FOTO & MOMEN (STACK 3D) */}
      {activeTab === 'moments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top Control Panel: Stack Behavior & Add Button */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 6px', fontSize: '1.25rem' }}>
                  🎞️ Galeri Tumpukan Kartu 3D (React Bits Stack)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Total <strong>{getMoments().length} Slot Foto</strong> terpasang. Tamu dapat menggeser/men-drag kartu, mengklik, atau membiarkannya berputar otomatis.
                </p>
              </div>

              <button
                onClick={addMomentSlot}
                className="btn-admin"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px' }}
              >
                <span>➕</span>
                <span>Tambah Slot Gambar Baru</span>
              </button>
            </div>

            {/* Stack Behavior Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Autoplay toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings?.galleryAutoplay ?? true}
                  onChange={(e) => updateField('galleryAutoplay', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#F1C193' }}
                />
                <span style={{ fontSize: 13, color: '#fff' }}>Autoplay Kartu (Otomatis Berpindah)</span>
              </label>

              {/* Autoplay Delay */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--admin-muted)' }}>Durasi Transisi:</span>
                  <span style={{ fontSize: 12, color: '#F1C193', fontWeight: 600 }}>
                    {((settings?.galleryAutoplayDelay || 3500) / 1000).toFixed(1)} detik
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={8000}
                  step={500}
                  value={settings?.galleryAutoplayDelay || 3500}
                  onChange={(e) => updateField('galleryAutoplayDelay', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#F1C193' }}
                />
              </div>

              {/* Random Rotation toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings?.galleryRandomRotation ?? true}
                  onChange={(e) => updateField('galleryRandomRotation', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#F1C193' }}
                />
                <span style={{ fontSize: 13, color: '#fff' }}>Acak Kemiringan (Messy 3D Stack)</span>
              </label>
            </div>
          </div>

          {/* Grid of Dynamic Moment Slots */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {getMoments().map((moment, idx) => (
              <div key={moment.id || idx} className="admin-card" style={{ position: 'relative' }}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.1rem', fontWeight: 600 }}>
                    Foto #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => removeMomentSlot(idx)}
                    className="btn-admin-outline"
                    style={{
                      padding: '4px 10px',
                      fontSize: 11,
                      borderColor: 'rgba(239, 83, 80, 0.4)',
                      color: '#ef5350',
                    }}
                    title="Hapus slot foto ini"
                  >
                    🗑️ Hapus
                  </button>
                </div>

                {/* Photo URL */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    URL Gambar Foto
                  </label>
                  <input
                    type="text"
                    value={moment.photo || ''}
                    onChange={(e) => updateMoment(idx, 'photo', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="admin-input"
                    style={{ fontSize: 12 }}
                  />
                </div>

                {/* Preset Buttons */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Pilihan Foto Preset:
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {PHOTO_PRESETS.galleryMoment.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => updateMoment(idx, 'photo', preset.url)}
                        className="btn-admin-outline"
                        style={{ padding: '3px 7px', fontSize: 10 }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div
                  style={{
                    height: 150,
                    borderRadius: 14,
                    overflow: 'hidden',
                    marginBottom: 14,
                    border: '1px solid rgba(241, 193, 147, 0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    background: '#0d0906',
                  }}
                >
                  <img
                    src={moment.photo}
                    alt={moment.title || `Foto ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
                    }}
                  />
                </div>

                {/* Title */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Judul Momen / Teks Badge
                  </label>
                  <input
                    type="text"
                    value={moment.title || ''}
                    onChange={(e) => updateMoment(idx, 'title', e.target.value)}
                    placeholder="Contoh: Merajut Janji"
                    className="admin-input"
                  />
                </div>

                {/* Date */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Tanggal / Fase
                  </label>
                  <input
                    type="text"
                    value={moment.date || ''}
                    onChange={(e) => updateMoment(idx, 'date', e.target.value)}
                    placeholder="Contoh: Agustus 2022"
                    className="admin-input"
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Deskripsi Singkat Kisah
                  </label>
                  <textarea
                    rows={2}
                    value={moment.desc || ''}
                    onChange={(e) => updateMoment(idx, 'desc', e.target.value)}
                    placeholder="Ceritakan sekelumit momen ini..."
                    className="admin-input"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Big Add Slot Button at Bottom */}
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <button
              onClick={addMomentSlot}
              className="btn-admin-outline"
              style={{
                padding: '12px 28px',
                fontSize: 14,
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
                background: 'rgba(241, 193, 147, 0.08)',
              }}
            >
              ➕ Tambah Slot Gambar Lainnya
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FOTO LATAR 8 SEGMEN & TEMA */}
      {activeTab === 'background' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Global Ambience & Theme Card */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
              ✨ Pengaturan Nuansa Warna &amp; Musik Latar
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginBottom: 20 }}>
              Pengaturan global ini berlaku untuk seluruh segmen: mengatur tingkat kegelapan vignette foto agar teks tetap kontras, gradasi tema warna, dan backsound musik otomatis.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {/* Darkness Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', fontWeight: 600 }}>
                    Tingkat Kegelapan Latar (Overlay Darkness)
                  </label>
                  <span style={{ fontSize: 13, color: '#F1C193', fontWeight: 700 }}>
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
                  style={{ width: '100%', accentColor: '#F1C193', cursor: 'pointer', height: 6 }}
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6, lineHeight: 1.4 }}>
                  Semakin tinggi nilainya, foto latar semakin gelap sehingga tulisan emas dan konten tetap kontras dan nyaman dibaca.
                </p>
              </div>

              {/* Background Music Link */}
              <div>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  URL File Musik / Lagu Latar (.mp3)
                </label>
                <input
                  type="text"
                  value={settings?.musicUrl || ''}
                  onChange={(e) => updateField('musicUrl', e.target.value)}
                  placeholder="https://...mp3"
                  className="admin-input"
                  style={{ fontSize: 13 }}
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                  Musik akan otomatis diputar lembut saat tamu mengklik tombol "Buka Undangan".
                </p>
              </div>
            </div>

            {/* Background Theme Nuance */}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 10, fontWeight: 600 }}>
                Pilihan Gradasi Warna Tema Latar (Radial Tint)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
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
                      padding: '10px 12px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: settings?.bgTheme === t.id ? 'rgba(241, 193, 147, 0.22)' : 'rgba(0,0,0,0.35)',
                      borderColor: settings?.bgTheme === t.id ? 'var(--admin-gold)' : 'rgba(241, 193, 147, 0.2)',
                      boxShadow: settings?.bgTheme === t.id ? '0 0 12px rgba(241, 193, 147, 0.2)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: settings?.bgTheme === t.id ? '#F1C193' : '#fff' }}>{t.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--admin-muted)', marginTop: 2 }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8-Segment Header */}
          <div style={{ marginTop: 8, padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🖼️</span>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#F1C193', margin: 0 }}>
                Foto Latar Penuh Per Segmen Skrol (8 Segmen)
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
              Setiap segmen skrol halaman undangan dapat dikustomisasi dengan foto latar resolusi penuh (full-bleed) secara independen.
            </p>
          </div>

          {/* 8 Scroll Segments Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {SCROLL_SEGMENTS.map((seg) => {
              const currentPhoto = settings?.[seg.key] || seg.defaultUrl
              const presets = PHOTO_PRESETS[seg.presetKey] || []

              return (
                <div key={seg.key} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Badge & Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.12em',
                          color: '#F1C193',
                          background: 'rgba(241, 193, 147, 0.12)',
                          border: '1px solid rgba(241, 193, 147, 0.3)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        {seg.badge}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--admin-muted)' }}>
                        Segmen {seg.num}
                      </span>
                    </div>

                    <h4 style={{ fontFamily: '"Playfair Display", serif', color: '#fff', margin: '0 0 4px', fontSize: '1.15rem' }}>
                      {seg.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 14, minHeight: 34 }}>
                      {seg.desc}
                    </p>

                    {/* URL Input */}
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                        URL Foto Latar Segmen
                      </label>
                      <input
                        type="text"
                        value={settings?.[seg.key] || ''}
                        onChange={(e) => updateField(seg.key, e.target.value)}
                        placeholder={seg.defaultUrl}
                        className="admin-input"
                        style={{ fontSize: 12 }}
                      />
                    </div>

                    {/* Presets */}
                    {presets.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                          Pilihan Cepat (Presets):
                        </span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {presets.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => updateField(seg.key, p.url)}
                              className="btn-admin-outline"
                              style={{ padding: '4px 8px', fontSize: 10 }}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div style={{ marginTop: 8 }}>
                    <div
                      style={{
                        height: 150,
                        borderRadius: 12,
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid rgba(241, 193, 147, 0.25)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        background: '#0a0502',
                      }}
                    >
                      <img
                        src={currentPhoto}
                        alt={`Preview ${seg.title}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = seg.defaultUrl
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          left: 10,
                          right: 10,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <span style={{ fontSize: 10, color: '#F1C193', letterSpacing: '0.08em', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                          {seg.title}
                        </span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                          100% Full-bleed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
