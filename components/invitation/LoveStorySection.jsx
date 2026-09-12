import SectionBackground from './SectionBackground'

const stories = [
  { year: '2020', title: 'Pertama Bertemu', desc: 'Takdir mempertemukan kami di sebuah momen yang tak terlupakan.' },
  { year: '2021', title: 'Jatuh Cinta', desc: 'Dari pertemanan yang hangat, tumbuh rasa yang lebih dalam.' },
  { year: '2022', title: 'Menjalin Hubungan', desc: 'Kami memutuskan untuk bersama dan saling menjaga.' },
  { year: '2023', title: 'Bersama Keluarga', desc: 'Memperkenalkan satu sama lain kepada keluarga tercinta.' },
  { year: '2026', title: 'Menuju Pelaminan', desc: 'Dengan ridho Allah, kami siap melangkah ke jenjang yang lebih sakral.' },
]

export default function LoveStorySection({ id, settings }) {
  const bgPhoto = settings?.loveStoryBgPhoto || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop'

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
      <span
        className="ghost-text"
        style={{
          top: '22%',
          left: '-15px',
          fontSize: 'clamp(3.5rem, 12vw, 7rem)',
          opacity: 0.12,
        }}
      >
        JOURNEY
      </span>

      <div className="section-content" style={{ justifyContent: 'flex-end', padding: '0 0 54px' }}>
        <div style={{ padding: '0 28px', marginBottom: 20 }}>
          <p className="label-gold" style={{ fontSize: 11, letterSpacing: '0.25em' }}>✦ Our Journey ✦</p>
          <h2 className="section-heading" style={{ marginTop: 4, textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>Love Story</h2>
        </div>

        {/* Horizontal scroll timeline */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: 16,
            padding: '0 28px 8px',
            WebkitOverflowScrolling: 'touch',
          }}
          className="no-scrollbar"
        >
          {stories.map((s, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: 220,
                background: 'rgba(18, 12, 8, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(241, 193, 147, 0.2)',
                borderRadius: 14,
                padding: '20px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 32,
                  color: 'rgba(241,193,147,0.7)',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                {s.year}
              </span>
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 18,
                  color: '#fff',
                  fontWeight: 400,
                  marginBottom: 8,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: '"Metropolis", sans-serif',
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.5,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
