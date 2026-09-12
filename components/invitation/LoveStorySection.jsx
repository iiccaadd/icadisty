const stories = [
  { year: '2020', title: 'Pertama Bertemu', desc: 'Takdir mempertemukan kami di sebuah momen yang tak terlupakan.' },
  { year: '2021', title: 'Jatuh Cinta', desc: 'Dari pertemanan yang hangat, tumbuh rasa yang lebih dalam.' },
  { year: '2022', title: 'Menjalin Hubungan', desc: 'Kami memutuskan untuk bersama dan saling menjaga.' },
  { year: '2023', title: 'Bersama Keluarga', desc: 'Memperkenalkan satu sama lain kepada keluarga tercinta.' },
  { year: '2026', title: 'Menuju Pelaminan', desc: 'Dengan ridho Allah, kami siap melangkah ke jenjang yang lebih sakral.' },
]

export default function LoveStorySection({ id }) {
  return (
    <section id={id} className="section" style={{ background: '#050200' }}>
      <div className="section-bg" style={{
        background: 'linear-gradient(135deg, #050200 0%, #0a0500 100%)',
      }} />
      <div className="overlay-bottom" />

      <div className="section-content" style={{ justifyContent: 'flex-end', padding: '0 0 60px' }}>
        <div style={{ padding: '0 28px', marginBottom: 24 }}>
          <p className="label-gold">✦ Our Journey ✦</p>
          <h2 className="section-heading" style={{ marginTop: 4 }}>Love Story</h2>
        </div>

        {/* Horizontal scroll timeline */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 16,
          padding: '0 28px 8px',
          WebkitOverflowScrolling: 'touch',
        }}
        className="no-scrollbar">
          {stories.map((s, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: 220,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '20px 16px',
            }}>
              <span style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 32,
                color: 'rgba(241,193,147,0.5)',
                display: 'block',
                marginBottom: 8,
              }}>{s.year}</span>
              <h3 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 18,
                color: '#fff',
                fontWeight: 400,
                marginBottom: 8,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: '"Metropolis", sans-serif',
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.5,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
