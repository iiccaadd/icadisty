'use client'

import { useState, useMemo, useEffect } from 'react'
import BlurText from './BlurText'
import SpecularButton from './SpecularButton'
import InfiniteSpiral from './InfiniteSpiral'

import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'

export default function Preloader({ groomName, brideName, guestName, onOpen, isOpened, settings }) {
  const [visible, setVisible] = useState(true)

  const handleOpen = () => {
    onOpen()
    setTimeout(() => setVisible(false), 1100)
  }

  const effectiveSettings = settings || DEFAULT_SETTINGS

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
    }
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const spiralItems = useMemo(() => {
    const list = []

    // 1. All gallery moments uploaded by user
    if (Array.isArray(effectiveSettings?.galleryMoments)) {
      effectiveSettings.galleryMoments.forEach((m) => {
        const src = typeof m === 'string' ? m : m?.photo || m?.src || m?.url
        if (src) list.push(src)
      })
    }

    // 2. Extra gallery photos if any
    if (Array.isArray(effectiveSettings?.galleryPhotos)) {
      effectiveSettings.galleryPhotos.forEach((p) => {
        const src = typeof p === 'string' ? p : p?.src || p?.url
        if (src) list.push(src)
      })
    }

    // 3. Individual moment photos
    if (effectiveSettings?.moment1Photo) list.push(effectiveSettings.moment1Photo)
    if (effectiveSettings?.moment2Photo) list.push(effectiveSettings.moment2Photo)
    if (effectiveSettings?.moment3Photo) list.push(effectiveSettings.moment3Photo)
    if (effectiveSettings?.moment4Photo) list.push(effectiveSettings.moment4Photo)

    // 4. Key couple and wedding photos
    if (effectiveSettings?.groomPhoto) list.push(effectiveSettings.groomPhoto)
    if (effectiveSettings?.bridePhoto) list.push(effectiveSettings.bridePhoto)
    if (effectiveSettings?.coupleBgPhoto) list.push(effectiveSettings.coupleBgPhoto)
    if (effectiveSettings?.heroBgPhoto) list.push(effectiveSettings.heroBgPhoto)
    if (effectiveSettings?.groomBgPhoto) list.push(effectiveSettings.groomBgPhoto)
    if (effectiveSettings?.brideBgPhoto) list.push(effectiveSettings.brideBgPhoto)
    if (effectiveSettings?.loveStoryBgPhoto) list.push(effectiveSettings.loveStoryBgPhoto)
    if (effectiveSettings?.eventsBgPhoto) list.push(effectiveSettings.eventsBgPhoto)
    if (effectiveSettings?.countdownBgPhoto) list.push(effectiveSettings.countdownBgPhoto)
    if (effectiveSettings?.galleryBgPhoto) list.push(effectiveSettings.galleryBgPhoto)
    if (effectiveSettings?.rsvpBgPhoto) list.push(effectiveSettings.rsvpBgPhoto)
    if (effectiveSettings?.closingBgPhoto) list.push(effectiveSettings.closingBgPhoto)

    // Filter out any unsplash template photos and empty values: strictly use uploaded photos!
    const uploadedOnly = list
      .filter(Boolean)
      .filter((url) => typeof url === 'string' && !url.includes('images.unsplash.com'))

    let unique = Array.from(new Set(uploadedOnly))

    // If somehow empty, fallback to list items
    if (unique.length === 0) {
      unique = Array.from(new Set(list.filter(Boolean)))
    }

    // Target card count: 6 on mobile for fast GPU rendering, 10 on desktop
    const targetCount = isMobile ? 6 : 10
    let finalPhotos = [...unique]
    while (finalPhotos.length < targetCount && unique.length > 0) {
      finalPhotos = finalPhotos.concat(unique)
    }

    return finalPhotos.slice(0, targetCount).map((src, i) => ({
      src,
      alt: `Foto Pernikahan ${i + 1}`,
    }))
  }, [effectiveSettings, isMobile])

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
        {!isOpened && (
          <InfiniteSpiral
            items={spiralItems}
            animationMode="auto"
            speed={isMobile ? 0.32 : 0.4}
            radius={isMobile ? 140 : 230}
            cardWidth={isMobile ? 75 : 115}
            cardHeight={isMobile ? 95 : 145}
            verticalSpacing={isMobile ? 46 : 65}
            perspective={isMobile ? 800 : 1100}
            cardRadius={isMobile ? 10 : 14}
            centerScale={isMobile ? 1.12 : 1.18}
            edgeBlur={isMobile ? 0 : 5}
            cardsPerTurn={isMobile ? 6 : 8}
            pauseOnHover={false}
            imageFit="cover"
          />
        )}
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
