'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalRsvps: 0,
    attendingYes: 0,
    attendingNo: 0,
    attendingMaybe: 0,
    totalHeadcount: 0,
  })
  const [recentRsvps, setRecentRsvps] = useState([])
  const [loading, setLoading] = useState(true)

  // Quick link generator state
  const [guestNameInput, setGuestNameInput] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch RSVPs
      const rsvpRes = await fetch('/api/rsvp')
      const rsvpData = await rsvpRes.json()
      const rsvps = rsvpData.data || []

      // Fetch Guests
      const guestRes = await fetch('/api/guests')
      const guestData = await guestRes.json()
      const guests = guestData.data || []

      let yes = 0
      let no = 0
      let maybe = 0
      let headcount = 0

      rsvps.forEach((r) => {
        if (r.attending === 'yes') {
          yes++
          headcount += r.guest_count || 1
        } else if (r.attending === 'no') {
          no++
        } else {
          maybe++
        }
      })

      setStats({
        totalGuests: guests.length,
        totalRsvps: rsvps.length,
        attendingYes: yes,
        attendingNo: no,
        attendingMaybe: maybe,
        totalHeadcount: headcount,
      })

      setRecentRsvps(rsvps.slice(0, 6))
    } catch (e) {
      console.error('Error fetching admin data:', e)
    } finally {
      setLoading(false)
    }
  }

  const generatedUrl = guestNameInput.trim()
    ? `${origin}/?to=${encodeURIComponent(guestNameInput.trim())}`
    : `${origin}/`

  const copyQuickLink = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    })
  }

  const getWhatsAppMessage = () => {
    const groom = 'Muhammad Irsyad'
    const bride = 'Adisty Vana Lestari'
    const name = guestNameInput.trim() || 'Bapak/Ibu/Saudara/i'
    const text = `Kepada Yth. ${name},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara pernikahan kami:

*${groom} & ${bride}*
Rabu, 11 November 2026
Masjid H. Muhammad Sidik Islamic Center Muara Tewah

Detail acara & konfirmasi kehadiran dapat diakses melalui tautan undangan berikut:
${generatedUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.

Terima kasih.
Salam hangat,
*Irsyad & Adisty*`
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  }

  return (
    <div>
      {/* Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#F1C193', margin: '0 0 6px' }}>
            Dashboard Pernikahan
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Ringkasan kehadiran tamu dan pesan doa untuk <strong>Muhammad Irsyad &amp; Adisty Vana Lestari</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} className="btn-admin-outline">
            🔄 Refresh Data
          </button>
          <Link href="/admin/guests" className="btn-admin">
            ➕ Tambah Tamu
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Total Tamu Diundang</span>
          <span className="stat-value">{stats.totalGuests}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>Daftar buku tamu</span>
        </div>

        <div className="stat-box" style={{ borderColor: 'rgba(129, 199, 132, 0.4)' }}>
          <span className="stat-label" style={{ color: '#81c784' }}>Tamu Hadir (Yes)</span>
          <span className="stat-value" style={{ color: '#81c784' }}>{stats.attendingYes}</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(129, 199, 132, 0.8)' }}>
            Total Estimasi: <strong>{stats.totalHeadcount} porsi/tamu</strong>
          </span>
        </div>

        <div className="stat-box" style={{ borderColor: 'rgba(229, 115, 115, 0.4)' }}>
          <span className="stat-label" style={{ color: '#e57373' }}>Berhalangan (No)</span>
          <span className="stat-value" style={{ color: '#e57373' }}>{stats.attendingNo}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>Mengirimkan doa</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">Total Respon RSVP</span>
          <span className="stat-value">{stats.totalRsvps}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>
            Ragu-ragu: {stats.attendingMaybe}
          </span>
        </div>
      </div>

      {/* Quick Invitation Generator */}
      <div className="admin-card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.25rem', margin: '0 0 8px' }}>
          ⚡ Generator Link Undangan Cepat (WhatsApp)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginBottom: 20 }}>
          Ketik nama tamu di bawah untuk membuat tautan khusus yang langsung menyapa nama mereka saat membuka undangan.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
              Nama Tamu / Keluarga
            </label>
            <input
              type="text"
              value={guestNameInput}
              onChange={(e) => setGuestNameInput(e.target.value)}
              placeholder="Contoh: Bpk. H. Rahmat & Keluarga"
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
              Link Siap Dibagikan
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="admin-input"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#F1C193' }}
              />
              <button onClick={copyQuickLink} className="btn-admin-outline" style={{ flexShrink: 0 }}>
                {copiedLink ? '✓ Disalin' : '📋 Salin'}
              </button>
            </div>
          </div>
        </div>

        {guestNameInput.trim() && (
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={getWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-admin"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff' }}
            >
              💬 Kirim via WhatsApp
            </a>
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-admin-outline"
            >
              👁️ Buka Preview Tamu Ini ↗
            </a>
          </div>
        )}
      </div>

      {/* Recent RSVPs Table */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.25rem', margin: 0 }}>
            Konfirmasi RSVP Terbaru
          </h3>
          <Link href="/admin/rsvp" className="btn-admin-outline" style={{ fontSize: 12 }}>
            Lihat Semua ({stats.totalRsvps}) →
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: 30 }}>Memuat data terbaru...</p>
        ) : recentRsvps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-muted)' }}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>📭</p>
            <p style={{ margin: 0 }}>Belum ada konfirmasi RSVP yang masuk ke Supabase.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Tamu dapat mengisi form RSVP di website undangan.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Tamu</th>
                  <th>Kehadiran</th>
                  <th>Jumlah</th>
                  <th>Doa &amp; Pesan</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentRsvps.map((rsvp) => (
                  <tr key={rsvp.id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{rsvp.name}</td>
                    <td>
                      {rsvp.attending === 'yes' && <span className="badge badge-success">✓ Hadir</span>}
                      {rsvp.attending === 'no' && <span className="badge badge-danger">✕ Berhalangan</span>}
                      {rsvp.attending === 'maybe' && <span className="badge badge-warning">? Ragu-ragu</span>}
                    </td>
                    <td>{rsvp.attending === 'yes' ? `${rsvp.guest_count || 1} orang` : '-'}</td>
                    <td style={{ maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rsvp.wishes || rsvp.message || <span style={{ color: 'rgba(255,255,255,0.3)' }}>-</span>}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--admin-muted)' }}>
                      {rsvp.created_at ? new Date(rsvp.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
