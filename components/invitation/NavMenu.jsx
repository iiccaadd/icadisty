'use client'
import { useState } from 'react'

const menuItems = [
  { num: '01', label: 'COVER', href: '#opening' },
  { num: '02', label: 'THE GROOM', href: '#groom' },
  { num: '03', label: 'THE BRIDE', href: '#bride' },
  { num: '04', label: 'OUR STORY', href: '#lovestory' },
  { num: '05', label: 'SPECIAL EVENTS', href: '#events' },
  { num: '06', label: 'COUNTDOWN', href: '#countdown' },
  { num: '07', label: 'MOMENTS', href: '#gallery' },
  { num: '08', label: 'RSVP & WISHES', href: '#rsvp' },
  { num: '09', label: 'WEDDING GIFT', href: '#closing' },
]

export default function NavMenu() {
  const [open, setOpen] = useState(false)

  const handleLink = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav-menu ${open ? 'open' : ''}`}>
      {/* Hamburger / X Toggle */}
      <button
        className="nav-menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Menu Items */}
      <ul className="nav-menu-items">
        {menuItems.map((item, i) => (
          <li key={i} className="nav-menu-item">
            <a href={item.href} onClick={(e) => handleLink(e, item.href)}>
              <span className="menu-num">{item.num} |</span>
              <span className="menu-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Caption */}
      <p className="nav-menu-caption">
        Select one of the menus above to navigate.
      </p>
    </nav>
  )
}
