const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

// "26/06/2026" or "2026-06-26" -> "Juni 2026"; anything else (e.g. "2020", "Februari 2026") is shown as typed
export function formatStoryDate(value) {
  const s = String(value || '').trim()
  const dmy = s.match(/^\d{1,2}[/.-](\d{1,2})[/.-](\d{4})$/)
  const ymd = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/)
  const [month, year] = dmy ? [dmy[1], dmy[2]] : ymd ? [ymd[2], ymd[1]] : []
  return BULAN[month - 1] ? `${BULAN[month - 1]} ${year}` : s
}

// "2026-11-11T07:00" -> "Rabu, 11 November 2026"
export function formatWeddingDate(value) {
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}


// Fills {nama} and {link} (any case, every occurrence) in the WhatsApp template
export function fillWaMessage(template, name, link) {
  return String(template || '').replace(/\{nama\}/gi, name || '').replace(/\{link\}/gi, link || '')
}

// Crop/pan for a cover-fitted photo: posX/posY 0-100 (%), zoom 1-3; missing values = centered, no zoom
function framePos({ posX, posY, zoom } = {}) {
  const clamp = (v, min, max, d) => (Number.isFinite(+v) && v !== '' && v != null ? Math.min(max, Math.max(min, +v)) : d)
  return { x: clamp(posX, 0, 100, 50), y: clamp(posY, 0, 100, 50), z: clamp(zoom, 1, 3, 1) }
}

export function photoFrameStyle(pos) {
  const { x, y, z } = framePos(pos)
  return { objectFit: 'cover', objectPosition: `${x}% ${y}%`, transform: `scale(${z})`, transformOrigin: `${x}% ${y}%` }
}

// Source rectangle (image pixels) that photoFrameStyle shows in a frame of the given width/height ratio
export function photoCropRect(imgW, imgH, aspect, pos) {
  const { x, y, z } = framePos(pos)
  // Work in image pixels: the cover-fitted frame is fw x fh, then zoom z keeps the point at (x%, y%) fixed
  const fw = Math.min(imgW, imgH * aspect)
  const fh = fw / aspect
  const w = fw / z
  const h = fh / z
  const left = (imgW - fw) * x / 100 + (fw - w) * x / 100
  const top = (imgH - fh) * y / 100 + (fh - h) * y / 100
  return { sx: left, sy: top, sw: w, sh: h }
}
