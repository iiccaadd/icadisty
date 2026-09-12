'use client'

import { useEffect, useState, useRef } from 'react'
import './invitation.css'
import NavMenu from '@/components/invitation/NavMenu'
import MusicButton from '@/components/invitation/MusicButton'
import Preloader from '@/components/invitation/Preloader'
import HeroSection from '@/components/invitation/HeroSection'
import CoupleSection from '@/components/invitation/CoupleSection'
import LoveStorySection from '@/components/invitation/LoveStorySection'
import EventSection from '@/components/invitation/EventSection'
import CountdownSection from '@/components/invitation/CountdownSection'
import GallerySection from '@/components/invitation/GallerySection'
import RSVPSection from '@/components/invitation/RSVPSection'
import ClosingSection from '@/components/invitation/ClosingSection'

const GROOM = process.env.NEXT_PUBLIC_GROOM_NAME || 'Muhammad Irsyad'
const BRIDE = process.env.NEXT_PUBLIC_BRIDE_NAME || 'Adisty Vana Lestari'

export default function InvitationPage() {
  const [opened, setOpened] = useState(false)
  const [guestName, setGuestName] = useState('')
  const rootRef = useRef(null)

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

    // Disable scroll snap momentarily during opening transition
    if (rootRef.current) {
      rootRef.current.classList.add('no-snap')
      setTimeout(() => rootRef.current?.classList.remove('no-snap'), 1200)
    }

    // Scroll smoothly to top of invitation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Preloader
        groomName={GROOM}
        brideName={BRIDE}
        guestName={guestName}
        onOpen={handleOpen}
        isOpened={opened}
      />

      <div
        ref={rootRef}
        className={`invitation-root ${opened ? '' : 'no-snap'}`}
        style={{ display: opened ? 'block' : 'none' }}
      >
        {/* Floating UI */}
        <NavMenu />
        <MusicButton />

        {/* Sections */}
        <HeroSection id="opening" groomName={GROOM} brideName={BRIDE} guestName={guestName} />
        <CoupleSection id="couple" groomName={GROOM} brideName={BRIDE} />
        <LoveStorySection id="lovestory" />
        <EventSection id="events" />
        <CountdownSection id="countdown" />
        <GallerySection id="gallery" />
        <RSVPSection id="rsvp" guestName={guestName} />
        <ClosingSection id="closing" groomName={GROOM} brideName={BRIDE} />
      </div>
    </>
  )
}
