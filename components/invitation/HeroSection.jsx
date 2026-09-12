'use client'
import SectionBackground from './SectionBackground'

export default function HeroSection({ id, groomName, brideName, settings }) {
  const heroBg = settings?.heroBgPhoto || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop'

  return (
    <section id={id} className="hero-section section">
      {/* Background - Luxury dark wedding aesthetic */}
      <SectionBackground
        photo={heroBg}
        settings={settings}
        position="center 40%"
        brightnessMultiplier={1.05}
      />

      {/* Ghost Text */}
      <span className="ghost-text" style={{ top: '25%', left: '-10px', fontSize: '6rem' }}>
        {groomName}
      </span>

      {/* Hero Content */}
      <div className="hero-content">
        <p className="hero-label">✦ The Wedding of ✦</p>
        <div className="hero-names">
          <span className="hero-name">{groomName}</span>
          <span style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 48,
            color: 'rgba(255,255,255,0.4)',
            display: 'block',
            lineHeight: 0.8,
          }}>&amp;</span>
          <span className="hero-name">{brideName}</span>
        </div>
        <p className="hero-date">✦ Rabu, 11 November 2026 ✦</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
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
            Event Details
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: 0.7,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Scroll Down
        </span>
        <div style={{
          width: 1,
          height: 24,
          background: 'linear-gradient(to bottom, #F1C193, transparent)',
          animation: 'pulse 1.8s infinite',
        }} />
      </div>
    </section>
  )
}
