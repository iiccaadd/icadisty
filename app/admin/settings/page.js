'use client'

import { useState, useEffect, useRef } from 'react'
import { DEFAULT_SETTINGS, getEvents, SECTIONS, getSectionOrder } from '@/lib/defaultSettings'
import { photoFrameStyle } from '@/lib/format'

const MAX_PHOTO_SIDE = 2000

// Resize to MAX_PHOTO_SIDE and re-encode as JPEG; keeps the original if that is already smaller.
// shortcut: PNG transparency becomes black and GIF animation is skipped, fine for wedding photos
async function compressImage(file) {
  if (file.type === 'image/gif') return file
  try {
    const bitmap = await createImageBitmap(file) // applies EXIF rotation from phone cameras
    const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file // browser can't decode it (e.g. HEIC): upload as-is, server validates the type
  }
}

function UploadButton({ onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const original = e.target.files?.[0]
    e.target.value = ''
    if (!original) return
    setUploading(true)
    try {
      const file = await compressImage(original)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: file.type }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal menyiapkan upload')

      // Same request shape supabase-js uploadToSignedUrl sends
      const form = new FormData()
      form.append('cacheControl', '3600')
      form.append('', file)
      const up = await fetch(json.signedUrl, { method: 'PUT', body: form })
      if (!up.ok) throw new Error((await up.json().catch(() => ({}))).message || 'Upload gagal (maks. 10 MB)')

      onUploaded(json.publicUrl)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} hidden />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn-admin-outline"
        style={{ marginTop: 6, padding: '6px 12px', fontSize: 11 }}
      >
        {uploading ? '⏳ Mengunggah...' : '📤 Upload Foto dari Perangkat'}
      </button>
    </>
  )
}

const PHOTO_PRESETS = {
  groom: [
    { label: 'Groom Classic Dark', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
    { label: 'Groom Elegant Suit', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' },
    { label: 'Groom Warm Lighting', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
  ],
  bride: [
    { label: 'Bride Warm Elegant', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
    { label: 'Bride White Veil', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop' },
    { label: 'Bride Golden Hour', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop' },
  ],
  heroBg: [
    { label: 'Night Romantic Lights', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Cinematic Sunset Glow', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Floral Royal Arch', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop' },
  ],
  groomBg: [
    { label: 'Groom Classic Dark', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Groom Warm Lighting', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Groom Elegant Tuxedo', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop' },
  ],
  brideBg: [
    { label: 'Bride Warm Veil', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Bride Golden Hour', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Bride White Lace', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop' },
  ],
  coupleBg: [
    { label: 'Romantic Silhouette', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Candlelight Shadows', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Golden Hour Embrace', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop' },
  ],
  loveStoryBg: [
    { label: 'Holding Hands Walk', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Sunset Forest Trail', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Warm Evening Whisper', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
  ],
  eventsBg: [
    { label: 'Cathedral / Hall Arch', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Evening Candle Altar', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Starry Mosque / Venue', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop' },
  ],
  countdownBg: [
    { label: 'Starry Venue Lights', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Warm Bokeh Lamps', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Golden Sunset Aura', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1600&auto=format&fit=crop' },
  ],
  galleryBg: [
    { label: 'Canopy Fairy Lights', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Moody Night Glow', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Golden Amber Bokeh', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop' },
  ],
  rsvpBg: [
    { label: 'Sparkler Celebration', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Intimate Dinner Lights', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
    { label: 'Warm Party Ambience', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
  ],
  closingBg: [
    { label: 'Luxury Lanterns Night', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Sparkler Celebration', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Gentle Candle Prayer', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop' },
  ],
  galleryMoment: [
    { label: 'Cincin & Bunga', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop' },
    { label: 'Genggam Tangan', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop' },
    { label: 'Pelukan Sunset', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' },
    { label: 'Lentera Malam', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop' },
    { label: 'Senyum Bahagia', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop' },
    { label: 'Akad Khidmat', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop' },
  ],
}

const SCROLL_SEGMENTS = [
  {
    key: 'heroBgPhoto',
    num: '01',
    badge: 'SEGMEN 01 • COVER & HERO',
    title: 'Cover / Pembuka Undangan',
    desc: 'Latar belakang utama saat tamu pertama kali membuka undangan digital.',
    presetKey: 'heroBg',
    defaultUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'groomBgPhoto',
    num: '02',
    badge: 'SEGMEN 02 • THE GROOM',
    title: 'Adegan Mempelai Pria (The Groom)',
    desc: 'Latar belakang layar penuh adegan mempelai pria & kartu 3D berputar.',
    presetKey: 'groomBg',
    defaultUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'brideBgPhoto',
    num: '03',
    badge: 'SEGMEN 03 • THE BRIDE',
    title: 'Adegan Mempelai Wanita (The Bride)',
    desc: 'Latar belakang layar penuh adegan mempelai wanita & kartu 3D berputar.',
    presetKey: 'brideBg',
    defaultUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'loveStoryBgPhoto',
    num: '04',
    badge: 'SEGMEN 04 • OUR JOURNEY',
    title: 'Kisah Cinta (Love Story)',
    desc: 'Latar belakang layar penuh di balik linimasa cerita cinta pengantin.',
    presetKey: 'loveStoryBg',
    defaultUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'eventsBgPhoto',
    num: '05',
    badge: 'SEGMEN 05 • SAVE THE DATE',
    title: 'Waktu & Lokasi (Akad & Resepsi)',
    desc: 'Latar belakang di balik kartu jadwal acara dan petunjuk Google Maps.',
    presetKey: 'eventsBg',
    defaultUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'countdownBgPhoto',
    num: '06',
    badge: 'SEGMEN 06 • COUNTDOWN',
    title: 'Hitung Mundur Waktu & Doa',
    desc: 'Latar belakang di balik jam hitung mundur dan kutipan ayat suci QS Ar-Rum.',
    presetKey: 'countdownBg',
    defaultUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'galleryBgPhoto',
    num: '07',
    badge: 'SEGMEN 07 • OUR MOMENTS',
    title: 'Galeri Momen 3D Perspective Slice',
    desc: 'Latar belakang sinematik di balik carousel foto 3D slice berputar.',
    presetKey: 'galleryBg',
    defaultUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'rsvpBgPhoto',
    num: '08',
    badge: 'SEGMEN 08 • RSVP & WISHES',
    title: 'Konfirmasi Kehadiran & Doa Tamu',
    desc: 'Latar belakang di balik form kehadiran dan kartu daftar ucapan tamu.',
    presetKey: 'rsvpBg',
    defaultUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'closingBgPhoto',
    num: '09',
    badge: 'SEGMEN 09 • DIGITAL GIFT & CLOSING',
    title: 'Penutup, Doa Restu & Amplop Digital',
    desc: 'Latar belakang penutup di balik tanda kasih amplop digital dan ucapan terima kasih.',
    presetKey: 'closingBg',
    defaultUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('photos') // photos | lovestory | moments | banks | background
  const [previewCopiedIndex, setPreviewCopiedIndex] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings?t=' + Date.now(), { cache: 'no-store' })
      const json = await res.json()
      if (json.data) {
        setSettings(json.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setToast('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        if (json.data) setSettings(json.data)
        setToast('✓ Pengaturan foto dan latar berhasil disimpan ke cloud database!')
        setTimeout(() => setToast(''), 4000)
      } else {
        alert(json.error || 'Gagal menyimpan pengaturan')
      }
    } catch (e) {
      alert('Terjadi kesalahan saat menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const getMoments = () => {
    if (Array.isArray(settings?.galleryMoments) && settings.galleryMoments.length > 0) {
      return settings.galleryMoments
    }
    return [
      {
        id: 1,
        photo: settings?.moment1Photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment1Title || 'Pertama Bertemu',
        date: settings?.moment1Date || 'November 2020',
        desc: settings?.moment1Desc || 'Sebuah perjumpaan tak terduga di Muara Teweh yang menjadi awal mula lembaran kisah kasih kami.',
      },
      {
        id: 2,
        photo: settings?.moment2Photo || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment2Title || 'Merajut Janji',
        date: settings?.moment2Date || 'Agustus 2022',
        desc: settings?.moment2Desc || 'Melangkah bersama melewati ragam cerita, bertumbuh dalam cinta, saling menjaga dan menguatkan.',
      },
      {
        id: 3,
        photo: settings?.moment3Photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment3Title || 'Restu Keluarga',
        date: settings?.moment3Date || 'Mei 2024',
        desc: settings?.moment3Desc || 'Dua keluarga besar bersatu dalam doa dan restu yang tulus menyongsong mahligai suci.',
      },
      {
        id: 4,
        photo: settings?.moment4Photo || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
        title: settings?.moment4Title || 'Hari Bahagia',
        date: settings?.moment4Date || '11 November 2026',
        desc: 'Masjid H. Muhammad Sidik Islamic Center Muara Teweh, mengikat janji suci seumur hidup.',
      },
    ]
  }

  const updateMoment = (index, field, value) => {
    const list = [...getMoments()]
    list[index] = { ...list[index], [field]: value }
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
  }

  // Drag on the preview pans the photo: moving right shows more of the left side
  const dragMoment = (index, e) => {
    if (e.buttons !== 1) return
    const m = getMoments()[index]
    const rect = e.currentTarget.getBoundingClientRect()
    const clamp = (v) => Math.round(Math.min(100, Math.max(0, v)))
    const list = [...getMoments()]
    list[index] = {
      ...m,
      posX: clamp((m.posX ?? 50) - (e.movementX / rect.width) * 100),
      posY: clamp((m.posY ?? 50) - (e.movementY / rect.height) * 100),
    }
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
  }

  const addMomentSlot = () => {
    const list = [...getMoments()]
    const nextNum = list.length + 1
    list.push({
      id: Date.now(),
      photo: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
      title: `Kenangan 0${nextNum}`,
      date: '2026',
      desc: 'Momen berharga dalam perjalanan cinta kami.',
    })
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
  }

  const removeMomentSlot = (index) => {
    const list = [...getMoments()]
    if (list.length <= 1) {
      alert('Minimal harus ada 1 foto di dalam galeri!')
      return
    }
    list.splice(index, 1)
    setSettings((prev) => ({ ...prev, galleryMoments: list }))
  }

  const getLoveStories = () => {
    if (Array.isArray(settings?.loveStories) && settings.loveStories.length > 0) {
      return settings.loveStories
    }
    return DEFAULT_SETTINGS.loveStories || [
      { year: '2020', title: 'Pertama Bertemu', desc: 'Takdir mempertemukan kami di sebuah momen yang tak terlupakan.' },
      { year: '2021', title: 'Jatuh Cinta', desc: 'Dari pertemanan yang hangat, tumbuh rasa yang lebih dalam.' },
      { year: '2022', title: 'Menjalin Hubungan', desc: 'Kami memutuskan untuk bersama dan saling menjaga.' },
      { year: '2023', title: 'Bersama Keluarga', desc: 'Memperkenalkan satu sama lain kepada keluarga tercinta.' },
      { year: '2026', title: 'Menuju Pelaminan', desc: 'Dengan ridho Allah, kami siap melangkah ke jenjang yang lebih sakral.' },
    ]
  }

  const updateLoveStory = (index, field, value) => {
    const list = [...getLoveStories()]
    list[index] = { ...list[index], [field]: value }
    setSettings((prev) => ({ ...prev, loveStories: list }))
  }

  const addLoveStory = () => {
    const list = [...getLoveStories()]
    list.push({
      year: String(new Date().getFullYear()),
      title: 'Momen Indah',
      desc: 'Tuliskan sekelumit cerita perjalanan cinta di sini...',
    })
    setSettings((prev) => ({ ...prev, loveStories: list }))
  }

  const removeLoveStory = (index) => {
    const list = [...getLoveStories()]
    if (list.length <= 1) {
      alert('Minimal harus ada 1 momen perjalanan cinta!')
      return
    }
    list.splice(index, 1)
    setSettings((prev) => ({ ...prev, loveStories: list }))
  }

  const getBankAccounts = () => {
    if (Array.isArray(settings?.bankAccounts) && settings.bankAccounts.length > 0) {
      return settings.bankAccounts
    }
    return DEFAULT_SETTINGS.bankAccounts || [
      {
        id: 'bca',
        bankName: 'BANK BCA',
        accountNumber: '7820491823',
        accountHolder: 'Muhammad Irsyad',
      },
      {
        id: 'mandiri',
        bankName: 'BANK MANDIRI',
        accountNumber: '1480029381920',
        accountHolder: 'Adisty Vana Lestari',
      },
    ]
  }

  const updateBankAccount = (index, field, value) => {
    const list = [...getBankAccounts()]
    list[index] = { ...list[index], [field]: value }
    setSettings((prev) => ({ ...prev, bankAccounts: list }))
  }

  const addBankAccount = () => {
    const list = [...getBankAccounts()]
    list.push({
      id: 'bank_' + Date.now(),
      bankName: 'BANK BCA',
      accountNumber: '',
      accountHolder: '',
    })
    setSettings((prev) => ({ ...prev, bankAccounts: list }))
  }

  const removeBankAccount = (index) => {
    const list = [...getBankAccounts()]
    if (list.length <= 1) {
      alert('Minimal harus ada 1 nomor rekening atau dompet digital!')
      return
    }
    list.splice(index, 1)
    setSettings((prev) => ({ ...prev, bankAccounts: list }))
  }

  const updateEvent = (index, field, value) => {
    const list = [...getEvents(settings)]
    list[index] = { ...list[index], [field]: value }
    setSettings((prev) => ({ ...prev, events: list }))
  }

  const addEvent = () => {
    const list = [...getEvents(settings), { id: 'event_' + Date.now(), type: 'Acara', title: 'Nama Acara', date: '', time: '', venue: '', address: '', maps: '' }]
    setSettings((prev) => ({ ...prev, events: list }))
  }

  const removeEvent = (index) => {
    const list = [...getEvents(settings)]
    if (!confirm(`Hapus acara "${list[index].title || list[index].type || 'ini'}"? Klik Simpan Perubahan agar terhapus dari undangan.`)) return
    list.splice(index, 1)
    setSettings((prev) => ({ ...prev, events: list }))
  }

  const moveSection = (index, delta) => {
    const list = getSectionOrder(settings)
    const target = index + delta
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    setSettings((prev) => ({ ...prev, sectionOrder: list }))
  }

  const handlePreviewCopy = (text, idx) => {
    if (!text) return
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setPreviewCopiedIndex(idx)
        setTimeout(() => setPreviewCopiedIndex(null), 2000)
      }).catch(() => {
        setPreviewCopiedIndex(idx)
        setTimeout(() => setPreviewCopiedIndex(null), 2000)
      })
    } else {
      setPreviewCopiedIndex(idx)
      setTimeout(() => setPreviewCopiedIndex(null), 2000)
    }
  }

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const computeCountdown = () => {
    const targetStr = settings?.weddingDate || '2026-11-11T08:00'
    const target = new Date(targetStr)
    const diff = target - now
    if (isNaN(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--admin-muted)' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 16px' }} />
        <p>Memuat pengaturan foto dan latar portal guest...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#F1C193', margin: '0 0 4px' }}>
            Pengaturan Foto &amp; Latar Undangan
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Ubah foto pria, foto wanita, galeri momen 3D, foto latar cover, dan nuansa tema secara langsung
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-admin-outline"
          >
            👁️ Preview Undangan Tamu ↗
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-admin"
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {toast && (
        <div
          style={{
            background: 'rgba(46, 125, 50, 0.25)',
            border: '1px solid rgba(129, 199, 132, 0.5)',
            color: '#a5d6a7',
            padding: '12px 20px',
            borderRadius: 10,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('photos')}
          className={`btn-admin-outline ${activeTab === 'photos' ? 'active' : ''}`}
          style={{ background: activeTab === 'photos' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          💍 Data Mempelai &amp; Countdown
        </button>
        <button
          onClick={() => setActiveTab('lovestory')}
          className={`btn-admin-outline ${activeTab === 'lovestory' ? 'active' : ''}`}
          style={{ background: activeTab === 'lovestory' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          📖 Cerita Cinta (Love Story)
        </button>
        <button
          onClick={() => setActiveTab('moments')}
          className={`btn-admin-outline ${activeTab === 'moments' ? 'active' : ''}`}
          style={{ background: activeTab === 'moments' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          🎞️ Galeri Foto &amp; Momen (Stack 3D)
        </button>
        <button
          onClick={() => setActiveTab('banks')}
          className={`btn-admin-outline ${activeTab === 'banks' ? 'active' : ''}`}
          style={{ background: activeTab === 'banks' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          💳 Rekening &amp; Amplop Digital
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`btn-admin-outline ${activeTab === 'events' ? 'active' : ''}`}
          style={{ background: activeTab === 'events' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          📅 Waktu &amp; Lokasi
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`btn-admin-outline ${activeTab === 'order' ? 'active' : ''}`}
          style={{ background: activeTab === 'order' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          ↕️ Urutan Section
        </button>
        <button
          onClick={() => setActiveTab('background')}
          className={`btn-admin-outline ${activeTab === 'background' ? 'active' : ''}`}
          style={{ background: activeTab === 'background' ? 'rgba(241, 193, 147, 0.2)' : 'transparent' }}
        >
          🎨 Foto Latar &amp; Nuansa Tema
        </button>
      </div>

      {/* TAB 1: DATA MEMPELAI & COUNTDOWN */}
      {activeTab === 'photos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: Tanggal Acara & Countdown Timer */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 4px', fontSize: '1.25rem' }}>
                  ⏳ Tanggal &amp; Waktu Acara (Countdown Timer)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Tanggal dan jam ini otomatis menggerakkan jam hitung mundur di segmen <strong>Countdown</strong> portal tamu.
                </p>
              </div>

              {/* Live Ticker Display */}
              {(() => {
                const cd = computeCountdown()
                return (
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      background: 'rgba(0,0,0,0.6)',
                      padding: '8px 16px',
                      borderRadius: 12,
                      border: '1px solid rgba(241, 193, 147, 0.3)',
                    }}
                  >
                    {[
                      { val: cd.days, label: 'Hari' },
                      { val: cd.hours, label: 'Jam' },
                      { val: cd.minutes, label: 'Mnt' },
                      { val: cd.seconds, label: 'Dtk' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ textAlign: 'center', minWidth: 42 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 18, color: '#F1C193', fontWeight: 700, display: 'block' }}>
                          {String(item.val).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--admin-muted)', textTransform: 'uppercase' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            <div style={{ maxWidth: 400 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                Tanggal &amp; Jam Mulai Acara (WIB)
              </label>
              <input
                type="datetime-local"
                value={settings?.weddingDate || '2026-11-11T08:00'}
                onChange={(e) => updateField('weddingDate', e.target.value)}
                className="admin-input"
                style={{ fontSize: 13, color: '#F1C193' }}
              />
            </div>
          </div>

          {/* Section: Nama di Cover & Section Awal */}
          {(() => {
            const fields = [
              { key: 'coverGroomName', label: 'Cover — Nama Pria' },
              { key: 'coverBrideName', label: 'Cover — Nama Wanita' },
              { key: 'heroGroomName', label: 'Section Awal — Nama Pria' },
              { key: 'heroBrideName', label: 'Section Awal — Nama Wanita' },
              { key: 'closingGroomName', label: 'Section Akhir — Nama Pria', fallback: 'heroGroomName' },
              { key: 'closingBrideName', label: 'Section Akhir — Nama Wanita', fallback: 'heroBrideName' },
            ]
            return (
              <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 4px', fontSize: '1.25rem' }}>
                  🏷️ Nama di Cover, Section Awal &amp; Akhir
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  <strong>Cover</strong> = halaman sebelum tombol &ldquo;Buka Undangan&rdquo;. <strong>Section Awal</strong> = halaman pertama setelah undangan dibuka. <strong>Section Akhir</strong> = penutup (Doa &amp; Terima Kasih); kosongkan agar sama dengan Section Awal.
                  Nama di sini terpisah dari Data Mempelai, jadi mengubah Nama Lengkap di bawah tidak mengubah nama ini.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  {fields.map((f) => (
                    <div key={f.key}>
                      <label htmlFor={f.key} style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                        {f.label}
                      </label>
                      <input
                        id={f.key}
                        type="text"
                        value={f.fallback ? settings?.[f.key] ?? '' : settings?.[f.key] ?? DEFAULT_SETTINGS[f.key]}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        placeholder={f.fallback ? settings?.[f.fallback] || DEFAULT_SETTINGS[f.fallback] : DEFAULT_SETTINGS[f.key]}
                        className="admin-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Section 2: Profil & Orang Tua Pria dan Wanita */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {/* Groom Card */}
            <div className="admin-card">
              <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
                🤵 Mempelai Pria (The Groom)
              </h3>

              {/* Nama Mempelai Pria */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Nama Lengkap Pria
                </label>
                <input
                  type="text"
                  value={settings?.groomName ?? 'Muhammad Irsyad'}
                  onChange={(e) => updateField('groomName', e.target.value)}
                  placeholder="Contoh: Muhammad Irsyad"
                  className="admin-input"
                />
              </div>

              {/* Nama Bapak Pria */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Nama Bapak / Ayah Pria
                </label>
                <input
                  type="text"
                  value={settings?.groomFather || ''}
                  onChange={(e) => updateField('groomFather', e.target.value)}
                  placeholder="Contoh: H. Ahmad Supriyadi"
                  className="admin-input"
                />
              </div>

              {/* Nama Ibu Pria */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Nama Ibu Pria
                </label>
                <input
                  type="text"
                  value={settings?.groomMother || ''}
                  onChange={(e) => updateField('groomMother', e.target.value)}
                  placeholder="Contoh: Hj. Siti Fatimah"
                  className="admin-input"
                />
              </div>

              {/* Teks Keluarga Preview */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 10, marginBottom: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 2 }}>
                  Tampilan Teks di Undangan:
                </span>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                  {settings?.groomFather && settings?.groomMother
                    ? `Putra dari Bapak ${settings.groomFather} dan Ibu ${settings.groomMother}`
                    : settings?.groomFather
                    ? `Putra dari Bapak ${settings.groomFather}`
                    : settings?.groomMother
                    ? `Putra dari Ibu ${settings.groomMother}`
                    : 'Putra dari Bapak ____________ dan Ibu ____________'}
                </p>
              </div>

              {/* URL Foto Pria */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                  URL Gambar Foto Pria (3D Card)
                </label>
                <input
                  type="text"
                  value={settings?.groomPhoto || ''}
                  onChange={(e) => updateField('groomPhoto', e.target.value)}
                  placeholder="https://..."
                  className="admin-input"
                />
                <UploadButton onUploaded={(url) => updateField('groomPhoto', url)} />
              </div>

              {/* Presets */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                  Pilihan Cepat (Presets):
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PHOTO_PRESETS.groom.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => updateField('groomPhoto', p.url)}
                      className="btn-admin-outline"
                      style={{ padding: '4px 8px', fontSize: 10 }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thumbnail Preview */}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 8 }}>
                  Preview Kartu 3D Pria:
                </span>
                <div
                  style={{
                    width: 150,
                    height: 200,
                    borderRadius: 20,
                    overflow: 'hidden',
                    margin: '0 auto',
                    border: '1px solid rgba(241, 193, 147, 0.4)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                    transform: 'perspective(600px) rotateY(-8deg) rotateZ(4deg)',
                  }}
                >
                  <img
                    src={settings?.groomPhoto}
                    alt="Preview Groom"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' }}
                  />
                </div>
              </div>
            </div>

            {/* Bride Card */}
            <div className="admin-card">
              <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
                👰 Mempelai Wanita (The Bride)
              </h3>

              {/* Nama Mempelai Wanita */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Nama Lengkap Wanita
                </label>
                <input
                  type="text"
                  value={settings?.brideName ?? 'Adisty Vana Lestari'}
                  onChange={(e) => updateField('brideName', e.target.value)}
                  placeholder="Contoh: Adisty Vana Lestari"
                  className="admin-input"
                />
              </div>

              {/* Nama Bapak Wanita */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Nama Bapak / Ayah Wanita
                </label>
                <input
                  type="text"
                  value={settings?.brideFather || ''}
                  onChange={(e) => updateField('brideFather', e.target.value)}
                  placeholder="Contoh: H. Bambang Irawan"
                  className="admin-input"
                />
              </div>

              {/* Nama Ibu Wanita */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                  Nama Ibu Wanita
                </label>
                <input
                  type="text"
                  value={settings?.brideMother || ''}
                  onChange={(e) => updateField('brideMother', e.target.value)}
                  placeholder="Contoh: Hj. Siti Rahmawati"
                  className="admin-input"
                />
              </div>

              {/* Teks Keluarga Preview */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 10, marginBottom: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 2 }}>
                  Tampilan Teks di Undangan:
                </span>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                  {settings?.brideFather && settings?.brideMother
                    ? `Putri dari Bapak ${settings.brideFather} dan Ibu ${settings.brideMother}`
                    : settings?.brideFather
                    ? `Putri dari Bapak ${settings.brideFather}`
                    : settings?.brideMother
                    ? `Putri dari Ibu ${settings.brideMother}`
                    : 'Putri dari Bapak ____________ dan Ibu ____________'}
                </p>
              </div>

              {/* URL Foto Wanita */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                  URL Gambar Foto Wanita (3D Card)
                </label>
                <input
                  type="text"
                  value={settings?.bridePhoto || ''}
                  onChange={(e) => updateField('bridePhoto', e.target.value)}
                  placeholder="https://..."
                  className="admin-input"
                />
                <UploadButton onUploaded={(url) => updateField('bridePhoto', url)} />
              </div>

              {/* Presets */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                  Pilihan Cepat (Presets):
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PHOTO_PRESETS.bride.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => updateField('bridePhoto', p.url)}
                      className="btn-admin-outline"
                      style={{ padding: '4px 8px', fontSize: 10 }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thumbnail Preview */}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 8 }}>
                  Preview Kartu 3D Wanita:
                </span>
                <div
                  style={{
                    width: 150,
                    height: 200,
                    borderRadius: 20,
                    overflow: 'hidden',
                    margin: '0 auto',
                    border: '1px solid rgba(241, 193, 147, 0.4)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                    transform: 'perspective(600px) rotateY(8deg) rotateZ(-4deg)',
                  }}
                >
                  <img
                    src={settings?.bridePhoto}
                    alt="Preview Bride"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CERITA CINTA (LOVE STORY) */}
      {activeTab === 'lovestory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top Panel: Description & Add Button */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 6px', fontSize: '1.25rem' }}>
                  📖 Linimasa Perjalanan Cinta (Our Journey / Love Story)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Total <strong>{getLoveStories().length} Momen Cerita</strong> tersusun. Tamu dapat melihat dan menggeser linimasa horizontal ini di segmen <em>Love Story</em>.
                </p>
              </div>

              <button
                onClick={addLoveStory}
                className="btn-admin"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px' }}
              >
                <span>➕</span>
                <span>Tambah Momen Cerita</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="admin-card" style={{ background: 'rgba(10, 6, 4, 0.85)', border: '1px solid rgba(241, 193, 147, 0.25)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F1C193', fontWeight: 600 }}>
                👁️ Live Preview Segmen Love Story (Tampilan Tamu)
              </span>
              <span style={{ fontSize: 11, color: 'var(--admin-muted)' }}>
                Geser linimasa horizontal ➔
              </span>
            </div>

            <div style={{ padding: '20px 24px', background: 'radial-gradient(ellipse at center, rgba(35,22,14,0.7) 0%, rgba(5,2,0,0.95) 100%)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontFamily: '"Metropolis", sans-serif', fontSize: 10, letterSpacing: '0.25em', color: '#F1C193', textTransform: 'uppercase', margin: '0 0 2px' }}>
                ✦ Our Journey ✦
              </p>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, color: '#F1C193', margin: '0 0 16px', fontWeight: 400 }}>
                Love Story
              </h2>

              <div
                style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 16,
                  paddingBottom: 12,
                }}
                className="no-scrollbar"
              >
                {getLoveStories().map((s, i) => (
                  <div
                    key={i}
                    style={{
                      flexShrink: 0,
                      width: 220,
                      background: 'rgba(18, 12, 8, 0.75)',
                      border: '1px solid rgba(241, 193, 147, 0.25)',
                      borderRadius: 14,
                      padding: '20px 16px',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 28,
                        color: 'rgba(241,193,147,0.85)',
                        display: 'block',
                        marginBottom: 6,
                      }}
                    >
                      {s.year || 'Tahun'}
                    </span>
                    <h4
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: 400,
                        margin: '0 0 6px',
                      }}
                    >
                      {s.title || 'Judul Momen'}
                    </h4>
                    <p
                      style={{
                        fontFamily: '"Metropolis", sans-serif',
                        fontSize: 12,
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {s.desc || 'Deskripsi cerita...'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editable Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {getLoveStories().map((story, idx) => (
              <div key={idx} className="admin-card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.1rem', fontWeight: 600 }}>
                    Momen #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => removeLoveStory(idx)}
                    className="btn-admin-outline"
                    style={{
                      padding: '4px 10px',
                      fontSize: 11,
                      borderColor: 'rgba(239, 83, 80, 0.4)',
                      color: '#ef5350',
                    }}
                    title="Hapus momen ini"
                  >
                    🗑️ Hapus
                  </button>
                </div>

                {/* Year Input */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Tahun / Periode Waktu
                  </label>
                  <input
                    type="text"
                    value={story.year || ''}
                    onChange={(e) => updateLoveStory(idx, 'year', e.target.value)}
                    placeholder="Contoh: 2020 atau Nov 2020"
                    className="admin-input"
                    style={{ fontSize: 14, fontWeight: 600, color: '#F1C193' }}
                  />
                </div>

                {/* Title Input */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Judul Momen
                  </label>
                  <input
                    type="text"
                    value={story.title || ''}
                    onChange={(e) => updateLoveStory(idx, 'title', e.target.value)}
                    placeholder="Contoh: Pertama Bertemu"
                    className="admin-input"
                    style={{ fontSize: 13 }}
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Deskripsi Kisah
                  </label>
                  <textarea
                    rows={3}
                    value={story.desc || ''}
                    onChange={(e) => updateLoveStory(idx, 'desc', e.target.value)}
                    placeholder="Ceritakan momen ini..."
                    className="admin-input"
                    style={{ fontSize: 12, lineHeight: 1.5 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Add Button */}
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <button
              onClick={addLoveStory}
              className="btn-admin-outline"
              style={{
                padding: '12px 28px',
                fontSize: 14,
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
                background: 'rgba(241, 193, 147, 0.08)',
              }}
            >
              ➕ Tambah Momen Cerita Baru
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: GALERI FOTO & MOMEN (STACK 3D) */}
      {activeTab === 'moments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top Control Panel: Stack Behavior & Add Button */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 6px', fontSize: '1.25rem' }}>
                  🎞️ Galeri Tumpukan Kartu 3D (React Bits Stack)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Total <strong>{getMoments().length} Slot Foto</strong> terpasang. Tamu dapat menggeser/men-drag kartu, mengklik, atau membiarkannya berputar otomatis.
                </p>
              </div>

              <button
                onClick={addMomentSlot}
                className="btn-admin"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px' }}
              >
                <span>➕</span>
                <span>Tambah Slot Gambar Baru</span>
              </button>
            </div>

            {/* Stack Behavior Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Autoplay toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings?.galleryAutoplay ?? true}
                  onChange={(e) => updateField('galleryAutoplay', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#F1C193' }}
                />
                <span style={{ fontSize: 13, color: '#fff' }}>Autoplay Kartu (Otomatis Berpindah)</span>
              </label>

              {/* Autoplay Delay */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--admin-muted)' }}>Durasi Transisi:</span>
                  <span style={{ fontSize: 12, color: '#F1C193', fontWeight: 600 }}>
                    {((settings?.galleryAutoplayDelay || 3500) / 1000).toFixed(1)} detik
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={8000}
                  step={500}
                  value={settings?.galleryAutoplayDelay || 3500}
                  onChange={(e) => updateField('galleryAutoplayDelay', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#F1C193' }}
                />
              </div>

              {/* Random Rotation toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings?.galleryRandomRotation ?? true}
                  onChange={(e) => updateField('galleryRandomRotation', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#F1C193' }}
                />
                <span style={{ fontSize: 13, color: '#fff' }}>Acak Kemiringan (Messy 3D Stack)</span>
              </label>
            </div>
          </div>

          {/* Grid of Dynamic Moment Slots */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {getMoments().map((moment, idx) => (
              <div key={moment.id || idx} className="admin-card" style={{ position: 'relative' }}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', fontSize: '1.1rem', fontWeight: 600 }}>
                    Foto #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => removeMomentSlot(idx)}
                    className="btn-admin-outline"
                    style={{
                      padding: '4px 10px',
                      fontSize: 11,
                      borderColor: 'rgba(239, 83, 80, 0.4)',
                      color: '#ef5350',
                    }}
                    title="Hapus slot foto ini"
                  >
                    🗑️ Hapus
                  </button>
                </div>

                {/* Photo URL */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    URL Gambar Foto
                  </label>
                  <input
                    type="text"
                    value={moment.photo || ''}
                    onChange={(e) => updateMoment(idx, 'photo', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="admin-input"
                    style={{ fontSize: 12 }}
                  />
                  <UploadButton onUploaded={(url) => updateMoment(idx, 'photo', url)} />
                </div>

                {/* Preset Buttons */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Pilihan Foto Preset:
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {PHOTO_PRESETS.galleryMoment.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => updateMoment(idx, 'photo', preset.url)}
                        className="btn-admin-outline"
                        style={{ padding: '3px 7px', fontSize: 10 }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Preview: same portrait shape as the invitation card; drag to pan */}
                <div
                  onPointerMove={(e) => dragMoment(idx, e)}
                  onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
                  title="Geser foto untuk mengatur posisi"
                  style={{
                    width: '100%',
                    maxWidth: 220,
                    aspectRatio: '290 / 380',
                    margin: '0 auto 10px',
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '1px solid rgba(241, 193, 147, 0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    background: '#0d0906',
                    cursor: 'grab',
                    touchAction: 'none',
                  }}
                >
                  <img
                    src={moment.photo}
                    alt={moment.title || `Foto ${idx + 1}`}
                    draggable={false}
                    style={{ width: '100%', height: '100%', pointerEvents: 'none', ...photoFrameStyle(moment) }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
                    }}
                  />
                </div>

                {/* Crop / position */}
                <div style={{ marginBottom: 14 }}>
                  {[
                    ['posX', 'Geser Kiri – Kanan', 0, 100, 1, 50],
                    ['posY', 'Geser Atas – Bawah', 0, 100, 1, 50],
                    ['zoom', 'Zoom / Crop', 1, 3, 0.05, 1],
                  ].map(([field, label, min, max, step, def]) => (
                    <label key={field} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 4, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 6 }}>
                      {label}
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{field === 'zoom' ? `${Number(moment.zoom ?? def).toFixed(2)}×` : `${moment[field] ?? def}%`}</span>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={moment[field] ?? def}
                        onChange={(e) => updateMoment(idx, field, Number(e.target.value))}
                        style={{ gridColumn: '1 / -1', width: '100%', accentColor: '#F1C193' }}
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...getMoments()]
                      list[idx] = { ...list[idx], posX: 50, posY: 50, zoom: 1 }
                      setSettings((prev) => ({ ...prev, galleryMoments: list }))
                    }}
                    className="btn-admin-outline"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                  >
                    Reset posisi
                  </button>
                </div>

                {/* Title */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Judul Momen / Teks Badge
                  </label>
                  <input
                    type="text"
                    value={moment.title || ''}
                    onChange={(e) => updateMoment(idx, 'title', e.target.value)}
                    placeholder="Contoh: Merajut Janji"
                    className="admin-input"
                  />
                </div>

                {/* Date */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Tanggal / Fase
                  </label>
                  <input
                    type="text"
                    value={moment.date || ''}
                    onChange={(e) => updateMoment(idx, 'date', e.target.value)}
                    placeholder="Contoh: Agustus 2022"
                    className="admin-input"
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                    Deskripsi Singkat Kisah
                  </label>
                  <textarea
                    rows={2}
                    value={moment.desc || ''}
                    onChange={(e) => updateMoment(idx, 'desc', e.target.value)}
                    placeholder="Ceritakan sekelumit momen ini..."
                    className="admin-input"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Big Add Slot Button at Bottom */}
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <button
              onClick={addMomentSlot}
              className="btn-admin-outline"
              style={{
                padding: '12px 28px',
                fontSize: 14,
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
                background: 'rgba(241, 193, 147, 0.08)',
              }}
            >
              ➕ Tambah Slot Gambar Lainnya
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: REKENING & AMPLOP DIGITAL (TANDA KASIH) */}
      {activeTab === 'banks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top Info Banner & Add Button */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.75)', border: '1px solid rgba(241, 193, 147, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 22 }}>💳</span>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: 0, fontSize: '1.3rem' }}>
                    Daftar Rekening Bank &amp; Dompet Digital (Tanda Kasih)
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Kelola rekening bank atau e-wallet (DANA, OVO, Gopay, ShopeePay, dll) yang ditampilkan pada modal <strong>"Tanda Kasih Digital"</strong> di bagian penutup undangan.
                </p>
              </div>

              <button
                type="button"
                onClick={addBankAccount}
                className="btn-admin"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}
              >
                <span>➕</span>
                <span>Tambah Rekening Baru</span>
              </button>
            </div>
          </div>

          {/* Gift delivery address */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 4px', fontSize: '1.25rem' }}>
              🎁 Alamat Pengiriman Kado
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
              Tampil di bawah rekening pada undangan, lengkap dengan tombol menuju alamat. Kosongkan alamat untuk menyembunyikannya.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['giftRecipient', 'Nama Penerima (opsional)', 'Contoh: Adisty Vana Lestari (0812xxxxxxx)', false],
                ['giftAddress', 'Alamat Lengkap', 'Jl. ..., No. ..., Muara Teweh, Kalimantan Tengah', true],
                ['giftMaps', 'Link Google Maps (opsional)', 'Kosongkan: tombol mencari otomatis dari alamat di atas', false],
              ].map(([key, label, placeholder, multiline]) => (
                <div key={key}>
                  <label htmlFor={key} style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      id={key}
                      rows={3}
                      value={settings?.[key] ?? DEFAULT_SETTINGS[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      className="admin-input"
                      style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      id={key}
                      type="text"
                      value={settings?.[key] ?? DEFAULT_SETTINGS[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      className="admin-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grid Layout: Left Edit Cards, Right Sticky Live Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, alignItems: 'start' }}>
            {/* Left Column: Bank Cards Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {getBankAccounts().map((bank, index) => (
                <div
                  key={bank.id || index}
                  className="admin-card"
                  style={{
                    background: 'rgba(18, 12, 8, 0.75)',
                    border: '1px solid rgba(241, 193, 147, 0.25)',
                    borderRadius: 16,
                    padding: 20,
                    position: 'relative',
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          background: 'rgba(241, 193, 147, 0.15)',
                          color: '#F1C193',
                          border: '1px solid rgba(241, 193, 147, 0.3)',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#F1C193', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {bank.bankName || `Rekening #${index + 1}`}
                      </span>
                    </div>

                    {getBankAccounts().length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBankAccount(index)}
                        className="btn-admin-outline"
                        style={{
                          borderColor: 'rgba(239, 83, 80, 0.4)',
                          color: '#ef5350',
                          padding: '4px 10px',
                          fontSize: 11,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        title="Hapus rekening ini"
                      >
                        <span>🗑️</span>
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  {/* Bank Quick Preset Chips */}
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 10, color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                      Pilihan Bank &amp; E-Wallet Cepat:
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {[
                        'BANK BCA',
                        'BANK MANDIRI',
                        'BANK BNI',
                        'BANK BRI',
                        'BANK BSI',
                        'CIMB NIAGA',
                        'BANK JAGO',
                        'SEABANK',
                        'DANA',
                        'GOPAY',
                        'OVO',
                        'SHOPEEPAY',
                      ].map((presetName) => (
                        <button
                          key={presetName}
                          type="button"
                          onClick={() => updateBankAccount(index, 'bankName', presetName)}
                          className="btn-admin-outline"
                          style={{
                            padding: '3px 8px',
                            fontSize: 10,
                            background: bank.bankName === presetName ? 'rgba(241, 193, 147, 0.25)' : 'transparent',
                            borderColor: bank.bankName === presetName ? '#F1C193' : 'rgba(255,255,255,0.1)',
                            color: bank.bankName === presetName ? '#F1C193' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {presetName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                        Nama Bank / Provider E-Wallet
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Contoh: BANK BCA, BANK MANDIRI, DANA"
                        value={bank.bankName || ''}
                        onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                        Nomor Rekening / No. Virtual Account / No. HP
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Contoh: 7820491823 atau 08123456789"
                        value={bank.accountNumber || ''}
                        onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                        style={{ width: '100%', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                        Atas Nama Pemilik Rekening
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Contoh: Muhammad Irsyad atau Adisty Vana Lestari"
                        value={bank.accountHolder || ''}
                        onChange={(e) => updateBankAccount(index, 'accountHolder', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Bank Button Bottom */}
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <button
                  type="button"
                  onClick={addBankAccount}
                  className="btn-admin-outline"
                  style={{
                    padding: '12px 28px',
                    fontSize: 14,
                    borderColor: 'var(--gold)',
                    color: 'var(--gold)',
                    background: 'rgba(241, 193, 147, 0.08)',
                    width: '100%',
                  }}
                >
                  ➕ Tambah Rekening / E-Wallet Baru
                </button>
              </div>
            </div>

            {/* Right Column: Sticky Live Preview */}
            <div style={{ position: 'sticky', top: 20 }}>
              <div
                className="admin-card"
                style={{
                  background: 'rgba(10, 6, 4, 0.95)',
                  border: '1px solid rgba(241, 193, 147, 0.3)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
                  padding: 24,
                  borderRadius: 18,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F1C193', fontWeight: 600 }}>
                    👁️ Live Preview Modal "Tanda Kasih Digital"
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--admin-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                    Tampilan Tamu
                  </span>
                </div>

                {/* Simulation of the modal */}
                <div
                  style={{
                    background: 'rgba(20, 14, 10, 0.9)',
                    border: '1px solid rgba(241, 193, 147, 0.25)',
                    borderRadius: 16,
                    padding: '24px 20px',
                    textAlign: 'left',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#F1C193',
                      fontSize: '1.25rem',
                      margin: '0 0 8px',
                      textAlign: 'center',
                    }}
                  >
                    Tanda Kasih Digital
                  </h4>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      textAlign: 'center',
                      marginBottom: 20,
                    }}
                  >
                    Bagi keluarga &amp; sahabat yang ingin memberikan tanda kasih secara cashless:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {getBankAccounts().map((bank, bIdx) => {
                      const isCopied = previewCopiedIndex === bIdx
                      return (
                        <div
                          key={bank.id || bIdx}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 12,
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <span
                              style={{
                                fontSize: 11,
                                color: '#F1C193',
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                display: 'block',
                              }}
                            >
                              {bank.bankName || 'NAMA BANK'}
                            </span>
                            <p
                              style={{
                                margin: '4px 0',
                                fontSize: 16,
                                letterSpacing: '0.1em',
                                fontFamily: 'monospace',
                                color: '#fff',
                                wordBreak: 'break-all',
                              }}
                            >
                              {bank.accountNumber || '•••• •••• ••••'}
                            </p>
                            {bank.accountHolder && (
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', wordBreak: 'break-word' }}>
                                a.n {bank.accountHolder}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePreviewCopy(bank.accountNumber, bIdx)}
                            style={{
                              background: isCopied ? '#2e7d32' : 'rgba(241,193,147,0.15)',
                              color: isCopied ? '#fff' : '#F1C193',
                              border: isCopied ? '1px solid #2e7d32' : '1px solid rgba(241,193,147,0.4)',
                              padding: '8px 14px',
                              borderRadius: 8,
                              fontSize: 12,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              flexShrink: 0,
                              fontWeight: 500,
                            }}
                          >
                            {isCopied ? '✓ Tersalin' : 'Salin Rek'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--admin-muted)' }}>
                  <span>💡</span>
                  <span>
                    Klik tombol <strong>"Salin Rek"</strong> di pratinjau atas untuk menguji fungsi copy clipboard secara langsung.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WAKTU & LOKASI */}
      {activeTab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
              Kolom yang dikosongkan tidak ditampilkan di undangan. Tombol Google Maps hanya muncul jika link diisi.
            </p>
            <button type="button" onClick={addEvent} className="btn-admin" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}>
              <span>➕</span>
              <span>Tambah Acara</span>
            </button>
          </div>

          {getEvents(settings).length === 0 && (
            <p style={{ color: 'var(--admin-muted)', textAlign: 'center' }}>Belum ada acara. Klik Tambah Acara.</p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {getEvents(settings).map((event, index) => (
              <div key={event.id} className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: 0 }}>
                    {event.title || event.type || 'Acara ' + (index + 1)}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="btn-admin-outline"
                    style={{ borderColor: 'rgba(239, 83, 80, 0.4)', color: '#ef5350', padding: '4px 10px', fontSize: 11 }}
                    title="Hapus acara ini"
                  >
                    🗑️ Hapus
                  </button>
                </div>
                {[
                  ['type', 'Label Kecil', 'Akad Nikah'],
                  ['title', 'Judul Acara', 'Akad Nikah'],
                  ['date', 'Hari & Tanggal', 'Rabu, 11 November 2026'],
                  ['time', 'Jam', '08.00 – 10.00 WIB'],
                  ['venue', 'Nama Tempat', 'Masjid ...'],
                  ['address', 'Alamat (opsional)', 'Kosongkan jika tidak ditampilkan'],
                  ['maps', 'Link Google Maps (opsional)', 'https://maps.google.com/...'],
                ].map(([field, label, placeholder]) => (
                  <div key={field} style={{ marginBottom: 12 }}>
                    <label htmlFor={event.id + field} style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                      {label}
                    </label>
                    <input
                      id={event.id + field}
                      type="text"
                      value={event[field] || ''}
                      onChange={(e) => updateEvent(index, field, e.target.value)}
                      placeholder={placeholder}
                      className="admin-input"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: URUTAN SECTION */}
      {activeTab === 'order' && (
        <div className="admin-card" style={{ maxWidth: 560 }}>
          <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
            Atur urutan tampilan section di undangan (juga urutan di menu ☰). Klik <strong>Simpan Perubahan</strong> setelah selesai.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {getSectionOrder(settings).map((id, index, list) => (
              <li
                key={id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(241, 193, 147, 0.25)', background: 'rgba(18, 12, 8, 0.75)' }}
              >
                <span style={{ color: '#F1C193', fontVariantNumeric: 'tabular-nums', width: 24 }}>{String(index + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1 }}>{SECTIONS.find((x) => x.id === id).label}</span>
                <button
                  type="button"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  className="btn-admin-outline"
                  style={{ padding: '4px 10px', opacity: index === 0 ? 0.3 : 1 }}
                  aria-label={`Naikkan ${SECTIONS.find((x) => x.id === id).label}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === list.length - 1}
                  className="btn-admin-outline"
                  style={{ padding: '4px 10px', opacity: index === list.length - 1 ? 0.3 : 1 }}
                  aria-label={`Turunkan ${SECTIONS.find((x) => x.id === id).label}`}
                >
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setSettings((prev) => ({ ...prev, sectionOrder: SECTIONS.map((x) => x.id) }))}
            className="btn-admin-outline"
            style={{ marginTop: 16, fontSize: 12 }}
          >
            Kembalikan urutan awal
          </button>
        </div>
      )}

      {/* TAB 5: FOTO LATAR & NUANSA TEMA */}
      {activeTab === 'background' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Card 1: 🌑 Pengaturan Kegelapan Background Layar Pembuka / Cover */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.75)', border: '1px solid rgba(241, 193, 147, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>🌑</span>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: 0, fontSize: '1.3rem' }}>
                    Pengaturan Gelap Background Layar Pembuka (Cover)
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
                  Atur seberapa gelap latar belakang dan kejelasan foto spiral 3D di layar pembuka (tampilan awal saat tamu membuka link undangan sebelum tombol <em>"Buka Undangan"</em> diklik).
                </p>
              </div>

              <span
                style={{
                  fontSize: 11,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'rgba(241, 193, 147, 0.15)',
                  border: '1px solid rgba(241, 193, 147, 0.3)',
                  color: '#F1C193',
                  fontWeight: 600,
                }}
              >
                Cover Screen Settings
              </span>
            </div>

            {/* Two Column Layout: Controls on Left, Live Interactive Preview on Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
              {/* Controls Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Slider 1: Cover Darkness */}
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F1C193', fontWeight: 700 }}>
                      🌑 Kepekatan Gelap Latar Cover
                    </label>
                    <span style={{ fontSize: 15, color: '#F1C193', fontWeight: 700, fontFamily: 'monospace' }}>
                      {settings?.coverDarkness ?? 75}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={settings?.coverDarkness ?? 75}
                    onChange={(e) => updateField('coverDarkness', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#F1C193', cursor: 'pointer', height: 8 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--admin-muted)' }}>
                    <span>10% (Terang / Transparan)</span>
                    <span style={{ color: '#F1C193' }}>
                      {(() => {
                        const val = settings?.coverDarkness ?? 75
                        if (val >= 85) return 'Sangat Gelap & Kontras'
                        if (val >= 65) return 'Gelap Ideal (Rekomendasi)'
                        if (val >= 40) return 'Sedang (Foto Lebih Terang)'
                        return 'Terang (Foto Sangat Menonjol)'
                      })()}
                    </span>
                    <span>100% (Pekat Gelap)</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.4, margin: '8px 0 0' }}>
                    Geser ke kanan jika ingin latar lebih gelap agar teks nama mempelai dan tombol lebih kontras dan mudah dibaca.
                  </p>
                </div>

                {/* Slider 2: Spiral Photos Opacity */}
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F1C193', fontWeight: 700 }}>
                      ✨ Kecerahan / Opasitas Foto Spiral 3D
                    </label>
                    <span style={{ fontSize: 15, color: '#F1C193', fontWeight: 700, fontFamily: 'monospace' }}>
                      {settings?.coverSpiralOpacity ?? 55}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={settings?.coverSpiralOpacity ?? 55}
                    onChange={(e) => updateField('coverSpiralOpacity', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#F1C193', cursor: 'pointer', height: 8 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--admin-muted)' }}>
                    <span>10% (Samar-samar)</span>
                    <span style={{ color: '#F1C193' }}>
                      {(settings?.coverSpiralOpacity ?? 55) >= 70 ? 'Vivid / Tajam' : 'Harmonis Lembut'}
                    </span>
                    <span>100% (Sangat Terang)</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.4, margin: '8px 0 0' }}>
                    Mengatur seberapa terang foto-foto 3D spiral yang berputar di latar belakang nama pengantin.
                  </p>
                </div>

                {/* Quick Presets */}
                <div>
                  <span style={{ fontSize: 11, color: 'var(--admin-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Pilihan Cepat (Presets Gelap Background):
                  </span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: '🌑 Gelap Elegan (85%)', darkness: 85, opacity: 45 },
                      { label: '✨ Standar Sinematik (75%)', darkness: 75, opacity: 55 },
                      { label: '🌤️ Lembut & Seimbang (60%)', darkness: 60, opacity: 65 },
                      { label: '🖼️ Terang & Foto Jelas (40%)', darkness: 40, opacity: 80 },
                    ].map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => {
                          updateField('coverDarkness', p.darkness)
                          updateField('coverSpiralOpacity', p.opacity)
                        }}
                        className="btn-admin-outline"
                        style={{ padding: '6px 12px', fontSize: 11 }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Interactive Preview Column */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F1C193', fontWeight: 600 }}>
                    👁️ Live Pratinjau Layar Pembuka (Real-Time)
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--admin-muted)' }}>
                    Otomatis berubah saat slider digeser
                  </span>
                </div>

                {/* Mini Preview Box */}
                {(() => {
                  const cDark = (settings?.coverDarkness ?? 75) / 100
                  const sOp = ((settings?.coverSpiralOpacity ?? 55) / 100).toFixed(2)
                  const cTheme = settings?.bgTheme || 'midnight'
                  const themeColors = {
                    midnight: '4, 2, 1',
                    amber: '16, 9, 3',
                    espresso: '12, 7, 4',
                    velvet: '14, 5, 8',
                  }
                  const rgb = themeColors[cTheme] || themeColors.midnight
                  const centerA = (cDark * 0.92).toFixed(2)
                  const midA = Math.min(1.0, cDark * 1.15).toFixed(2)
                  const outerA = Math.min(1.0, cDark * 1.3).toFixed(2)

                  return (
                    <div
                      style={{
                        position: 'relative',
                        height: 320,
                        borderRadius: 16,
                        overflow: 'hidden',
                        background: '#040201',
                        border: '1px solid rgba(241, 193, 147, 0.3)',
                        boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: 20,
                      }}
                    >
                      {/* Background Spiral Simulation Photos */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: sOp,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 12,
                          transform: 'scale(1.05)',
                          pointerEvents: 'none',
                        }}
                      >
                        {[
                          settings?.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
                          settings?.bridePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
                          settings?.coupleBgPhoto || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400',
                        ].map((src, i) => (
                          <div
                            key={i}
                            style={{
                              width: 80,
                              height: 105,
                              borderRadius: 10,
                              overflow: 'hidden',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
                              transform: `rotate(${i === 0 ? -12 : i === 1 ? 4 : 14}deg) translateY(${i === 1 ? -15 : 10}px)`,
                              border: '1px solid rgba(241,193,147,0.2)',
                            }}
                          >
                            <img src={src} alt="sample" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>

                      {/* Live Radial Vignette Darkness Filter */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(ellipse at center, rgba(${rgb}, ${centerA}) 0%, rgba(${rgb}, ${midA}) 60%, rgba(${rgb}, ${outerA}) 100%)`,
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Foreground Mockup */}
                      <div style={{ position: 'relative', zIndex: 5, maxWidth: '90%' }}>
                        <p style={{ fontFamily: '"Metropolis", sans-serif', fontSize: 9, letterSpacing: '0.22em', color: '#F1C193', margin: '0 0 8px', textTransform: 'uppercase' }}>
                          THE WEDDING OF
                        </p>
                        <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, color: '#fff', margin: '0 0 2px', fontWeight: 400 }}>
                          {settings?.groomName || 'Muhammad Irsyad'}
                        </h4>
                        <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'block', margin: '2px 0' }}>
                          &amp;
                        </span>
                        <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, color: '#fff', margin: '0 0 14px', fontWeight: 400 }}>
                          {settings?.brideName || 'Adisty Vana Lestari'}
                        </h4>

                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 14px',
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: 20,
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                          }}
                        >
                          <span>💌</span>
                          <span>Buka Undangan</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Global Ambience & Theme Card */}
          <div className="admin-card" style={{ background: 'rgba(22, 16, 12, 0.7)' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#F1C193', margin: '0 0 16px', fontSize: '1.25rem' }}>
              ✨ Pengaturan Nuansa Warna &amp; Musik Latar
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginBottom: 20 }}>
              Pengaturan ini berlaku untuk seluruh segmen isi undangan (setelah tombol Buka Undangan diklik): mengatur tingkat kegelapan vignette foto latar, gradasi tema warna, dan musik pengiring.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {/* Darkness Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', fontWeight: 600 }}>
                    Tingkat Kegelapan Latar Isi Undangan (Inner Sections)
                  </label>
                  <span style={{ fontSize: 13, color: '#F1C193', fontWeight: 700 }}>
                    {settings?.bgOverlayDarkness || 60}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={settings?.bgOverlayDarkness || 60}
                  onChange={(e) => updateField('bgOverlayDarkness', parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#F1C193', cursor: 'pointer', height: 6 }}
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6, lineHeight: 1.4 }}>
                  Mengatur kepekatan overlay foto latar pada segmen-segmen isi (Groom, Bride, Love Story, Acara, dll) agar tulisan tetap kontras dan nyaman dibaca.
                </p>
              </div>

              {/* Background Music Link */}
              <div>
                <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  URL File Musik / Lagu Latar (.mp3)
                </label>
                <input
                  type="text"
                  value={settings?.musicUrl || ''}
                  onChange={(e) => updateField('musicUrl', e.target.value)}
                  placeholder="https://...mp3"
                  className="admin-input"
                  style={{ fontSize: 13 }}
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                  Musik akan otomatis diputar lembut saat tamu mengklik tombol "Buka Undangan".
                </p>
              </div>
            </div>

            {/* Background Theme Nuance */}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 10, fontWeight: 600 }}>
                Pilihan Gradasi Warna Tema Latar (Radial Tint)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                {[
                  { id: 'midnight', label: '🌑 Midnight Onyx', desc: 'Hitam murni & elegan' },
                  { id: 'amber', label: '🍂 Royal Amber', desc: 'Gradasi coklat keemasan' },
                  { id: 'espresso', label: '☕ Dark Espresso', desc: 'Nuansa kopi gelap mewah' },
                  { id: 'velvet', label: '🍷 Deep Velvet', desc: 'Sentuhan anggun gelap' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateField('bgTheme', t.id)}
                    className="btn-admin-outline"
                    style={{
                      padding: '10px 12px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: settings?.bgTheme === t.id ? 'rgba(241, 193, 147, 0.22)' : 'rgba(0,0,0,0.35)',
                      borderColor: settings?.bgTheme === t.id ? 'var(--admin-gold)' : 'rgba(241, 193, 147, 0.2)',
                      boxShadow: settings?.bgTheme === t.id ? '0 0 12px rgba(241, 193, 147, 0.2)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: settings?.bgTheme === t.id ? '#F1C193' : '#fff' }}>{t.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--admin-muted)', marginTop: 2 }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8-Segment Header */}
          <div style={{ marginTop: 8, padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🖼️</span>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#F1C193', margin: 0 }}>
                Foto Latar Penuh Per Segmen Skrol (8 Segmen)
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-muted)' }}>
              Setiap segmen skrol halaman undangan dapat dikustomisasi dengan foto latar resolusi penuh (full-bleed) secara independen.
            </p>
          </div>

          {/* 8 Scroll Segments Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {SCROLL_SEGMENTS.map((seg) => {
              const currentPhoto = settings?.[seg.key] || seg.defaultUrl
              const presets = PHOTO_PRESETS[seg.presetKey] || []

              return (
                <div key={seg.key} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Badge & Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.12em',
                          color: '#F1C193',
                          background: 'rgba(241, 193, 147, 0.12)',
                          border: '1px solid rgba(241, 193, 147, 0.3)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        {seg.badge}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--admin-muted)' }}>
                        Segmen {seg.num}
                      </span>
                    </div>

                    <h4 style={{ fontFamily: '"Playfair Display", serif', color: '#fff', margin: '0 0 4px', fontSize: '1.15rem' }}>
                      {seg.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: 14, minHeight: 34 }}>
                      {seg.desc}
                    </p>

                    {/* URL Input */}
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: 4 }}>
                        URL Foto Latar Segmen
                      </label>
                      <input
                        type="text"
                        value={settings?.[seg.key] || ''}
                        onChange={(e) => updateField(seg.key, e.target.value)}
                        placeholder={seg.defaultUrl}
                        className="admin-input"
                        style={{ fontSize: 12 }}
                      />
                      <UploadButton onUploaded={(url) => updateField(seg.key, url)} />
                    </div>

                    {/* Presets */}
                    {presets.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <span style={{ fontSize: 10, color: 'var(--admin-muted)', display: 'block', marginBottom: 6 }}>
                          Pilihan Cepat (Presets):
                        </span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {presets.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => updateField(seg.key, p.url)}
                              className="btn-admin-outline"
                              style={{ padding: '4px 8px', fontSize: 10 }}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div style={{ marginTop: 8 }}>
                    <div
                      style={{
                        height: 150,
                        borderRadius: 12,
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid rgba(241, 193, 147, 0.25)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        background: '#0a0502',
                      }}
                    >
                      <img
                        src={currentPhoto}
                        alt={`Preview ${seg.title}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = seg.defaultUrl
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          left: 10,
                          right: 10,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <span style={{ fontSize: 10, color: '#F1C193', letterSpacing: '0.08em', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                          {seg.title}
                        </span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                          100% Full-bleed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 'calc(20px + env(safe-area-inset-bottom, 10px))',
          background: 'rgba(18, 13, 9, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(241, 193, 147, 0.3)',
          borderRadius: 14,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 28,
          boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--admin-muted)' }}>
          Pastikan untuk mengklik <strong>Simpan Perubahan</strong> agar perubahan aktif di undangan tamu.
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-admin"
          style={{ padding: '10px 24px' }}
        >
          {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
        </button>
      </div>
    </div>
  )
}
