'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import SectionBackground from './SectionBackground'

export default function RSVPSection({ id, guestName, settings }) {
  const bgPhoto = settings?.rsvpBgPhoto || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop'
  const [form, setForm] = useState({
    name: guestName || '',
    phone: '',
    attending: 'yes',
    guest_count: 1,
    message: '',
    wishes: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [wishes, setWishes] = useState([])

  useEffect(() => {
    if (guestName) setForm(f => ({ ...f, name: guestName }))
  }, [guestName])

  useEffect(() => {
    // Load recent wishes
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('rsvp')
        .select('name, wishes, created_at')
        .not('wishes', 'is', null)
        .neq('wishes', '')
        .order('created_at', { ascending: false })
        .limit(5)
      if (data) setWishes(data)
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      let success = false

      // 1. Try Supabase client directly
      try {
        const supabase = createClient()
        const { error } = await supabase.from('rsvp').insert([{
          name: form.name,
          phone: form.phone,
          attending: form.attending,
          guest_count: parseInt(form.guest_count),
          message: form.message,
          wishes: form.wishes,
        }])
        if (!error) success = true
      } catch (clientErr) {
        console.warn('Direct supabase client warning, falling back to API:', clientErr)
      }

      // 2. If direct client didn't succeed, fallback to server API endpoint
      if (!success) {
        const res = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Gagal mengirim RSVP')
      }

      setStatus('success')

      // Reload wishes
      try {
        const wishRes = await fetch('/api/rsvp?wishes=true&limit=5')
        const wishJson = await wishRes.json()
        if (wishJson.data) setWishes(wishJson.data)
      } catch (e) {}
    } catch (err) {
      console.error('RSVP error:', err)
      setStatus('error')
    }
  }

  return (
    <section id={id} className="section" style={{ background: '#000', overflowY: 'auto' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.72}
        position="center"
      />

      {/* Ghost Background Typography */}
      <span
        className="ghost-text"
        style={{
          top: '18%',
          right: '-15px',
          fontSize: 'clamp(4rem, 14vw, 8rem)',
          opacity: 0.12,
        }}
      >
        RSVP
      </span>

      <div
        className="section-content"
        style={{
          justifyContent: 'flex-end',
          padding: '0 28px 40px',
          gap: 0,
          overflowY: 'auto',
          maxHeight: '100%',
        }}
      >
        <p className="label-gold" style={{ fontSize: 11, letterSpacing: '0.25em', marginBottom: 4 }}>✦ Konfirmasi Kehadiran ✦</p>
        <h2 className="section-heading" style={{ marginBottom: 20, textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>RSVP & Wishes</h2>

        {status === 'success' ? (
          <div style={{
            background: 'rgba(241,193,147,0.1)',
            border: '1px solid rgba(241,193,147,0.3)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 28 }}>🎊</p>
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 20,
              color: '#F1C193',
              marginBottom: 4,
            }}>Terima Kasih!</p>
            <p className="body-text" style={{ fontSize: 14 }}>
              Konfirmasi kehadiran Anda sudah kami terima.
            </p>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <div>
              <label className="rsvp-label">Nama Lengkap *</label>
              <input
                className="rsvp-input"
                type="text"
                required
                placeholder="Masukkan nama Anda"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="rsvp-label">No. WhatsApp</label>
              <input
                className="rsvp-input"
                type="tel"
                placeholder="+62..."
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="rsvp-label">Konfirmasi Kehadiran *</label>
              <div className="rsvp-radio-group">
                {[
                  { value: 'yes', label: '✓ Hadir' },
                  { value: 'maybe', label: '? Mungkin' },
                  { value: 'no', label: '✕ Tidak' },
                ].map(opt => (
                  <div key={opt.value} className="rsvp-radio-option">
                    <input
                      type="radio"
                      id={`attending-${opt.value}`}
                      name="attending"
                      value={opt.value}
                      checked={form.attending === opt.value}
                      onChange={e => setForm({ ...form, attending: e.target.value })}
                    />
                    <label htmlFor={`attending-${opt.value}`}>{opt.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {form.attending === 'yes' && (
              <div>
                <label className="rsvp-label">Jumlah Tamu</label>
                <input
                  className="rsvp-input"
                  type="number"
                  min="1"
                  max="10"
                  value={form.guest_count}
                  onChange={e => setForm({ ...form, guest_count: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="rsvp-label">Ucapan & Doa 💌</label>
              <textarea
                className="rsvp-textarea"
                placeholder="Tulis ucapan untuk pengantin..."
                value={form.wishes}
                onChange={e => setForm({ ...form, wishes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="rsvp-submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? '⏳ Mengirim...' : '💌 Kirim Konfirmasi'}
            </button>
          </form>
        )}

        {/* Wishes List */}
        {wishes.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <p className="label-gold" style={{ fontSize: 12, marginBottom: 12 }}>
              💬 Ucapan Tamu
            </p>
            <div className="wishes-list">
              {wishes.map((w, i) => (
                <div key={i} className="wish-item">
                  <p className="wish-name">{w.name}</p>
                  <p className="wish-message">{w.wishes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
