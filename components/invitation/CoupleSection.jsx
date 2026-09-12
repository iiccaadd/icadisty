'use client'

import { useRef, useEffect, useState } from 'react'

export default function CoupleSection({ id, groomName, brideName, settings }) {
  const sectionRef = useRef(null)

  const groomImg = settings?.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
  const brideImg = settings?.bridePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'

  // 3D dynamic transform states
  const [groomTransform, setGroomTransform] = useState(
    'perspective(1200px) rotateX(4deg) rotateY(-8deg) rotateZ(6deg) scaleY(1)'
  )
  const [brideTransform, setBrideTransform] = useState(
    'perspective(1200px) rotateX(-4deg) rotateY(8deg) rotateZ(-6deg) scaleY(1)'
  )

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false
            return
          }

          const rect = sectionRef.current.getBoundingClientRect()
          const viewH = window.innerHeight || 800

          // Center offset: 0 when centered, positive when entering from bottom, negative when scrolling up
          const centerOffset = (rect.top + rect.height / 2 - viewH / 2) / viewH

          // Clamped delta between -1.2 and 1.2
          const delta = Math.max(-1.2, Math.min(1.2, centerOffset))

          // 3D rotation angles that react smoothly to scrolling
          const groomRotX = 4 - delta * 38
          const groomRotY = -8 + delta * 48
          const groomRotZ = 6 - delta * 28

          const brideRotX = -4 + delta * 38
          const brideRotY = 8 - delta * 48
          const brideRotZ = -6 + delta * 28

          // 3D slice compression near scroll boundaries
          const absDelta = Math.abs(delta)
          const scaleY = absDelta > 0.45 ? Math.max(0.1, 1 - Math.pow((absDelta - 0.45) * 2.2, 1.8)) : 1

          setGroomTransform(
            `perspective(1200px) rotateX(${groomRotX.toFixed(2)}deg) rotateY(${groomRotY.toFixed(2)}deg) rotateZ(${groomRotZ.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)})`
          )

          setBrideTransform(
            `perspective(1200px) rotateX(${brideRotX.toFixed(2)}deg) rotateY(${brideRotY.toFixed(2)}deg) rotateZ(${brideRotZ.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)})`
          )

          ticking = false
        })
        ticking = true
      }
    }

    const scrollRoot = document.querySelector('.invitation-root') || window
    scrollRoot.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    handleScroll()

    return () => {
      scrollRoot.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="section"
      style={{
        background: '#040201',
        overflowY: 'auto',
      }}
    >
      {/* Background gradients */}
      <div
        className="section-bg"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(30, 15, 6, 0.5) 0%, #000 85%)',
        }}
      />
      <div className="overlay-bottom" />

      {/* Ghost background text */}
      <span
        className="ghost-text"
        style={{
          top: '20%',
          left: '-20px',
          fontSize: 'clamp(3.5rem, 12vw, 7rem)',
          opacity: 0.12,
        }}
      >
        COUPLE
      </span>

      <div
        className="section-content"
        style={{
          justifyContent: 'center',
          padding: '40px 24px',
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <p className="label-gold" style={{ marginBottom: 20, textAlign: 'center' }}>
          ✦ PENGANTIN ✦
        </p>

        {/* 1. GROOM ROW (Text on Left, 3D Rotating Card on Right) */}
        <div className="couple-row" style={{ marginBottom: 24 }}>
          <div className="couple-info">
            <p
              style={{
                fontFamily: '"Metropolis", sans-serif',
                fontSize: 11,
                letterSpacing: 3,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              The Groom
            </p>
            <h2 className="name-display">{groomName}</h2>
            <p
              className="body-text"
              style={{
                marginTop: 8,
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
              }}
            >
              Putra dari Bapak ____________ dan Ibu ____________
            </p>
          </div>

          {/* Groom 3D Card */}
          <div className="couple-card-stage">
            <div
              className="couple-3d-card"
              style={{
                transform: groomTransform,
              }}
            >
              <img
                src={groomImg}
                alt={groomName}
                loading="lazy"
              />
              <div className="couple-3d-card-overlay" />
              <div className="couple-3d-card-badge">
                ✦ THE GROOM ✦
              </div>
            </div>
          </div>
        </div>

        {/* Divider with Center Glowing '&' */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            margin: '8px 0 24px',
          }}
        >
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 28,
              color: 'var(--gold)',
              opacity: 0.7,
              fontWeight: 400,
            }}
          >
            &amp;
          </span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* 2. BRIDE ROW (3D Rotating Card on Left, Text on Right) */}
        <div className="couple-row">
          {/* Bride 3D Card */}
          <div className="couple-card-stage">
            <div
              className="couple-3d-card"
              style={{
                transform: brideTransform,
              }}
            >
              <img
                src={brideImg}
                alt={brideName}
                loading="lazy"
              />
              <div className="couple-3d-card-overlay" />
              <div className="couple-3d-card-badge">
                ✦ THE BRIDE ✦
              </div>
            </div>
          </div>

          <div className="couple-info" style={{ textAlign: 'right' }}>
            <p
              style={{
                fontFamily: '"Metropolis", sans-serif',
                fontSize: 11,
                letterSpacing: 3,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              The Bride
            </p>
            <h2 className="name-display">{brideName}</h2>
            <p
              className="body-text"
              style={{
                marginTop: 8,
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
              }}
            >
              Putri dari Bapak ____________ dan Ibu ____________
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
