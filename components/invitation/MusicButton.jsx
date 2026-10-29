'use client'
import { useState, useRef, useEffect } from 'react'

export default function MusicButton({ musicUrl }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  const activeSrc = musicUrl || 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89e24ff71.mp3?filename=romantic-piano-112199.mp3'

  useEffect(() => {
    const handleStartMusic = () => {
      if (audioRef.current && !playing) {
        audioRef.current.play().then(() => {
          setPlaying(true)
        }).catch(() => {
          // Auto-play was prevented by browser policy
        })
      }
    }

    window.addEventListener('open_wedding_invitation', handleStartMusic)
    return () => window.removeEventListener('open_wedding_invitation', handleStartMusic)
  }, [playing])

  // Stop the music when the guest leaves the page (tab switch, app switch, screen lock) and resume on return
  useEffect(() => {
    let resume = false
    const onVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        resume = !audio.paused
        audio.pause()
      } else if (resume) {
        resume = false
        audio.play().catch(() => setPlaying(false))
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true)
      }).catch(() => {})
    }
  }

  return (
    <>
      {/* Background audio */}
      <audio
        ref={audioRef}
        src={activeSrc}
        loop
        preload="auto"
      />

      <button
        className={`music-btn ${playing ? 'playing' : ''}`}
        onClick={toggle}
        title={playing ? 'Matikan musik' : 'Putar musik'}
        aria-label={playing ? 'Matikan musik latar' : 'Putar musik latar'}
        aria-pressed={playing}
      >
        {/* Feather "music" icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>
    </>
  )
}
