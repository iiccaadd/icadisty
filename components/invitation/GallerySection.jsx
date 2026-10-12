'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import SectionBackground from './SectionBackground'
import Stack from './Stack'

import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'
import { photoFrameStyle } from '@/lib/format'

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
      date: m.date || '',
      title: m.title || '',
      desc: m.desc || '',
      src: m.photo || m.src || DEFAULT_SETTINGS.galleryMoments[0].photo,
      alt: m.title || `Irsyad & Adisty - Moment ${i + 1}`,
      frame: photoFrameStyle(m),
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
          style={item.frame}
          loading="lazy"
        />
        <div className="gallery-stack-overlay" />
        {item.title && (
          <div className="gallery-stack-badge">
            ✦ {item.title} ✦
          </div>
        )}
      </div>
    ))
  }, [moments])

  return (
    <section id={id} className="section" style={{ background: '#040201' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.65}
        position="center 40%"
      />

      {/* Ghost Background Typography */}
      <span className="ghost-text" style={{ top: '18%' }}>
        MOMENTS
      </span>

      <div className="section-content">
        <p className="label-gold">✦ Our Story &amp; Moments ✦</p>

        {/* Stack on top, caption and controls below */}
        <div className="slice-showcase-container">
          <div className="slice-info-col">
            {/* Caption lines only render when the admin filled them in */}
            {activeItem.date && <span className="slice-meta">{activeItem.date}</span>}
            {activeItem.title && (
              <div className="slice-title-mask">
                <h3 className="slice-title" key={activeItem.id || currentIdx}>
                  {activeItem.title}
                </h3>
              </div>
            )}
            {activeItem.desc && <p className="slice-desc">{activeItem.desc}</p>}

            <div className="slice-action-bar">
              <button className="slice-more-btn" onClick={handleNext} aria-label="Lihat foto berikutnya">
                <span>Berikutnya</span>
                <span aria-hidden="true">→</span>
              </button>

              <div className="slice-nav-controls">
                <button className="slice-nav-btn" onClick={handlePrev} aria-label="Foto sebelumnya">
                  ‹
                </button>
                <span className="slice-counter">
                  {String(currentIdx + 1).padStart(2, '0')} / {String(moments.length).padStart(2, '0')}
                </span>
                <button className="slice-nav-btn" onClick={handleNext} aria-label="Foto berikutnya">
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
