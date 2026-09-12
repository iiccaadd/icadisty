'use client'

// Romantic aesthetic wedding photo collection
const photos = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    alt: 'Irsyad & Adisty Prewedding 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
    alt: 'Irsyad & Adisty Prewedding 2',
  },
  {
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop',
    alt: 'Irsyad & Adisty Prewedding 3',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
    alt: 'Irsyad & Adisty Prewedding 4',
  },
  {
    src: 'https://images.unsplash.com/photo-1519225429813-05b6300958a2?q=80&w=600&auto=format&fit=crop',
    alt: 'Irsyad & Adisty Prewedding 5',
  },
  {
    src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop',
    alt: 'Irsyad & Adisty Prewedding 6',
  },
]

export default function GallerySection({ id }) {
  return (
    <section id={id} className="section" style={{ background: '#000', overflowY: 'auto' }}>
      <div className="section-bg" style={{
        background: 'linear-gradient(180deg, #000 0%, #050200 100%)',
      }} />
      <div className="overlay-bottom" />

      <div className="section-content" style={{
        justifyContent: 'flex-end',
        padding: '0 0 60px',
        gap: 20,
      }}>
        <div style={{ padding: '0 28px' }}>
          <p className="label-gold">✦ Our Moments ✦</p>
          <h2 className="section-heading" style={{ marginTop: 4 }}>Gallery</h2>
        </div>

        {/* Horizontal scroll strip */}
        <div className="gallery-strip no-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 28px' }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              className="gallery-strip-item"
              style={{
                flexShrink: 0,
                width: 260,
                height: 380,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(241, 193, 147, 0.2)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
