'use client'
import { useState, useEffect } from 'react'
import SectionBackground from './SectionBackground'

const TARGET_DATE = new Date(
  process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-12-20T09:00:00+07:00'
)

function getCountdown() {
  const now = new Date()
  const diff = TARGET_DATE - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownSection({ id, settings }) {
  const [time, setTime] = useState(getCountdown())
  const bgPhoto = settings?.countdownBgPhoto || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop'

  useEffect(() => {
    const timer = setInterval(() => setTime(getCountdown()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <section id={id} className="section" style={{ background: '#000' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.8}
        position="center"
      />

      {/* Ghost text */}
      <span
        className="ghost-text"
        style={{
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          opacity: 0.1,
          letterSpacing: '0.15em',
        }}
      >
        COUNTDOWN
      </span>

      <div className="section-content" style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 28px',
        gap: 32,
      }}>
        <div>
          <p className="label-gold" style={{ fontSize: 11, letterSpacing: '0.25em' }}>✦ Menuju Hari Bahagia ✦</p>
          <h2 className="section-heading" style={{ marginTop: 8, textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>Countdown</h2>
        </div>

        <div className="countdown-wrapper">
          {[
            { value: time.days, label: 'Hari' },
            { value: time.hours, label: 'Jam' },
            { value: time.minutes, label: 'Menit' },
            { value: time.seconds, label: 'Detik' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              <div className="countdown-item">
                <span className="countdown-digits">{pad(item.value)}</span>
                <span className="countdown-label">{item.label}</span>
              </div>
              {i < 3 && (
                <span className="countdown-sep" style={{ margin: '0 4px', marginTop: 0 }}>:</span>
              )}
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: '"Cormorant", serif',
          fontStyle: 'italic',
          fontSize: 16,
          color: 'rgba(255,255,255,0.5)',
          maxWidth: 280,
        }}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
          isteri-isteri dari jenismu sendiri..." — QS. Ar-Rum: 21
        </p>
      </div>
    </section>
  )
}
