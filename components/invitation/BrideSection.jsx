'use client'

import { useRef, useEffect, useState } from 'react'
import SectionBackground from './SectionBackground'

export default function BrideSection({ id = 'bride', brideName, settings }) {
  const sectionRef = useRef(null)

  const brideImg = settings?.bridePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  const bgPhoto = settings?.brideBgPhoto || settings?.coupleBgPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop'

  // 3D dynamic transform state (with opposite tilt for editorial harmony)
  const [brideTransform, setBrideTransform] = useState(
    'perspective(1200px) rotateX(-4deg) rotateY(8deg) rotateZ(-5deg) scaleY(1)'
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
          const centerOffset = (rect.top + rect.height / 2 - viewH / 2) / viewH
          const delta = Math.max(-1.2, Math.min(1.2, centerOffset))

          const rotX = -4 + delta * 36
          const rotY = 8 - delta * 45
          const rotZ = -5 + delta * 24
          const absDelta = Math.abs(delta)
          const scaleY = absDelta > 0.45 ? Math.max(0.1, 1 - Math.pow((absDelta - 0.45) * 2.2, 1.8)) : 1

          setBrideTransform(
            `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)})`
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
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.65}
        position="center 30%"
      />

      {/* Ghost background text */}
      <span
        className="ghost-text"
        style={{
          top: '18%',
          right: '-15px',
          fontSize: 'clamp(4rem, 15vw, 8.5rem)',
          opacity: 0.12,
        }}
      >
        BRIDE
      </span>

      <div
        className="section-content"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Reversed layout on desktop (Card Left, Text Right) for alternating rhythm */}
        <div className="single-profile-container reverse">
          {/* Info Side */}
          <div className="single-profile-info">
            <p className="label-gold" style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>
              ✦ THE BRIDE ✦
            </p>
            <h2 className="name-display" style={{ margin: '0 0 12px', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              {brideName}
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background: 'linear-gradient(90deg, var(--gold), transparent)',
                marginBottom: 16,
              }}
            />
            <p
              className="body-text"
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              Putri dari Bapak ____________ dan Ibu ____________
            </p>
          </div>

          {/* 3D Card Side */}
          <div className="single-profile-stage">
            <div
              className="single-3d-card"
              style={{
                transform: brideTransform,
              }}
            >
              <img src={brideImg} alt={brideName} loading="lazy" />
              <div className="single-3d-card-overlay" />
              <div className="single-3d-card-badge">✦ THE BRIDE ✦</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
