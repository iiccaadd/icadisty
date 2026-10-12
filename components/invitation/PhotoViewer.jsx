'use client'
import { useEffect, useState } from 'react'
import { photoCropRect } from '@/lib/format'

const FRAME_ASPECT = 290 / 380 // .gallery-stack-wrapper / .photo-viewer-frame

// Full-screen view of the photo as framed in the gallery, with prev/next and download of that same crop
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

  // Download the admin crop cut from the original at its native resolution (no upscaling);
  // cross-origin hosts without CORS just open the original in a new tab to save from there
  const download = async () => {
    setDownloading(true)
    try {
      const res = await fetch(photo.src, { mode: 'cors' })
      if (!res.ok) throw new Error(String(res.status))
      const bitmap = await createImageBitmap(await res.blob())
      const { sx, sy, sw, sh } = photoCropRect(bitmap.width, bitmap.height, FRAME_ASPECT, photo.crop)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(sw)
      canvas.height = Math.round(sh)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
      bitmap.close()
      const blob = await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/jpeg', 0.95))
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `Irsyad-Adisty-${String(index + 1).padStart(2, '0')}.jpg`
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

      {/* Same frame, position and zoom as the gallery card (set in admin) */}
      <div className="photo-viewer-frame">
        <img src={photo.src} alt={photo.alt} className="photo-viewer-img" style={photo.frame} />
      </div>
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
