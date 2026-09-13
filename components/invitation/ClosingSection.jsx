'use client'
import { useState } from 'react'
import SectionBackground from './SectionBackground'

export default function ClosingSection({ id, groomName, brideName, settings }) {
  const [giftOpen, setGiftOpen] = useState(false)
  const [copiedBank, setCopiedBank] = useState(null)

  const closingBg = settings?.closingBgPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'

  const copyToClipboard = (text, bankKey) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBank(bankKey)
      setTimeout(() => setCopiedBank(null), 2500)
    })
  }

  return (
    <section id={id} className="section" style={{ background: '#000', overflowY: 'auto' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={closingBg}
        settings={settings}
        brightnessMultiplier={0.7}
        position="center"
      />

      <div
        className="section-content"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '60px 24px',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <p className="label-gold" style={{ letterSpacing: '0.3em', marginBottom: 16 }}>
          ✦ DOA & UNGKAPAN TERIMA KASIH ✦
        </p>

        {/* Ayat Suci / Blessing Quote */}
        <div
          style={{
            borderLeft: '2px solid rgba(241,193,147,0.4)',
            borderRight: '2px solid rgba(241,193,147,0.4)',
            padding: '24px 20px',
            margin: '0 0 32px',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
          }}
        >
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontStyle: 'italic',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 14px',
            }}
          >
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
          </p>
          <span
            style={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#F1C193',
            }}
          >
            QS. Ar-Rum : 21
          </span>
        </div>

        <p
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.88rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.88)',
            maxWidth: 520,
            margin: '0 auto 28px',
          }}
        >
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi lembaran baru perjalanan hidup kami.
        </p>

        {/* Digital Gift / Wedding Gift Button */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => setGiftOpen(!giftOpen)}
            className="btn-gold"
            style={{
              padding: '14px 32px',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              color: '#F1C193',
              background: 'rgba(241, 193, 147, 0.15)',
              border: '1px solid rgba(241, 193, 147, 0.5)',
              borderRadius: 30,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 16px rgba(241, 193, 147, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 0.25s ease',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>🎁</span>
            <span
              style={{
                color: '#F1C193',
                fontWeight: 600,
                textTransform: 'uppercase',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                letterSpacing: '0.1em',
              }}
            >
              {giftOpen ? 'Tutup Amplop Digital' : 'Kirim Amplop Digital'}
            </span>
          </button>
        </div>

        {/* Gift Card Accordion/Modal */}
        {giftOpen && (
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'rgba(20,15,12,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(241,193,147,0.25)',
              borderRadius: 16,
              padding: '24px 20px',
              marginBottom: 36,
              textAlign: 'left',
              animation: 'fadeInUp 0.5s ease forwards',
            }}
          >
            <h4
              style={{
                fontFamily: '"Playfair Display", serif',
                color: '#F1C193',
                fontSize: '1.2rem',
                margin: '0 0 8px',
                textAlign: 'center',
              }}
            >
              Tanda Kasih Digital
            </h4>
            <p
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Bagi keluarga & sahabat yang ingin memberikan tanda kasih secara cashless:
            </p>

            {/* Bank Card 1 */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '16px',
                marginBottom: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: '#F1C193', letterSpacing: '0.1em', fontWeight: 600 }}>BANK BCA</span>
                <p style={{ margin: '4px 0', fontSize: 16, letterSpacing: '0.1em', fontFamily: 'monospace', color: '#fff' }}>
                  7820491823
                </p>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>a.n Muhammad Irsyad</span>
              </div>
              <button
                onClick={() => copyToClipboard('7820491823', 'bca')}
                style={{
                  background: copiedBank === 'bca' ? '#2e7d32' : 'rgba(241,193,147,0.15)',
                  color: copiedBank === 'bca' ? '#fff' : '#F1C193',
                  border: '1px solid rgba(241,193,147,0.4)',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {copiedBank === 'bca' ? '✓ Tersalin' : 'Salin Rek'}
              </button>
            </div>

            {/* Bank Card 2 */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: '#F1C193', letterSpacing: '0.1em', fontWeight: 600 }}>BANK MANDIRI</span>
                <p style={{ margin: '4px 0', fontSize: 16, letterSpacing: '0.1em', fontFamily: 'monospace', color: '#fff' }}>
                  1480029381920
                </p>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>a.n Adisty Vana Lestari</span>
              </div>
              <button
                onClick={() => copyToClipboard('1480029381920', 'mandiri')}
                style={{
                  background: copiedBank === 'mandiri' ? '#2e7d32' : 'rgba(241,193,147,0.15)',
                  color: copiedBank === 'mandiri' ? '#fff' : '#F1C193',
                  border: '1px solid rgba(241,193,147,0.4)',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {copiedBank === 'mandiri' ? '✓ Tersalin' : 'Salin Rek'}
              </button>
            </div>
          </div>
        )}

        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: '#F1C193',
            margin: '0 0 8px',
            letterSpacing: '0.04em',
          }}
        >
          {groomName} &amp; {brideName}
        </h3>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 30,
          }}
        >
          #IrsyAdoreAdisty • 11.11.2026
        </p>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, width: '100%' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
            DIGITAL WEDDING INVITATION • MUARA TEWEH
          </p>
        </footer>
      </div>
    </section>
  )
}
