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
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(20, 15, 10, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(241, 193, 147, 0.4)',
          color: '#F1C193',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          animation: playing ? 'spin 8s linear infinite' : 'none',
          transition: 'transform 0.2s',
        }}
      >
        <span style={{ fontSize: 18 }}>{playing ? '💿' : '🎵'}</span>
      </button>
    </>
  )
}
