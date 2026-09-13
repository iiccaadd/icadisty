'use client'

import { useState, useMemo } from 'react'
import BlurText from './BlurText'
import SpecularButton from './SpecularButton'
import InfiniteSpiral from './InfiniteSpiral'

const DEFAULT_SPIRAL_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
]

export default function Preloader({ groomName, brideName, guestName, onOpen, isOpened, settings }) {
  const [visible, setVisible] = useState(true)

  const handleOpen = () => {
    onOpen()
    setTimeout(() => setVisible(false), 1100)
  }

  const spiralItems = useMemo(() => {
    const list = []
    if (settings?.groomPhoto) list.push(settings.groomPhoto)
    if (settings?.bridePhoto) list.push(settings.bridePhoto)
    if (settings?.coupleBgPhoto) list.push(settings.coupleBgPhoto)
    if (settings?.heroBgPhoto) list.push(settings.heroBgPhoto)
    if (Array.isArray(settings?.galleryPhotos)) {
      settings.galleryPhotos.forEach((p) => {
        const src = typeof p === 'string' ? p : p?.src || p?.url
        if (src) list.push(src)
      })
    }
    if (settings?.moment1Photo) list.push(settings.moment1Photo)
    if (settings?.moment2Photo) list.push(settings.moment2Photo)
    if (settings?.moment3Photo) list.push(settings.moment3Photo)
    if (settings?.moment4Photo) list.push(settings.moment4Photo)

    const unique = Array.from(new Set(list.filter(Boolean)))
    if (unique.length < 8) {
      DEFAULT_SPIRAL_IMAGES.forEach((img) => {
        if (unique.length < 12 && !unique.includes(img)) unique.push(img)
      })
    }
    return unique.map((src, i) => ({
      src,
      alt: `Wedding Memory ${i + 1}`,
    }))
  }, [settings])

  if (!visible) return null

  return (
    <div className={`preloader ${isOpened ? 'hidden' : ''}`}>
      {/* 3D Infinite Spiral Background Layer */}
      <div
        className="preloader-bg-spiral"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0.52,
          pointerEvents: 'none',
        }}
      >
        <InfiniteSpiral
          items={spiralItems}
          animationMode="auto"
          speed={0.4}
          radius={240}
          cardWidth={120}
          cardHeight={150}
          verticalSpacing={65}
          perspective={1100}
          cardRadius={14}
          centerScale={1.18}
          edgeBlur={6}
          cardsPerTurn={8}
          pauseOnHover={false}
          imageFit="cover"
        />
      </div>

      {/* Cinematic Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(4, 2, 1, 0.72) 0%, rgba(4, 2, 1, 0.88) 60%, rgba(4, 2, 1, 0.98) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Foreground Content */}
      <div
        className="preloader-inner"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* THE WEDDING OF */}
        <p
          className="preloader-label"
          style={{
            color: '#F1C193',
            fontFamily: "'Metropolis', sans-serif",
            fontSize: 12,
            letterSpacing: 4,
            fontWeight: 400,
            textTransform: 'uppercase',
            margin: '0 auto 24px',
            textAlign: 'center',
            opacity: 0,
            animation: 'fadeIn 0.7s ease forwards 0.2s',
          }}
        >
          THE WEDDING OF
        </p>

        {/* Groom Name */}
        <BlurText
          text={groomName}
          delay={150}
          startDelay={0.35}
          animateBy="words"
          direction="top"
          as="h1"
          className="preloader-title-name"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            color: '#ffffff',
            margin: '0 auto 6px',
            lineHeight: 1.25,
            justifyContent: 'center',
          }}
        />

        {/* Ampersand */}
        <BlurText
          text="&"
          delay={150}
          startDelay={0.75}
          animateBy="words"
          direction="top"
          className="preloader-ampersand-blur"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 34,
            color: 'rgba(255, 255, 255, 0.45)',
            margin: '4px auto 8px',
            lineHeight: 1,
            justifyContent: 'center',
            fontStyle: 'italic',
          }}
        />

        {/* Bride Name */}
        <BlurText
          text={brideName}
          delay={150}
          startDelay={0.95}
          animateBy="words"
          direction="top"
          as="h1"
          className="preloader-title-name"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            color: '#ffffff',
            margin: '0 auto 16px',
            lineHeight: 1.25,
            justifyContent: 'center',
          }}
        />

        {/* Guest greeting */}
        {guestName && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"Cormorant", serif',
                fontStyle: 'italic',
                fontSize: 14,
                opacity: 0,
                animation: 'fadeIn 0.6s ease forwards 1.5s',
              }}
            >
              Kepada Yth.<br />
              <strong style={{ color: '#F1C193', fontSize: 18, fontStyle: 'normal' }}>
                {guestName}
              </strong>
            </p>
          </div>
        )}

        {/* Open Button */}
        <div className="preloader-open-btn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SpecularButton
            size="md"
            radius={28}
            tint="#ffffff"
            tintOpacity={0.12}
            blur={16}
            textColor="#ffffff"
            lineColor="#ffffff"
            baseColor="#555555"
            intensity={1.5}
            shineSize={18}
            shineFade={38}
            thickness={1.5}
            speed={0.4}
            followMouse={true}
            proximity={250}
            autoAnimate={true}
            onClick={handleOpen}
            className="btn-buka-undangan"
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '0.03em',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
              }}
            >
              <span style={{ fontSize: 17, lineHeight: 1 }}>💌</span>
              <span>Buka Undangan</span>
            </span>
          </SpecularButton>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: '"Cormorant", serif',
              fontStyle: 'italic',
              fontSize: 11,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            Wednesday, 11 November 2026
          </p>
        </div>
      </div>
    </div>
  )
}
