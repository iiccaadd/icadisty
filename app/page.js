'use client'

import { useEffect, useState, useRef } from 'react'
import './invitation.css'
import NavMenu from '@/components/invitation/NavMenu'
import MusicButton from '@/components/invitation/MusicButton'
import Preloader from '@/components/invitation/Preloader'
import HeroSection from '@/components/invitation/HeroSection'
import GroomSection from '@/components/invitation/GroomSection'
import BrideSection from '@/components/invitation/BrideSection'
import LoveStorySection from '@/components/invitation/LoveStorySection'
import EventSection from '@/components/invitation/EventSection'
import CountdownSection from '@/components/invitation/CountdownSection'
import GallerySection from '@/components/invitation/GallerySection'
import RSVPSection from '@/components/invitation/RSVPSection'
import ClosingSection from '@/components/invitation/ClosingSection'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'

const GROOM = process.env.NEXT_PUBLIC_GROOM_NAME || 'Muhammad Irsyad, S.T.'
const BRIDE = process.env.NEXT_PUBLIC_BRIDE_NAME || 'Adisty Vana Lestari, S.Pd., M.Pd.'

export default function InvitationPage() {
  const [opened, setOpened] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const rootRef = useRef(null)

  useEffect(() => {
    // Fetch custom photos & background settings with cache-busting
    const loadSettings = () => {
      fetch('/api/settings?t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setSettings(json.data)
        })
        .catch((e) => console.warn('Notice: settings fetch fallback:', e))
    }

    loadSettings()

    // Re-fetch when user returns to tab / app
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadSettings()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    // Get guest name from URL: ?to=NamaTamu or ?u=NamaTamu
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const name = params.get('to') || params.get('u') || params.get('nama')
      if (name) {
        setGuestName(decodeURIComponent(name.replace(/\+/g, ' ')))
      }
    }
  }, [])

  useEffect(() => {
    if (!opened) return

    const elements = document.querySelectorAll('.reanimate')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          } else {
            entry.target.classList.remove('in-view')
          }
        })
      },
      { root: null, rootMargin: '-10px 0px -10px 0px', threshold: 0.05 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [opened])

  const handleOpen = () => {
    setOpened(true)

    // Trigger music auto-play on user interaction
    window.dispatchEvent(new Event('open_wedding_invitation'))

    // Automatically update guest status to 'has_opened = true' in database
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search)
        const toName = params.get('to') || params.get('nama') || guestName
        const toSlug = params.get('u') || params.get('slug')
        const toId = params.get('id') || params.get('guest_id')

        if (toName || toSlug || toId) {
          fetch('/api/guests', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: toId || undefined,
              slug: toSlug || undefined,
              name: toName ? decodeURIComponent(toName.replace(/\+/g, ' ')) : undefined,
              has_opened: true,
            }),
          }).catch((err) => console.warn('Status open track notice:', err))
        }
      } catch (e) {
        console.warn('Track opened error:', e)
      }
    }

    // Disable scroll snap momentarily during opening transition
    if (rootRef.current) {
      rootRef.current.classList.add('no-snap')
      setTimeout(() => rootRef.current?.classList.remove('no-snap'), 1200)
    }

    // Scroll smoothly to top of invitation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const groomName = settings?.groomName || GROOM
  const brideName = settings?.brideName || BRIDE

  return (
    <>
      <Preloader
        groomName={groomName}
        brideName={brideName}
        guestName={guestName}
        onOpen={handleOpen}
        isOpened={opened}
        settings={settings}
      />

      <div
        ref={rootRef}
        className={`invitation-root ${opened ? '' : 'no-snap'}`}
        style={{ display: opened ? 'block' : 'none' }}
      >
        {/* Floating UI */}
        <NavMenu />
        <MusicButton musicUrl={settings?.musicUrl} />

        {/* Sections */}
        <HeroSection id="opening" groomName={groomName} brideName={brideName} guestName={guestName} settings={settings} />
        <GroomSection id="groom" groomName={groomName} settings={settings} />
        <BrideSection id="bride" brideName={brideName} settings={settings} />
        <LoveStorySection id="lovestory" settings={settings} />
        <EventSection id="events" settings={settings} />
        <CountdownSection id="countdown" settings={settings} />
        <GallerySection id="gallery" settings={settings} />
        <RSVPSection id="rsvp" guestName={guestName} settings={settings} />
        <ClosingSection id="closing" groomName={groomName} brideName={brideName} settings={settings} />
      </div>
    </>
  )
}
