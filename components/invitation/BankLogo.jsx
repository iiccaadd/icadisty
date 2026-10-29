import { bankLogo } from '@/lib/bankLogos'

// White chip so dark logos stay readable on the dark gift card; renders nothing for unknown banks
export default function BankLogo({ name }) {
  const logo = bankLogo(name)
  if (!logo) return null
  return (
    <svg className="bank-logo" viewBox="0 0 72 40" role="img" aria-label={name}>
      <rect width="72" height="40" rx="8" fill="#fff" />
      <text
        x="36"
        y={logo.bar ? 22 : 26}
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="16"
        fill={logo.color}
        textLength={Math.min(56, logo.text.length * 10)}
        lengthAdjust="spacingAndGlyphs"
      >
        {logo.text}
      </text>
      {logo.bar && <rect x="14" y="29" width="44" height="4" rx="2" fill={logo.bar} />}
    </svg>
  )
}
