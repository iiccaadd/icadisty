import './globals.css'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'
import { fetchSupabaseSettings } from '@/lib/supabaseServer'

// Re-read names/photo from settings at most once a minute (WhatsApp caches previews anyway)
export const revalidate = 60

// "Muhammad Irsyad, S.T." -> "Muhammad Irsyad": academic titles make the share title too long
const plainName = (name) => (name || '').split(',')[0].trim()

export async function generateMetadata() {
  const settings = { ...DEFAULT_SETTINGS, ...(await fetchSupabaseSettings().catch(() => null)) }
  const title = `The Wedding of ${plainName(settings.groomName)} & ${plainName(settings.brideName)}`
  const description = 'Dengan penuh sukacita kami mengundang Anda untuk hadir dalam acara pernikahan kami.'
  const images = settings.heroBgPhoto ? [settings.heroBgPhoto] : []

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
