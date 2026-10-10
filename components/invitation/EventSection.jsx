'use client'
import SectionBackground from './SectionBackground'
import { getEvents } from '@/lib/defaultSettings'

export default function EventSection({ id, settings }) {
  const bgPhoto = settings?.eventsBgPhoto || 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop'

  return (
    <section id={id} className="section" style={{ background: '#000' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={bgPhoto}
        settings={settings}
        brightnessMultiplier={0.78}
        position="center"
      />

      {/* Ghost Background Typography */}
      <span className="ghost-text" style={{ top: '20%' }}>
        LOCATION
      </span>

      <div className="section-content">
        <div>
          <p className="label-gold">✦ Save The Date ✦</p>
          <h2 className="section-heading" style={{ marginTop: 8 }}>Waktu &amp; Lokasi</h2>
        </div>

        {getEvents(settings).map((e) => {
          // "Akad Nikah" label above an "Akad Nikah" title says the same thing twice
          const showType = e.type && !(e.title || '').toLowerCase().includes(e.type.toLowerCase())
          // Date and time each stay whole, so a narrow card wraps between them, not inside "08.00 – 10.00"
          const when = [e.date, e.time].filter(Boolean)
          return (
            <div className="event-card" key={e.id}>
              {showType && <span className="event-type">{e.type}</span>}
              {e.title && <h3 className="event-name">{e.title}</h3>}
              {when.length > 0 && (
                <p className="event-detail">
                  {when.map((part, i) => (
                    <span key={i} style={{ whiteSpace: 'nowrap' }}>{i > 0 && ' · '}{part}</span>
                  ))}
                </p>
              )}
              {e.venue && <p className="event-detail">{e.venue}</p>}
              {e.address && <p className="caption-text">{e.address}</p>}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer" className="btn btn-gold-outline">
                  Petunjuk Lokasi (Google Maps)
                </a>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
