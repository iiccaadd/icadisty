const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

// "Adisty Vana Lestari, S.Pd., M.Pd." -> { name: 'Adisty Vana Lestari', degree: 'S.Pd., M.Pd.' }
export function splitName(full) {
  const [name, ...degrees] = String(full || '').split(',')
  return { name: name.trim(), degree: degrees.map((d) => d.trim()).filter(Boolean).join(', ') }
}

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

