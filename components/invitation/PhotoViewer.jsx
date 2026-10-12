'use client'
import { useEffect, useState } from 'react'

// Full-screen view of the original (uncropped) photo with prev/next and download
export default function PhotoViewer({ photos, index, onIndexChange, onClose }) {
  const [downloading, setDownloading] = useState(false)
  const photo = photos[index]
  const go = (delta) => onIndexChange((index + delta + photos.length) % photos.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Download the original file; cross-origin hosts without CORS just open it in a new tab to save from there
  const download = async () => {
    setDownloading(true)
    try {
      const res = await fetch(photo.src, { mode: 'cors' })
      if (!res.ok) throw new Error(String(res.status))
      const blob = await res.blob()
      const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `Irsyad-Adisty-${String(index + 1).padStart(2, '0')}.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch {
      window.open(photo.src, '_blank', 'noopener')
    } finally {
      setDownloading(false)
    }
  }

  if (!photo) return null

  return (
    <div
      className="photo-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || `Foto ${index + 1}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="photo-viewer-bar">
        <span className="slice-counter">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </span>
        <button type="button" className="photo-viewer-icon" onClick={onClose} aria-label="Tutup">
          ×
        </button>
      </div>

      <img src={photo.src} alt={photo.alt} className="photo-viewer-img" />
      {photo.title && <p className="photo-viewer-caption">{photo.title}</p>}

      <div className="photo-viewer-bar">
        <button type="button" className="slice-nav-btn" onClick={() => go(-1)} aria-label="Foto sebelumnya">‹</button>
        <button type="button" className="btn btn-gold-outline" onClick={download} disabled={downloading}>
          {downloading ? 'Mengunduh...' : 'Unduh Foto'}
        </button>
        <button type="button" className="slice-nav-btn" onClick={() => go(1)} aria-label="Foto berikutnya">›</button>
      </div>
    </div>
  )
}
