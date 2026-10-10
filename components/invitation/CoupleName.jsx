'use client'
import BlurText from './BlurText'

// Full name with degrees on one line; `blur` passes BlurText animation props
export default function CoupleName({ fullName, as: Tag = 'div', blur }) {
  const text = String(fullName || '').trim()

  return (
    <Tag className="couple-name">
      {blur ? (
        <BlurText {...blur} text={text} as="span" className="name" style={{ justifyContent: 'center', flexWrap: 'nowrap' }} />
      ) : (
        <span className="name">{text}</span>
      )}
    </Tag>
  )
}
