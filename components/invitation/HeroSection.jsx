'use client'

export default function HeroSection({ id, groomName, brideName, settings }) {
  const heroBg = settings?.heroBgPhoto || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop'
  const darkness = settings?.bgOverlayDarkness ? (settings.bgOverlayDarkness / 100) : 0.4
  const theme = settings?.bgTheme || 'midnight'

  const themeGradients = {
    midnight: 'radial-gradient(ellipse at 50% 30%, rgba(25, 12, 5, 0.45) 0%, rgba(0, 0, 0, 0.96) 85%)',
    amber: 'radial-gradient(ellipse at 50% 30%, rgba(65, 32, 12, 0.55) 0%, rgba(12, 6, 2, 0.96) 85%)',
    espresso: 'radial-gradient(ellipse at 50% 30%, rgba(42, 22, 16, 0.55) 0%, rgba(10, 5, 3, 0.96) 85%)',
    velvet: 'radial-gradient(ellipse at 50% 30%, rgba(50, 15, 22, 0.5) 0%, rgba(8, 3, 4, 0.96) 85%)',
  }

  const radialGradient = themeGradients[theme] || themeGradients.midnight

  return (
    <section id={id} className="hero-section section">
      {/* Background - Luxury dark wedding aesthetic */}
      <div
        className="section-bg"
        style={{
          backgroundImage: `
            ${radialGradient},
            url('${heroBg}')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: `brightness(${1.1 - darkness}) saturate(0.85)`,
        }}
      />

      {/* Overlays */}
      <div className="overlay overlay-dark" style={{ opacity: darkness * 0.7 }} />
      <div className="overlay-bottom" />

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
