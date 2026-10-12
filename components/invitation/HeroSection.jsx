'use client'
import SectionBackground from './SectionBackground'
import CoupleName from './CoupleName'
import { formatWeddingDate } from '@/lib/format'

export default function HeroSection({ id, groomName, brideName, settings }) {
  const heroBg = settings?.heroBgPhoto || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop'
  const dateLabel = formatWeddingDate(settings?.weddingDate)

  return (
    <section id={id} className="hero-section section">
      {/* Background - Luxury dark wedding aesthetic */}
      <SectionBackground
        photo={heroBg}
        settings={settings}
        position="center 40%"
        natural
      />

      {/* Hero Content */}
      <div className="hero-content" style={{ '--name-chars': Math.max(groomName.length, brideName.length) }}>
        <p className="label-gold">✦ The Wedding of ✦</p>
        <CoupleName fullName={groomName} as="h1" />
        <span className="amp">&amp;</span>
        <CoupleName fullName={brideName} as="h1" />
        {dateLabel && <p className="hero-date">{dateLabel}</p>}

        <div className="hero-actions">
          <button
            className="btn btn-gold-outline"
            onClick={() => document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          >
            RSVP Sekarang
          </button>
          <button
            className="btn"
            style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={() => document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Detail Acara
          </button>
        </div>
      </div>

      <div className="scroll-indicator">Gulir ke Bawah</div>
    </section>
  )
}
