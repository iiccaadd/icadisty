'use client'
import SectionBackground from './SectionBackground'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'


export default function EventSection({ id, settings }) {
  // Cached settings from before this feature lack the event keys
  const s = { ...DEFAULT_SETTINGS, ...settings }
  const bgPhoto = settings?.eventsBgPhoto || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop'

  return (
    <section id={id} className="section" style={{ background: '#000', overflowY: 'auto' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.78}
        position="center"
      />

      {/* Ghost Background Typography */}
      <span
        className="ghost-text"
        style={{
          top: '20%',
          right: '-20px',
          fontSize: 'clamp(4rem, 14vw, 8rem)',
          opacity: 0.12,
        }}
      >
        LOCATION
      </span>

      <div className="section-content" style={{
        justifyContent: 'flex-end',
        padding: '0 28px 60px',
        gap: 16,
      }}>
        <p className="label-gold" style={{ fontSize: 11, letterSpacing: '0.25em' }}>✦ Save The Date ✦</p>
        <h2 className="section-heading" style={{ marginBottom: 8, textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>Waktu &amp; Lokasi</h2>

        {[
          { type: 'Akad Nikah', title: 'Akad Nikah', key: 'akad' },
          { type: 'Resepsi', title: 'Resepsi Pernikahan', key: 'resepsi' },
        ].map(({ type, title, key }) => (
          <div className="event-card" key={key}>
            <span className="event-type">{type}</span>
            <h3 className="event-name">{title}</h3>
            <p className="event-detail">
              {s[key + 'Date'] && <>📅 {s[key + 'Date']}<br /></>}
              {s[key + 'Time'] && <>⏰ {s[key + 'Time']}<br /></>}
              {s[key + 'Venue'] && <>📍 {s[key + 'Venue']}<br /></>}
              {s[key + 'Address'] && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{s[key + 'Address']}</span>}
            </p>
            {s[key + 'Maps'] && (
              <a
                href={s[key + 'Maps']}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold-outline"
                style={{ marginTop: 14, fontSize: 12, padding: '8px 18px', display: 'inline-block', textDecoration: 'none' }}
              >
                📌 Petunjuk Lokasi (Google Maps)
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
