'use client'

import { useState, useEffect, useRef } from 'react'

export default function GallerySection({ id, settings }) {
  const moments = [
    {
      id: 1,
      date: settings?.moment1Date || 'November 2020',
      title: settings?.moment1Title || 'Pertama Bertemu',
      desc: settings?.moment1Desc || 'Sebuah perjumpaan tak terduga di Muara Tewah yang menjadi awal mula lembaran kisah kasih kami.',
      src: settings?.moment1Photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      alt: 'Irsyad & Adisty - Pertama Bertemu',
    },
    {
      id: 2,
      date: settings?.moment2Date || 'Agustus 2022',
      title: settings?.moment2Title || 'Merajut Janji',
      desc: settings?.moment2Desc || 'Melangkah bersama melewati ragam cerita, bertumbuh dalam cinta, saling menjaga dan menguatkan.',
      src: settings?.moment2Photo || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
      alt: 'Irsyad & Adisty - Merajut Janji',
    },
    {
      id: 3,
      date: settings?.moment3Date || 'Mei 2024',
      title: settings?.moment3Title || 'Restu Keluarga',
      desc: settings?.moment3Desc || 'Dua keluarga besar bersatu dalam doa dan restu yang tulus menyongsong mahligai suci.',
      src: settings?.moment3Photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
      alt: 'Irsyad & Adisty - Restu Keluarga',
    },
    {
      id: 4,
      date: settings?.moment4Date || '11 November 2026',
      title: settings?.moment4Title || 'Hari Bahagia',
      desc: settings?.moment4Desc || 'Masjid H. Muhammad Sidik Islamic Center Muara Tewah, mengikat janji suci seumur hidup.',
      src: settings?.moment4Photo || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
      alt: 'Irsyad & Adisty - Hari Bahagia',
    },
  ]

  const [currentIdx, setCurrentIdx] = useState(0)
  const [animState, setAnimState] = useState('idle') // idle | transitioning
  const [touchStart, setTouchStart] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayRef = useRef(null)

  const activeItem = moments[currentIdx]

  const goToSlide = (nextIndex) => {
    if (animState === 'transitioning' || nextIndex === currentIdx) return
    setAnimState('transitioning')

    // Wait for razor-slice exit animation, then swap active index and enter
    setTimeout(() => {
      setCurrentIdx(nextIndex)
      setAnimState('idle')
    }, 550)
  }

  const handleNext = () => {
    const next = (currentIdx + 1) % moments.length
    goToSlide(next)
  }

  const handlePrev = () => {
    const prev = (currentIdx - 1 + moments.length) % moments.length
    goToSlide(prev)
  }

  // Auto-play timer (similar to video showcase)
  useEffect(() => {
    if (isPaused) return
    autoPlayRef.current = setInterval(() => {
      handleNext()
    }, 4500)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [currentIdx, isPaused, animState])

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX
    if (touchStart - touchEnd > 50) {
      handleNext() // Swiped left -> next
    }
    if (touchStart - touchEnd < -50) {
      handlePrev() // Swiped right -> prev
    }
  }

  return (
    <section
      id={id}
      className="section"
      style={{
        background: '#040201',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background gradients */}
      <div
        className="section-bg"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(35, 18, 8, 0.45) 0%, #000 80%)',
        }}
      />
      <div className="overlay-bottom" />

      {/* Ghost Background Typography */}
      <span
        className="ghost-text"
        style={{
          top: '18%',
          right: '-20px',
          fontSize: 'clamp(4rem, 14vw, 8rem)',
          opacity: 0.15,
        }}
      >
        MOMENTS
      </span>

      <div className="section-content" style={{ justifyContent: 'center', padding: '40px 0' }}>
        {/* Section Tag */}
        <div style={{ padding: '0 28px', marginBottom: 12, maxWidth: 1080, margin: '0 auto 16px', width: '100%' }}>
          <p className="label-gold" style={{ fontSize: 11, letterSpacing: '0.25em', margin: 0 }}>
            ✦ OUR STORY &amp; MOMENTS ✦
          </p>
        </div>

        {/* 3D Perspective Tilt & Slice Showcase */}
        <div className="slice-showcase-container">
          {/* Left Column: Kinetic Editorial Info */}
          <div className="slice-info-col">
            <span className="slice-meta">
              <span>Date</span>
              <span>{activeItem.date}</span>
            </span>

            {/* Kinetic Title with Overflow Mask */}
            <div className="slice-title-mask">
              <h3
                className={`slice-title ${
                  animState === 'transitioning' ? 'exit-up' : 'enter-down'
                }`}
                key={activeItem.id}
              >
                {activeItem.title}
              </h3>
            </div>

            <p className="slice-desc">{activeItem.desc}</p>

            <div className="slice-divider" />

            {/* Action & Controls */}
            <div className="slice-action-bar">
              <button
                className="slice-more-btn"
                onClick={handleNext}
                aria-label="Lihat foto berikutnya"
              >
                <span>MORE</span>
                <span>→</span>
              </button>

              <div className="slice-nav-controls">
                <button
                  className="slice-nav-btn"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <span className="slice-counter">
                  0{currentIdx + 1} / 0{moments.length}
                </span>
                <button
                  className="slice-nav-btn"
                  onClick={handleNext}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Stage & Tilting Sliced Card */}
          <div className="slice-stage">
            <div className="slice-card-wrapper">
              {moments.map((item, idx) => {
                const isActive = idx === currentIdx
                let cardClass = 'slice-card'

                if (isActive) {
                  cardClass += animState === 'transitioning' ? ' slice-exit' : ' slice-active'
                } else {
                  cardClass += ' slice-enter'
                }

                return (
                  <div
                    key={item.id}
                    className={cardClass}
                    style={{
                      display: isActive || animState === 'transitioning' ? 'block' : 'none',
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
