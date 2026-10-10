'use client'

import { useRef, useEffect, useState } from 'react'
import SectionBackground from './SectionBackground'
import CoupleName from './CoupleName'

export default function GroomSection({ id = 'groom', groomName, settings }) {
  const sectionRef = useRef(null)

  const displayName = groomName || settings?.groomName || 'Muhammad Irsyad'
  const father = settings?.groomFather?.trim()
  const mother = settings?.groomMother?.trim()
  const parentText = father && mother
    ? `Putra dari Bapak ${father} dan Ibu ${mother}`
    : father
    ? `Putra dari Bapak ${father}`
    : mother
    ? `Putra dari Ibu ${mother}`
    : 'Putra dari Bapak ____________ dan Ibu ____________'

  const groomImg = settings?.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
  const bgPhoto = settings?.groomBgPhoto || settings?.coupleBgPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop'

  // 3D dynamic transform state
  const [groomTransform, setGroomTransform] = useState(
    'perspective(1200px) rotateX(4deg) rotateY(-8deg) rotateZ(5deg) scaleY(1)'
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

          const rotX = 4 - delta * 36
          const rotY = -8 + delta * 45
          const rotZ = 5 - delta * 24
          const absDelta = Math.abs(delta)
          const scaleY = absDelta > 0.45 ? Math.max(0.1, 1 - Math.pow((absDelta - 0.45) * 2.2, 1.8)) : 1

          setGroomTransform(
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
      style={{ background: '#040201' }}
    >
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.65}
        position="center 30%"
      />

      {/* Ghost background text */}
      <span className="ghost-text" style={{ top: '18%' }}>
        GROOM
      </span>

      <div className="section-content">
        <div className="single-profile-container">
          {/* Info Side */}
          <div className="single-profile-info">
            <p className="label-gold">✦ THE GROOM ✦</p>
            <CoupleName
              fullName={displayName}
              as="h2"
              blur={{ delay: 150, animateBy: 'words', direction: 'top' }}
            />
            <div className="profile-divider" />
            <p className="body-text" style={{ maxWidth: 420 }}>
              {parentText}
            </p>
          </div>

          {/* 3D Card Side */}
          <div className="single-profile-stage">
            <div
              className="single-3d-card"
              style={{
                transform: groomTransform,
              }}
            >
              <img src={groomImg} alt={groomName} loading="lazy" />
              <div className="single-3d-card-overlay" />
              <div className="single-3d-card-badge">✦ THE GROOM ✦</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
