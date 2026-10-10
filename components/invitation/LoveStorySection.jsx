'use client'

import { useMemo } from 'react'
import SectionBackground from './SectionBackground'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'
import { formatStoryDate } from '@/lib/format'

export default function LoveStorySection({ id, settings }) {
  const effectiveSettings = settings || DEFAULT_SETTINGS
  const bgPhoto = effectiveSettings?.loveStoryBgPhoto || DEFAULT_SETTINGS.loveStoryBgPhoto

  const stories = useMemo(() => {
    if (Array.isArray(effectiveSettings?.loveStories) && effectiveSettings.loveStories.length > 0) {
      return effectiveSettings.loveStories
    }
    return DEFAULT_SETTINGS.loveStories
  }, [effectiveSettings])

  return (
    <section id={id} className="section" style={{ background: '#050200' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        position="center 30%"
        brightnessMultiplier={0.88}
      />

      {/* Ghost text for cinematic depth */}
      <span className="ghost-text" style={{ top: '22%' }}>
        JOURNEY
      </span>

      <div className="section-content">
        <div>
          <p className="label-gold">✦ Our Journey ✦</p>
          <h2 className="section-heading" style={{ marginTop: 8 }}>Kisah Cinta</h2>
        </div>

        {/* Horizontal scroll timeline */}
        <div className="story-track no-scrollbar">
          {stories.map((s, i) => (
            <div key={i} className="story-card">
              {s.year && <span className="label-gold">{formatStoryDate(s.year)}</span>}
              <h3>{s.title}</h3>
              <p className="body-text">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
