'use client'
import { useState, useMemo } from 'react'
import SectionBackground from './SectionBackground'
import CoupleName from './CoupleName'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'

export default function ClosingSection({ id, groomName, brideName, settings }) {
  const [giftOpen, setGiftOpen] = useState(false)
  const [copiedBank, setCopiedBank] = useState(null)

  const effectiveSettings = settings || DEFAULT_SETTINGS
  const closingBg = effectiveSettings?.closingBgPhoto || DEFAULT_SETTINGS.closingBgPhoto

  const banks = useMemo(() => {
    if (Array.isArray(effectiveSettings?.bankAccounts) && effectiveSettings.bankAccounts.length > 0) {
      return effectiveSettings.bankAccounts
    }
    return DEFAULT_SETTINGS.bankAccounts || []
  }, [effectiveSettings])

  const copyToClipboard = (text, bankKey) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBank(bankKey)
      setTimeout(() => setCopiedBank(null), 2500)
    })
  }

  return (
    <section id={id} className="section" style={{ background: '#000' }}>
      {/* Full-bleed Photo Background */}
      <SectionBackground
        photo={closingBg}
        settings={settings}
        brightnessMultiplier={0.7}
        position="center"
      />

      <div className="section-content">
        <p className="label-gold">✦ Doa &amp; Ungkapan Terima Kasih ✦</p>

        {/* Ayat Suci / Blessing Quote */}
        <div className="closing-quote">
          <p className="quote-text">
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
          </p>
          <span className="label-gold">QS. Ar-Rum : 21</span>
        </div>

        <p className="body-text">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi lembaran baru perjalanan hidup kami.
        </p>

        {/* Digital Gift / Wedding Gift Button */}
        <button onClick={() => setGiftOpen(!giftOpen)} className="btn-gold" aria-expanded={giftOpen}>
          {giftOpen ? 'Tutup Amplop Digital' : 'Kirim Amplop Digital'}
        </button>

        {/* Gift Card Accordion/Modal */}
        {giftOpen && (
          <div className="gift-card">
            <h4>Tanda Kasih Digital</h4>
            <p className="caption-text">
              Bagi keluarga &amp; sahabat yang ingin memberikan tanda kasih secara cashless:
            </p>

            {/* Dynamic Bank Cards */}
            {banks.map((bank, bIdx) => {
              const isCopied = copiedBank === bIdx
              return (
                <div key={bank.id || bIdx} className="bank-row">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span className="label-gold" style={{ display: 'block' }}>{bank.bankName || 'BANK'}</span>
                    <p className="bank-number">{bank.accountNumber}</p>
                    {bank.accountHolder && (
                      <span className="caption-text" style={{ display: 'block', wordBreak: 'break-word' }}>
                        a.n {bank.accountHolder}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bank.accountNumber, bIdx)}
                    className={`bank-copy ${isCopied ? 'copied' : ''}`}
                  >
                    {isCopied ? '✓ Tersalin' : 'Salin Rek'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: 32, '--name-chars': Math.max(groomName.length, brideName.length) }}>
          <CoupleName fullName={groomName} as="h3" />
          <span className="amp">&amp;</span>
          <CoupleName fullName={brideName} as="h3" />
        </div>
        <p className="caption-text" style={{ letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          #IrsyAdoreAdisty • 11.11.2026
        </p>

        <footer className="closing-footer">
          DIGITAL WEDDING INVITATION • MUARA TEWEH
        </footer>
      </div>
    </section>
  )
}
