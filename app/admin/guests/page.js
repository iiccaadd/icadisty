'use client'

import { useState, useEffect } from 'react'

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [origin, setOrigin] = useState('')

  // Single add form
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Bulk add modal/toggle
  const [showBulk, setShowBulk] = useState(false)
  const [bulkText, setBulkText] = useState('')

  // Copied indicator
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    loadGuests()
  }, [])

  const loadGuests = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/guests')
      const json = await res.json()
      setGuests(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSingle = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, phone: newPhone }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setNewName('')
        setNewPhone('')
        loadGuests()
      } else {
        alert(json.error || 'Gagal menambahkan tamu')
      }
    } catch (e) {
      alert('Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkText.trim()) return
    const names = bulkText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (names.length === 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkNames: names }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setBulkText('')
        setShowBulk(false)
        loadGuests()
      } else {
        alert(json.error || 'Gagal menambahkan tamu bulk')
      }
    } catch (e) {
      alert('Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus tamu ini dari daftar?')) return
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setGuests(guests.filter((g) => g.id !== id))
      }
    } catch (e) {
      alert('Gagal menghapus')
    }
  }

  const getGuestUrl = (guest) => {
    return `${origin}/?to=${encodeURIComponent(guest.name)}`
  }

  const copyGuestLink = (guest) => {
    const url = getGuestUrl(guest)
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(guest.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const getWhatsAppLink = (guest) => {
    const groom = 'Muhammad Irsyad'
    const bride = 'Adisty Vana Lestari'
    const url = getGuestUrl(guest)
    const phone = guest.phone ? guest.phone.replace(/^0/, '62').replace(/\D/g, '') : ''

    const message = `Kepada Yth.
*${guest.name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara resepsi pernikahan kami:

*${groom} & ${bride}*
📅 Rabu, 11 November 2026
📍 Masjid H. Muhammad Sidik Islamic Center Muara Tewah

Detail acara, peta lokasi & konfirmasi kehadiran (RSVP) dapat dilihat melalui link undangan berikut:
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.

Terima kasih.
Salam hangat,
*Irsyad & Adisty*`

    if (phone) {
      return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
  }

  const filtered = guests.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.phone?.includes(search)
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#F1C193', margin: '0 0 4px' }}>
            Manajemen Buku Tamu Undangan
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Kelola daftar nama tamu undangan, generate link personal, dan bagikan undangan langsung via WhatsApp
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowBulk(!showBulk)} className="btn-admin-outline">
            📋 {showBulk ? 'Tutup Tambah Massal' : 'Tambah Tamu Massal'}
          </button>
          <button onClick={loadGuests} className="btn-admin-outline">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Bulk Add Form */}
      {showBulk && (
        <div className="admin-card" style={{ marginBottom: 24, borderColor: 'var(--admin-gold)' }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.2rem', margin: '0 0 8px' }}>
            Tambah Banyak Tamu Sekaligus (Bulk Import)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 12 }}>
            Ketik atau paste daftar nama tamu (1 nama per baris). Cocok dicopy langsung dari Excel atau Google Sheets.
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={6}
            placeholder={`Bpk. H. Ahmad & Istri\nIbu Siti Fatimah\nDr. Hendra Wijaya\nTeman-teman Divisi IT`}
            className="admin-input"
            style={{ fontFamily: 'monospace', fontSize: 13, marginBottom: 14 }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleBulkAdd}
              disabled={submitting}
              className="btn-admin"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Semua Tamu'}
            </button>
            <button onClick={() => setShowBulk(false)} className="btn-admin-outline">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Add Single Guest Form */}
      <div className="admin-card" style={{ marginBottom: 24, padding: '20px' }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.15rem', margin: '0 0 14px' }}>
          ➕ Tambah Tamu Baru
        </h3>
        <form onSubmit={handleAddSingle} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
              Nama Tamu *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Contoh: Bpk. Irwan & Keluarga"
              required
              className="admin-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
              No. WhatsApp (Opsional)
            </label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="admin-input"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-admin"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Menyimpan...' : 'Tambah ke Buku Tamu'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--admin-muted)' }}>
            Menampilkan: <strong>{filtered.length}</strong> dari <strong>{guests.length}</strong> tamu
          </span>
          <div style={{ minWidth: 260 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Cari nama tamu..."
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: 40 }}>Memuat data tamu...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-muted)' }}>
            <p style={{ fontSize: 32 }}>👥</p>
            <p>Belum ada tamu yang terdaftar di buku tamu.</p>
            <p style={{ fontSize: 12 }}>Gunakan form di atas untuk menambahkan tamu pertama.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Tamu</th>
                  <th>No WhatsApp</th>
                  <th>Status Dibuka</th>
                  <th>Link Undangan</th>
                  <th style={{ textAlign: 'center' }}>Aksi Kirim</th>
                  <th style={{ textAlign: 'center' }}>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest, idx) => (
                  <tr key={guest.id}>
                    <td style={{ color: 'var(--admin-muted)', fontSize: 12 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{guest.name}</td>
                    <td>
                      {guest.phone ? (
                        <span style={{ color: '#81c784' }}>📱 {guest.phone}</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>-</span>
                      )}
                    </td>
                    <td>
                      {guest.has_opened ? (
                        <span className="badge badge-success">✓ Sudah Dibuka</span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                          Belum Dibuka
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => copyGuestLink(guest)}
                          className="btn-admin-outline"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                        >
                          {copiedId === guest.id ? '✓ Disalin' : '📋 Salin Link'}
                        </button>
                        <a
                          href={getGuestUrl(guest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--admin-gold)', fontSize: 11, textDecoration: 'none' }}
                          title="Buka Undangan Tamu Ini"
                        >
                          ↗ Preview
                        </a>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={getWhatsAppLink(guest)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#25D366',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        💬 Share WA
                      </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        style={{
                          background: 'rgba(211, 47, 47, 0.15)',
                          color: '#e57373',
                          border: '1px solid rgba(211, 47, 47, 0.3)',
                          borderRadius: 6,
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: 11,
                        }}
                        title="Hapus Tamu"
                      >
                        🗑️
                      </button>
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
