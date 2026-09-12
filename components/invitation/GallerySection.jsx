'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import SectionBackground from './SectionBackground'
import Stack from './Stack'

export default function GallerySection({ id, settings }) {
  const bgPhoto = settings?.galleryBgPhoto || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop'
  const stackRef = useRef(null)

  // Compute moments list from settings (dynamic array from admin, or fallback to default moments)
  const moments = useMemo(() => {
    if (Array.isArray(settings?.galleryMoments) && settings.galleryMoments.length > 0) {
      return settings.galleryMoments.map((m, i) => ({
        id: m.id || i + 1,
        date: m.date || 'Moment',
        title: m.title || `Kenangan 0${i + 1}`,
        desc: m.desc || '',
        src: m.photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        alt: m.title || `Irsyad & Adisty - Moment ${i + 1}`,
      }))
    }

    return [
      {
        id: 1,
        date: settings?.moment1Date || 'November 2020',
        title: settings?.moment1Title || 'Pertama Bertemu',
        desc: settings?.moment1Desc || 'Sebuah perjumpaan tak terduga di Muara Teweh yang menjadi awal mula lembaran kisah kasih kami.',
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
        desc: settings?.moment4Desc || 'Masjid H. Muhammad Sidik Islamic Center Muara Teweh, mengikat janji suci seumur hidup.',
        src: settings?.moment4Photo || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
        alt: 'Irsyad & Adisty - Hari Bahagia',
      },
    ]
  }, [settings])

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
