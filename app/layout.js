import './globals.css'

const GROOM = process.env.NEXT_PUBLIC_GROOM_NAME || 'Nama Pria'
const BRIDE = process.env.NEXT_PUBLIC_BRIDE_NAME || 'Nama Wanita'

export const metadata = {
  title: `The Wedding of ${GROOM} & ${BRIDE}`,
  description: `Dengan penuh sukacita kami mengundang Anda untuk hadir dalam acara pernikahan kami.`,
  openGraph: {
    title: `The Wedding of ${GROOM} & ${BRIDE}`,
    description: 'Undangan pernikahan digital',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
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
