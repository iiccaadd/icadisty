'use client'

import { motion, useMotionValue, useTransform } from 'motion/react'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false, isTop = false }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [40, -40])
  const rotateY = useTransform(x, [-100, 100], [-40, 40])

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack()
    }
    x.set(0)
    y.set(0)
  }

  if (disableDrag || !isTop) {
    return (
      <div
        className="card-rotate-disabled"
        style={{
          pointerEvents: isTop ? 'auto' : 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.55}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  )
}

const Stack = forwardRef(function Stack(
  {
    randomRotation = false,
    sensitivity = 160,
    cards = [],
    animationConfig = { stiffness: 260, damping: 20 },
    sendToBackOnClick = true,
    autoplay = false,
    autoplayDelay = 3500,
    pauseOnHover = false,
    mobileClickOnly = false,
    mobileBreakpoint = 768,
    onTopCardChange,
  },
  ref
) {
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Track cards key so re-renders of parent don't wipe out active stack position
  const cardsKey = cards.map((c, i) => c?.key ?? i).join(':')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const shouldDisableDrag = mobileClickOnly && isMobile
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag

  // Initialize stack such that card 0 is at stack[stack.length - 1] (visually top card)
  const [stack, setStack] = useState(() => {
    if (!cards.length) return []
    const reversed = [...cards].reverse()
    return reversed.map((content, index) => ({
      id: cards.length - index,
      content,
      originalIndex: cards.length - 1 - index,
    }))
  })

  // Only re-initialize stack when the actual cards array length or items change
  const prevCardsKeyRef = useRef(cardsKey)
  useEffect(() => {
    if (cards.length > 0 && prevCardsKeyRef.current !== cardsKey) {
      prevCardsKeyRef.current = cardsKey
      const reversed = [...cards].reverse()
      setStack(
        reversed.map((content, index) => ({
          id: cards.length - index,
          content,
          originalIndex: cards.length - 1 - index,
        }))
      )
    }
  }, [cardsKey, cards])

  const sendToBack = (id) => {
    setStack((prev) => {
      if (prev.length <= 1) return prev
      const newStack = [...prev]
      const index = newStack.findIndex((card) => card.id === id)
      if (index === -1) return prev
      const [card] = newStack.splice(index, 1)
      newStack.unshift(card)
      return newStack
    })
  }

  const bringFromBack = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev
      const newStack = [...prev]
      const card = newStack.shift()
      newStack.push(card)
      return newStack
    })
  }

  // Notify parent of active top card index
  useEffect(() => {
    if (stack.length > 0 && onTopCardChange) {
      const topCard = stack[stack.length - 1]
      if (topCard && topCard.originalIndex !== undefined) {
        onTopCardChange(topCard.originalIndex)
      }
    }
  }, [stack, onTopCardChange])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    next: () => {
      setStack((prev) => {
        if (prev.length <= 1) return prev
        const newStack = [...prev]
        const card = newStack.pop()
        newStack.unshift(card)
        return newStack
      })
    },
    prev: () => {
      bringFromBack()
    },
  }))

  // Autoplay timer without dependency on stack to prevent timer cancellation resets
  useEffect(() => {
    if (!autoplay || isPaused) return

    const interval = setInterval(() => {
      setStack((prev) => {
        if (prev.length <= 1) return prev
        const newStack = [...prev]
        const card = newStack.pop()
        newStack.unshift(card)
        return newStack
      })
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, isPaused])

  const handleMouseEnter = () => {
    if (pauseOnHover && !isMobile) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover && !isMobile) {
      setIsPaused(false)
    }
  }

  return (
    <div
      className="stack-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {stack.map((card, index) => {
        const isTop = index === stack.length - 1
        const randomRotate = randomRotation ? ((card.id * 17) % 9) - 4 : 0
        const depth = stack.length - 1 - index

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
            isTop={isTop}
          >
            <motion.div
              className="card"
              onClick={(e) => {
                e.stopPropagation()
                if (isTop && shouldEnableClick) {
                  sendToBack(card.id)
                }
              }}
              animate={{
                rotateZ: depth * 3.5 + randomRotate,
                scale: Math.max(0.75, 1 - depth * 0.05),
                transformOrigin: '90% 90%',
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              style={{
                zIndex: index + 1,
                cursor: isTop ? (shouldDisableDrag ? 'pointer' : 'grab') : 'default',
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        )
      })}
    </div>
  )
})

export default Stack
