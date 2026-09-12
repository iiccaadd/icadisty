'use client'

import { motion } from 'motion/react'
import { useEffect, useRef, useState, useMemo } from 'react'

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])

  const keyframes = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

const BlurText = ({
  text = '',
  delay = 160,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.2,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  as: Component = 'p',
  style = {},
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const [activeDirection, setActiveDirection] = useState(direction)
  const ref = useRef(null)
  const lastScrollYRef = useRef(0)

  // Track scroll direction (detect scroll up vs scroll down)
  useEffect(() => {
    const scrollContainer = document.querySelector('.invitation-root') || window

    const handleScroll = () => {
      const currentScrollY = scrollContainer === window ? window.scrollY : scrollContainer.scrollTop
      if (currentScrollY > lastScrollYRef.current + 4) {
        // Scrolling down
        setActiveDirection('top')
      } else if (currentScrollY < lastScrollYRef.current - 4) {
        // Scrolling up -> trigger upwards entrance animation
        setActiveDirection('bottom')
      }
      lastScrollYRef.current = currentScrollY
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Observe entering and leaving view so animation triggers on BOTH scroll down and scroll up
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        } else {
          // Reset when out of view so it re-triggers every time the user scrolls back
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const effectiveDirection = animationFrom ? direction : activeDirection

  const defaultFrom = useMemo(
    () =>
      effectiveDirection === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -45 }
        : { filter: 'blur(10px)', opacity: 0, y: 45 },
    [effectiveDirection]
  )

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(4px)',
        opacity: 0.6,
        y: effectiveDirection === 'top' ? 4 : -4,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [effectiveDirection]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
        }
        spanTransition.ease = easing

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity',
            }}
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      })}
    </Component>
  )
}

export default BlurText
