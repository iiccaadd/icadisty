'use client'

import { useState, useEffect } from 'react'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'
import { fillWaMessage } from '@/lib/format'

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

  // WhatsApp message: saved template + the message being edited for one guest before sending
  const [waTemplate, setWaTemplate] = useState(DEFAULT_SETTINGS.waMessageTemplate)
  const [templateStatus, setTemplateStatus] = useState('')
  const [composer, setComposer] = useState(null) // { guest, text }

  // 'admin' or 'family' (shared guest-list link); familyLink is only sent to the admin
  const [role, setRole] = useState(null)
  const [familyLink, setFamilyLink] = useState('')
  const [familyCopied, setFamilyCopied] = useState(false)
  const isAdminRole = role === 'admin'

  useEffect(() => {
    setOrigin(window.location.origin)
    loadGuests()
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((json) => { setRole(json.role); setFamilyLink(json.familyLink || '') })
      .catch(() => {})
    fetch('/api/settings?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => { if (json.data?.waMessageTemplate) setWaTemplate(json.data.waMessageTemplate) })
      .catch(() => {})
  }, [])

  const saveTemplate = async () => {
    setTemplateStatus('saving')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { waMessageTemplate: waTemplate } }),
      })
      if (!res.ok) throw new Error()
      setTemplateStatus('saved')
      setTimeout(() => setTemplateStatus(''), 2500)
    } catch (e) {
      setTemplateStatus('')
      alert('Gagal menyimpan template pesan')
    }
  }

  const openComposer = (guest) => {
    setComposer({ guest, text: fillWaMessage(waTemplate, guest.name, getGuestUrl(guest)) })
  }

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
    if (guest?.slug) {
      return `${origin}/?to=${encodeURIComponent(guest.name)}&u=${encodeURIComponent(guest.slug)}`
    }
    return `${origin}/?to=${encodeURIComponent(guest.name)}`
  }

  const toggleGuestStatus = async (guest) => {
    const newStatus = !guest.has_opened
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guest.id
          ? { ...g, has_opened: newStatus, opened_at: newStatus ? new Date().toISOString() : null }
          : g
      )
    )
    try {
      await fetch('/api/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: guest.id, has_opened: newStatus }),
      })
    } catch (e) {
      console.error('Error toggling guest status:', e)
    }
  }

  const copyGuestLink = (guest) => {
    const url = getGuestUrl(guest)
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(guest.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const getWhatsAppLink = (guest, message) => {
    const phone = guest.phone ? guest.phone.replace(/^0/, '62').replace(/\D/g, '') : ''

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

      {/* Shareable family link (admin only) */}
      {isAdminRole && familyLink && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.2rem', margin: '0 0 4px' }}>
            👪 Link Keluarga (Isi Daftar Tamu)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', margin: '0 0 12px' }}>
            Bagikan link ini ke keluarga. Mereka bisa menambah tamu, menyalin link &amp; kirim WA, tanpa akses ke pengaturan, RSVP, isi pesan, atau hapus tamu.
            Link hanya bisa dicabut dengan mengganti kata sandi admin.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input readOnly value={familyLink} aria-label="Link keluarga" className="admin-input" style={{ flex: '1 1 260px' }} onFocus={(e) => e.target.select()} />
            <button
              type="button"
              className="btn-admin"
              onClick={() => navigator.clipboard.writeText(familyLink).then(() => { setFamilyCopied(true); setTimeout(() => setFamilyCopied(false), 2000) })}
            >
              {familyCopied ? '✓ Disalin' : '📋 Salin Link Keluarga'}
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp message template (admin only) */}
      {isAdminRole && (
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.2rem', margin: '0 0 4px' }}>
          ✉️ Isi Pesan Undangan WhatsApp
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', margin: '0 0 12px' }}>
          Teks ini dipakai saat menekan <strong>Share WA</strong>. <code>{'{nama}'}</code> otomatis diganti nama tamu dan <code>{'{link}'}</code> diganti link undangannya.
          Gunakan <code>*teks*</code> untuk huruf tebal di WhatsApp.
        </p>
        <textarea
          aria-label="Template pesan WhatsApp"
          value={waTemplate}
          onChange={(e) => setWaTemplate(e.target.value)}
          className="admin-input"
          rows={14}
          style={{ width: '100%', fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" onClick={saveTemplate} className="btn-admin" disabled={templateStatus === 'saving'}>
            {templateStatus === 'saving' ? 'Menyimpan...' : '💾 Simpan Template'}
          </button>
          <button
            type="button"
            onClick={() => confirm('Kembalikan teks pesan ke bawaan?') && setWaTemplate(DEFAULT_SETTINGS.waMessageTemplate)}
            className="btn-admin-outline"
          >
            Kembalikan Bawaan
          </button>
          {templateStatus === 'saved' && <span style={{ color: '#81c784', fontSize: 12 }}>✓ Template tersimpan</span>}
        </div>
      </div>
      )}

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
          <>
            {/* Desktop Table View */}
            <div className="admin-table-container" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Tamu</th>
                    <th>No WhatsApp</th>
                    <th>Status Dibuka</th>
                    <th>Link Undangan</th>
                    <th style={{ textAlign: 'center' }}>Aksi Kirim</th>
                    {isAdminRole && <th style={{ textAlign: 'center' }}>Hapus</th>}
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
                        <button
                          onClick={() => isAdminRole && toggleGuestStatus(guest)}
                          disabled={!isAdminRole}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title={
                            guest.has_opened
                              ? `Dibuka: ${guest.opened_at ? new Date(guest.opened_at).toLocaleString('id-ID') : 'Sudah'} (Klik untuk ubah ke Belum Dibuka)`
                              : 'Klik untuk ubah ke Sudah Dibuka secara manual'
                          }
                        >
                          {guest.has_opened ? (
                            <span className="badge badge-success" style={{ cursor: 'pointer' }}>
                              ✓ Sudah Dibuka
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.6)',
                                cursor: 'pointer',
                              }}
                            >
                              Belum Dibuka
                            </span>
                          )}
                        </button>
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
                        <button
                          type="button"
                          onClick={() => openComposer(guest)}
                          style={{
                            border: 'none',
                            cursor: 'pointer',
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
                        </button>
                      </td>
                      {isAdminRole && <td style={{ textAlign: 'center' }}>
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
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="admin-cards-container">
              {filtered.map((guest, idx) => (
                <div key={guest.id} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block' }}>#{idx + 1}</span>
                      <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{guest.name}</strong>
                      {guest.phone && (
                        <span style={{ fontSize: 12, color: '#81c784', display: 'block', marginTop: 2 }}>
                          📱 {guest.phone}
                        </span>
                      )}
                    </div>
                    <div>
                      {guest.has_opened ? (
                        <span className="badge badge-success">✓ Dibuka</span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                          Belum
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => openComposer(guest)}
                      className="btn-admin"
                      style={{
                        background: 'linear-gradient(135deg, #25D366, #128C7E)',
                        color: '#fff',
                        justifyContent: 'center',
                        fontSize: 12,
                        padding: '10px',
                      }}
                    >
                      💬 Kirim WA
                    </button>

                    <button
                      onClick={() => copyGuestLink(guest)}
                      className="btn-admin-outline"
                      style={{ justifyContent: 'center', fontSize: 12, padding: '10px' }}
                    >
                      {copiedId === guest.id ? '✓ Disalin' : '📋 Salin Link'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <a
                      href={getGuestUrl(guest)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--admin-gold)', fontSize: 12, textDecoration: 'none' }}
                    >
                      👁️ Preview Undangan Tamu ↗
                    </a>
                    {isAdminRole && <button
                      onClick={() => handleDelete(guest.id)}
                      style={{
                        background: 'rgba(211, 47, 47, 0.15)',
                        color: '#e57373',
                        border: '1px solid rgba(211, 47, 47, 0.3)',
                        borderRadius: 6,
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontSize: 11,
                      }}
                    >
                      🗑️ Hapus
                    </button>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit message for one guest, then send */}
      {composer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pesan WhatsApp untuk ${composer.guest.name}`}
          onClick={(e) => e.target === e.currentTarget && setComposer(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div className="admin-card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', margin: 0 }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.2rem', margin: '0 0 4px' }}>
              Kirim ke {composer.guest.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', margin: '0 0 12px' }}>
              {composer.guest.phone ? `WhatsApp: ${composer.guest.phone}` : 'Tanpa nomor: pilih kontak tujuan di WhatsApp.'} Pesan di bawah bisa diedit khusus untuk tamu ini.
            </p>
            <textarea
              aria-label="Pesan untuk tamu ini"
              value={composer.text}
              onChange={(e) => setComposer({ ...composer, text: e.target.value })}
              className="admin-input"
              rows={16}
              style={{ width: '100%', fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setComposer(null)} className="btn-admin-outline">
                Batal
              </button>
              <a
                href={getWhatsAppLink(composer.guest, composer.text)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(() => setComposer(null), 300)}
                className="btn-admin"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', textDecoration: 'none' }}
              >
                💬 Kirim via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
