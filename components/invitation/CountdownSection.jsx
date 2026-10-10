'use client'
import { useState, useEffect } from 'react'
import SectionBackground from './SectionBackground'

function parseTargetDate(dateStr) {
  if (!dateStr) return new Date('2026-11-11T08:00:00+07:00')
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? new Date('2026-11-11T08:00:00+07:00') : d
}

function getCountdown(targetDate) {
  const now = new Date()
  const target = parseTargetDate(targetDate)
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownSection({ id, settings }) {
  const targetDate = settings?.weddingDate || process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-11-11T08:00'
  const [time, setTime] = useState(() => getCountdown(targetDate))
  const bgPhoto = settings?.countdownBgPhoto || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop'

  useEffect(() => {
    setTime(getCountdown(targetDate))
    const timer = setInterval(() => setTime(getCountdown(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

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
      <span className="ghost-text" style={{ top: '25%' }}>
        COUNTDOWN
      </span>

      <div className="section-content" style={{ gap: 32 }}>
        <div>
          <p className="label-gold">✦ Menuju Hari Bahagia ✦</p>
          <h2 className="section-heading" style={{ marginTop: 8 }}>Hitung Mundur</h2>
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
                <span className="countdown-sep" style={{ margin: '0 4px' }}>:</span>
              )}
            </div>
          ))}
        </div>

        <p className="quote-text" style={{ maxWidth: 320 }}>
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
          isteri-isteri dari jenismu sendiri...&rdquo; — QS. Ar-Rum: 21
        </p>
      </div>
    </section>
  )
}
