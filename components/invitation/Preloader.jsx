'use client'
import { useState } from 'react'

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
      <div className="preloader-inner">
        {/* THE WEDDING OF */}
        <div className="word-mask" style={{ height: 28, marginBottom: 24 }}>
          <span className="preloader-label delay-1">THE WEDDING OF</span>
        </div>

        {/* Groom Name */}
        <div className="word-mask">
          <span className="word-reveal delay-2">{groomName}</span>
        </div>

        {/* Ampersand */}
        <div className="word-mask" style={{ height: 60 }}>
          <span className="preloader-ampersand delay-3">&amp;</span>
        </div>

        {/* Bride Name */}
        <div className="word-mask">
          <span className="word-reveal delay-4">{brideName}</span>
        </div>

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
            tint="#846244"
            tintOpacity={0.92}
            blur={10}
            textColor="#0f0905"
            lineColor="#F8DFC4"
            baseColor="#453120"
            intensity={1.35}
            shineSize={16}
            shineFade={35}
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
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '0.01em'
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
