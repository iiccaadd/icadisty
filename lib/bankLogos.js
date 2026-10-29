// Simplified brand wordmarks (brand colours) for the bank/e-wallet shown on the gift card.
// shortcut: hand-drawn wordmarks, not the official artwork; replace with official SVGs if exact logos are needed
const LOGOS = [
  { match: /MANDIRI/, text: 'mandiri', color: '#003D79', bar: '#FCB017' },
  { match: /SEA\s?BANK/, text: 'SeaBank', color: '#F4511E' },
  { match: /\bBCA\b/, text: 'BCA', color: '#0060AF' },
  { match: /\bBNI\b/, text: 'BNI', color: '#F15A22', bar: '#00796B' },
  { match: /\bBRI\b/, text: 'BRI', color: '#00529C', bar: '#F37021' },
  { match: /\bBSI\b|SYARIAH INDONESIA/, text: 'BSI', color: '#00A39D', bar: '#8DC63F' },
  { match: /CIMB/, text: 'CIMB', color: '#EC1C24', bar: '#7A1F1F' },
  { match: /JAGO/, text: 'jago', color: '#F6A800' },
  { match: /DANA/, text: 'DANA', color: '#118EEA' },
  { match: /GO-?PAY/, text: 'gopay', color: '#00AED6' },
  { match: /\bOVO\b/, text: 'OVO', color: '#4C3494' },
  { match: /SHOPEE/, text: 'ShopeePay', color: '#EE4D2D' },
]

export function bankLogo(name) {
  const upper = String(name || '').toUpperCase()
  return LOGOS.find((l) => l.match.test(upper)) || null
}
