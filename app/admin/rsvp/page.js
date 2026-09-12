'use client'

import { useState, useEffect } from 'react'

export default function AdminRSVPPage() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | yes | no | maybe
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadRsvps()
  }, [])

  const loadRsvps = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rsvp')
      const json = await res.json()
      setRsvps(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data RSVP ini?')) return
    try {
      const res = await fetch(`/api/rsvp?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRsvps(rsvps.filter((r) => r.id !== id))
      }
    } catch (e) {
      alert('Gagal menghapus data')
    }
  }

  const exportCSV = () => {
    if (rsvps.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    const headers = ['Nama Tamu', 'No WhatsApp', 'Kehadiran', 'Jumlah Hadir', 'Pesan / Doa', 'Tanggal Kirim']
    const rows = rsvps.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'Hadir' : r.attending === 'no' ? 'Tidak Hadir' : 'Ragu-ragu',
      r.guest_count || 1,
      `"${(r.wishes || r.message || '').replace(/"/g, '""')}"`,
      r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `rsvp_icadisty_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered list
  const filtered = rsvps.filter((r) => {
    const matchFilter = filter === 'all' || r.attending === filter
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.wishes?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search)
    return matchFilter && matchSearch
  })

  // Summary counts
  const totalYes = rsvps.filter((r) => r.attending === 'yes')
  const totalHeadcount = totalYes.reduce((acc, cur) => acc + (cur.guest_count || 1), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#F1C193', margin: '0 0 4px' }}>
            Data Konfirmasi Kehadiran (RSVP)
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Total Hadir: <strong style={{ color: '#81c784' }}>{totalYes.length} orang ({totalHeadcount} porsi)</strong> • Berhalangan: <strong style={{ color: '#e57373' }}>{rsvps.filter((r) => r.attending === 'no').length}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadRsvps} className="btn-admin-outline">
            🔄 Muat Ulang
          </button>
          <button onClick={exportCSV} className="btn-admin">
            📥 Ekspor Excel / CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              className={`btn-admin-outline ${filter === 'all' ? 'active' : ''}`}
              style={{ background: filter === 'all' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
            >
              Semua ({rsvps.length})
            </button>
            <button
              onClick={() => setFilter('yes')}
              className={`btn-admin-outline ${filter === 'yes' ? 'active' : ''}`}
              style={{ background: filter === 'yes' ? 'rgba(129, 199, 132, 0.2)' : 'transparent', color: '#81c784' }}
            >
              Hadir ({totalYes.length})
            </button>
            <button
              onClick={() => setFilter('no')}
              className={`btn-admin-outline ${filter === 'no' ? 'active' : ''}`}
              style={{ background: filter === 'no' ? 'rgba(229, 115, 115, 0.2)' : 'transparent', color: '#e57373' }}
            >
              Berhalangan ({rsvps.filter((r) => r.attending === 'no').length})
            </button>
            <button
              onClick={() => setFilter('maybe')}
              className={`btn-admin-outline ${filter === 'maybe' ? 'active' : ''}`}
              style={{ background: filter === 'maybe' ? 'rgba(255, 183, 77, 0.2)' : 'transparent', color: '#ffb74d' }}
            >
              Ragu-ragu ({rsvps.filter((r) => r.attending === 'maybe').length})
            </button>
          </div>

          <div style={{ minWidth: 260 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Cari nama atau ucapan..."
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: 40 }}>Memuat data RSVP...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-muted)' }}>
            <p style={{ fontSize: 32 }}>🔍</p>
            <p>Tidak ditemukan data RSVP yang sesuai kriteria.</p>
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
                    <th>No. WhatsApp</th>
                    <th>Status</th>
                    <th>Porsi/Jumlah</th>
                    <th>Doa &amp; Pesan</th>
                    <th>Waktu Pengisian</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rsvp, idx) => (
                    <tr key={rsvp.id}>
                      <td style={{ color: 'var(--admin-muted)', fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{rsvp.name}</td>
                      <td>
                        {rsvp.phone ? (
                          <a
                            href={`https://wa.me/${rsvp.phone.replace(/^0/, '62').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#81c784', textDecoration: 'none' }}
                          >
                            📱 {rsvp.phone}
                          </a>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>-</span>
                        )}
                      </td>
                      <td>
                        {rsvp.attending === 'yes' && <span className="badge badge-success">✓ Hadir</span>}
                        {rsvp.attending === 'no' && <span className="badge badge-danger">✕ Tidak Hadir</span>}
                        {rsvp.attending === 'maybe' && <span className="badge badge-warning">? Ragu-ragu</span>}
                      </td>
                      <td>{rsvp.attending === 'yes' ? `${rsvp.guest_count || 1} orang` : '-'}</td>
                      <td style={{ maxWidth: 300, lineHeight: 1.5 }}>
                        {rsvp.wishes || rsvp.message || <span style={{ color: 'rgba(255,255,255,0.3)' }}>-</span>}
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--admin-muted)' }}>
                        {rsvp.created_at ? new Date(rsvp.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(rsvp.id)}
                          style={{
                            background: 'rgba(211, 47, 47, 0.15)',
                            color: '#e57373',
                            border: '1px solid rgba(211, 47, 47, 0.3)',
                            borderRadius: 6,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 11,
                          }}
                          title="Hapus RSVP"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="admin-cards-container">
              {filtered.map((rsvp, idx) => (
                <div key={rsvp.id} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block' }}>#{idx + 1}</span>
                      <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{rsvp.name}</strong>
                    </div>
                    <div>
                      {rsvp.attending === 'yes' && <span className="badge badge-success">✓ Hadir ({rsvp.guest_count || 1} org)</span>}
                      {rsvp.attending === 'no' && <span className="badge badge-danger">✕ Berhalangan</span>}
                      {rsvp.attending === 'maybe' && <span className="badge badge-warning">? Ragu</span>}
                    </div>
                  </div>

                  {(rsvp.wishes || rsvp.message) && (
                    <p style={{
                      margin: '4px 0',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.85)',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      borderLeft: '2px solid var(--admin-gold)',
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}>
                      &ldquo;{rsvp.wishes || rsvp.message}&rdquo;
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--admin-muted)', marginTop: 4 }}>
                    <span>
                      {rsvp.created_at ? new Date(rsvp.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {rsvp.phone && (
                        <a
                          href={`https://wa.me/${rsvp.phone.replace(/^0/, '62').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-admin-outline"
                          style={{ padding: '4px 10px', fontSize: 11, color: '#81c784', borderColor: 'rgba(129, 199, 132, 0.4)' }}
                        >
                          💬 Chat
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        style={{
                          background: 'rgba(211, 47, 47, 0.15)',
                          color: '#e57373',
                          border: '1px solid rgba(211, 47, 47, 0.3)',
                          borderRadius: 6,
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: 11,
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
