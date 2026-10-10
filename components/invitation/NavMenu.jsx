'use client'
import { useState } from 'react'
import { SECTIONS } from '@/lib/defaultSettings'


export default function NavMenu({ order }) {
  const [open, setOpen] = useState(false)
  const menuItems = order.map((id, i) => ({
    num: String(i + 1).padStart(2, '0'),
    label: SECTIONS.find((x) => x.id === id).label,
    href: '#' + id,
  }))

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
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
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
        Pilih menu di atas untuk menuju bagian undangan.
      </p>
    </nav>
  )
}
