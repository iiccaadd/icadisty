export default function CoupleSection({ id, groomName, brideName }) {
  return (
    <section id={id} className="section" style={{ background: '#000' }}>
      {/* Background gradient */}
      <div className="section-bg" style={{
        background: 'linear-gradient(180deg, #0a0500 0%, #000 60%)',
      }} />
      <div className="overlay-bottom" />

      <div className="section-content" style={{
        justifyContent: 'flex-end',
        padding: '0 28px 60px',
      }}>
        <p className="label-gold" style={{ marginBottom: 8 }}>✦ Pengantin ✦</p>

        {/* Groom */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: '"Metropolis", sans-serif',
            fontSize: 11,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>The Groom</p>
          <h2 className="name-display">{groomName}</h2>
          <p className="body-text" style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
            Putra dari Bapak ____________ dan Ibu ____________
          </p>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 32,
        }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 32,
            color: 'rgba(255,255,255,0.25)',
          }}>&amp;</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Bride */}
        <div>
          <p style={{
            fontFamily: '"Metropolis", sans-serif',
            fontSize: 11,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: 4,
            textAlign: 'right',
          }}>The Bride</p>
          <h2 className="name-display" style={{ textAlign: 'right' }}>{brideName}</h2>
          <p className="body-text" style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'right' }}>
            Putri dari Bapak ____________ dan Ibu ____________
          </p>
        </div>
      </div>
    </section>
  )
}
