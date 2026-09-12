'use client'

const VENUE_NAME = process.env.NEXT_PUBLIC_VENUE_NAME || 'Masjid H. Muhammad Sidik Islamic Center Muara Tewah'
const VENUE_ADDRESS = process.env.NEXT_PUBLIC_VENUE_ADDRESS || 'Muara Tewah, Kabupaten Barito Utara, Kalimantan Tengah'
const VENUE_MAPS = process.env.NEXT_PUBLIC_VENUE_MAPS || 'https://maps.google.com/?q=Masjid+H+Muhammad+Sidik+Muara+Tewah'

export default function EventSection({ id }) {
  return (
    <section id={id} className="section" style={{ background: '#000', overflowY: 'auto' }}>
      <div className="section-bg" style={{
        background: 'linear-gradient(180deg, #050200 0%, #000 100%)',
      }} />
      <div className="overlay-bottom" />

      <div className="section-content" style={{
        justifyContent: 'flex-end',
        padding: '0 28px 60px',
        gap: 16,
      }}>
        <p className="label-gold">✦ Save The Date ✦</p>
        <h2 className="section-heading" style={{ marginBottom: 8 }}>Waktu &amp; Lokasi</h2>

        {/* Akad */}
        <div className="event-card">
          <span className="event-type">Akad Nikah</span>
          <h3 className="event-name">Akad Nikah</h3>
          <p className="event-detail">
            📅 Rabu, 11 November 2026<br />
            ⏰ 08.00 – 10.00 WIB<br />
            📍 {VENUE_NAME}
          </p>
        </div>

        {/* Resepsi */}
        <div className="event-card">
          <span className="event-type">Resepsi</span>
          <h3 className="event-name">Resepsi Pernikahan</h3>
          <p className="event-detail">
            📅 Rabu, 11 November 2026<br />
            ⏰ 11.00 – 14.00 WIB<br />
            📍 {VENUE_NAME}<br />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{VENUE_ADDRESS}</span>
          </p>
          <a
            href={VENUE_MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold-outline"
            style={{ marginTop: 14, fontSize: 12, padding: '8px 18px', display: 'inline-block', textDecoration: 'none' }}
          >
            📌 Petunjuk Lokasi (Google Maps)
          </a>
        </div>
      </div>
    </section>
  )
}
