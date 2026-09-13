'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import SectionBackground from './SectionBackground'
import Stack from './Stack'

import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'

export default function GallerySection({ id, settings }) {
  const effectiveSettings = settings || DEFAULT_SETTINGS
  const bgPhoto = effectiveSettings?.galleryBgPhoto || DEFAULT_SETTINGS.galleryBgPhoto
  const stackRef = useRef(null)

  // Compute moments list from settings (strictly user uploaded moments)
  const moments = useMemo(() => {
    const rawMoments = (Array.isArray(effectiveSettings?.galleryMoments) && effectiveSettings.galleryMoments.length > 0)
      ? effectiveSettings.galleryMoments
      : DEFAULT_SETTINGS.galleryMoments

    return rawMoments.map((m, i) => ({
      id: m.id || i + 1,
      date: m.date || 'Moment',
      title: m.title || `Kenangan 0${i + 1}`,
      desc: m.desc || '',
      src: m.photo || m.src || DEFAULT_SETTINGS.galleryMoments[0].photo,
      alt: m.title || `Irsyad & Adisty - Moment ${i + 1}`,
    }))
  }, [effectiveSettings])

  const [currentIdx, setCurrentIdx] = useState(0)
  const activeItem = moments[currentIdx] || moments[0] || {}

  const handleTopCardChange = useCallback((idx) => {
    if (idx >= 0 && idx < moments.length) {
      setCurrentIdx((prev) => (prev === idx ? prev : idx))
    }
  }, [moments.length])

  const handleNext = () => {
    stackRef.current?.next()
  }

  const handlePrev = () => {
    stackRef.current?.prev()
  }

  // Memoize cards elements to prevent creating new array references on every render
  const cardElements = useMemo(() => {
    return moments.map((item, i) => (
      <div key={`moment-card-${item.id || i}`} className="gallery-stack-card-inner">
        <img
          src={item.src}
          alt={item.alt}
          className="card-image"
          loading="lazy"
        />
        <div className="gallery-stack-overlay" />
        {item.title && (
          <div className="gallery-stack-badge">
            ✦ {item.title.toUpperCase()} ✦
          </div>
        )}
      </div>
    ))
  }, [moments])

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
    >
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.65}
        position="center 40%"
      />

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

        {/* 3D Perspective Showcase Container */}
        <div className="slice-showcase-container">
          {/* Left Column: Kinetic Editorial Info */}
          <div className="slice-info-col">
            <span className="slice-meta">
              <span>Date</span>
              <span>{activeItem.date}</span>
            </span>

            {/* Kinetic Title */}
            <div className="slice-title-mask">
              <h3 className="slice-title enter-down" key={activeItem.id || currentIdx}>
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
                  {String(currentIdx + 1).padStart(2, '0')} / {String(moments.length).padStart(2, '0')}
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

          {/* Right Column: React Bits <Stack /> 3D Component */}
          <div className="gallery-stack-stage">
            <div className="gallery-stack-wrapper">
              <Stack
                ref={stackRef}
                randomRotation={settings?.galleryRandomRotation ?? true}
                sensitivity={140}
                sendToBackOnClick={true}
                autoplay={settings?.galleryAutoplay ?? true}
                autoplayDelay={settings?.galleryAutoplayDelay ?? 3500}
                pauseOnHover={true}
                mobileClickOnly={false}
                onTopCardChange={handleTopCardChange}
                cards={cardElements}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
