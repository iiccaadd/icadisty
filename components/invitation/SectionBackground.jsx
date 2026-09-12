'use client'

export default function SectionBackground({
  photo,
  settings,
  brightnessMultiplier = 1,
  position = 'center',
  fallbackGradient = null,
}) {
  const darkness = settings?.bgOverlayDarkness ? settings.bgOverlayDarkness / 100 : 0.6
  const theme = settings?.bgTheme || 'midnight'

  const themeGradients = {
    midnight: 'radial-gradient(ellipse at 50% 35%, rgba(20, 10, 5, 0.45) 0%, rgba(0, 0, 0, 0.94) 85%)',
    amber: 'radial-gradient(ellipse at 50% 35%, rgba(65, 30, 12, 0.55) 0%, rgba(12, 6, 2, 0.94) 85%)',
    espresso: 'radial-gradient(ellipse at 50% 35%, rgba(42, 22, 16, 0.55) 0%, rgba(10, 5, 3, 0.94) 85%)',
    velvet: 'radial-gradient(ellipse at 50% 35%, rgba(50, 15, 22, 0.5) 0%, rgba(8, 3, 4, 0.94) 85%)',
  }

  const radialGradient = themeGradients[theme] || themeGradients.midnight
  const computedBrightness = Math.max(0.18, (1.15 - darkness) * brightnessMultiplier)

  return (
    <>
      <div
        className="section-bg"
        style={{
          backgroundImage: photo
            ? `${radialGradient}, url('${photo}')`
            : fallbackGradient || radialGradient,
          backgroundSize: 'cover',
          backgroundPosition: position,
          filter: `brightness(${computedBrightness.toFixed(2)}) saturate(0.85)`,
        }}
      />
      <div className="overlay overlay-dark" style={{ opacity: darkness * 0.65 }} />
      <div className="overlay-bottom" />
    </>
  )
}
