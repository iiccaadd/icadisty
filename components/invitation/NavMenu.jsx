'use client'
import { useState } from 'react'

const menuItems = [
  { label: 'Home', href: '#opening' },
  { label: 'Groom & Bride', href: '#couple' },
  { label: 'Love Story', href: '#lovestory' },
  { label: 'Event Details', href: '#events' },
  { label: 'RSVP & Wishes', href: '#rsvp' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Wedding Gift', href: '#closing' },
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
              {item.label}
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
