'use client'
import { useState } from 'react'

import BlurText from './BlurText'
import SpecularButton from './SpecularButton'

export default function Preloader({ groomName, brideName, guestName, onOpen, isOpened }) {
  const [visible, setVisible] = useState(true)

  const handleOpen = () => {
    onOpen()
    setTimeout(() => setVisible(false), 1100)
  }

  if (!visible) return null

  return (
    <div className={`preloader ${isOpened ? 'hidden' : ''}`}>
      <div className="preloader-inner" style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '0 20px' }}>
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
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontFamily: '"Cormorant", serif',
              fontStyle: 'italic',
              fontSize: 14,
              opacity: 0,
              animation: 'fadeIn 0.6s ease forwards 1.5s'
            }}>
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
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '0.03em',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
            }}>
              <span style={{ fontSize: 17, lineHeight: 1 }}>💌</span>
              <span>Buka Undangan</span>
            </span>
          </SpecularButton>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontFamily: '"Cormorant", serif',
            fontStyle: 'italic',
            fontSize: 11,
            textAlign: 'center',
            marginTop: 12
          }}>
            Wednesday, 11 November 2026
          </p>
        </div>
      </div>
    </div>
  )
}
