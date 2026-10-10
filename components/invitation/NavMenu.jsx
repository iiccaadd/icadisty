'use client'
import { useState } from 'react'

const menuItems = [
  { num: '01', label: 'Sampul', href: '#opening' },
  { num: '02', label: 'Mempelai Pria', href: '#groom' },
  { num: '03', label: 'Mempelai Wanita', href: '#bride' },
  { num: '04', label: 'Kisah Cinta', href: '#lovestory' },
  { num: '05', label: 'Waktu & Lokasi', href: '#events' },
  { num: '06', label: 'Hitung Mundur', href: '#countdown' },
  { num: '07', label: 'Momen', href: '#gallery' },
  { num: '08', label: 'RSVP & Ucapan', href: '#rsvp' },
  { num: '09', label: 'Amplop Digital', href: '#closing' },
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
