'use client'
import BlurText from './BlurText'
import { splitName } from '@/lib/format'

// Name on one line with academic degrees on a smaller line below; `blur` passes BlurText animation props
export default function CoupleName({ fullName, as: Tag = 'div', blur }) {
  const { name, degree } = splitName(fullName)

  return (
    <Tag className="couple-name">
      {blur ? (
        <BlurText {...blur} text={name} as="span" className="name" style={{ justifyContent: 'center' }} />
      ) : (
        <span className="name">{name}</span>
      )}
      {degree && <span className="degree">{degree}</span>}
    </Tag>
  )
}
