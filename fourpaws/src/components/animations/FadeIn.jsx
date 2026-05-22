import React, { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

// ─────────────────────────────────────────────────────────────
// FADE IN — standard scroll-triggered entrance
// ─────────────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, duration = 0.7, className = '', direction = 'up', amount = 0.15 }) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, amount })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
    },
    visible: {
      opacity: 1, y: 0, x: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// STAGGER CONTAINER
// ─────────────────────────────────────────────────────────────
export function StaggerContainer({ children, className = '', staggerChildren = 0.1, delayChildren = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div ref={ref}
      variants={{ hidden: {}, visible: { transition: { staggerChildren, delayChildren } } }}
      initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
      className={className}>
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// GOLD LINE REVEAL
// ─────────────────────────────────────────────────────────────
export function GoldLineReveal({ delay = 0 }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="h-px bg-gold-gradient"
    />
  )
}

// ─────────────────────────────────────────────────────────────
// CINEMATIC IMAGE REVEAL — luxury wipe-in effect
// ─────────────────────────────────────────────────────────────
export function CinematicReveal({ children, className = '', delay = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 100%)' }}
        initial={{ x: '0%' }}
        animate={inView ? { x: '100%' } : { x: '0%' }}
        transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PARALLAX IMAGE — scroll parallax wrapper
// ─────────────────────────────────────────────────────────────
export function ParallaxImage({ src, alt, strength = 0.15, className = '', overlayColour }) {
  const ref  = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y    = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <img src={src} alt={alt || ''}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
      {overlayColour && (
        <div className="absolute inset-0" style={{ background: overlayColour }} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEXT REVEAL — character-by-word luxe reveal
// ─────────────────────────────────────────────────────────────
export function TextReveal({ text, className = '', delay = 0, as: Tag = 'div' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const words  = text.split(' ')

  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <motion.span key={i}
          className="inline-block mr-[0.25em]"
          initial={{ y: '100%', opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}>
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

// ─────────────────────────────────────────────────────────────
// COUNT UP — animated number
// ─────────────────────────────────────────────────────────────
export function CountUp({ to, suffix = '', className = '' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.span ref={ref} className={className}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}>
        {to}
      </motion.span>
      {suffix}
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────────
// LUXURY IMAGE FRAME — decorative gold corner accent wrapper
// ─────────────────────────────────────────────────────────────
export function LuxuryFrame({ children, className = '', colour = 'rgba(201,168,76,0.4)' }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t border-l" style={{ borderColor: colour }} />
      <div className="absolute top-4 right-4 w-10 h-10 border-t border-r" style={{ borderColor: colour }} />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l" style={{ borderColor: colour }} />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r" style={{ borderColor: colour }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SCROLL PROGRESS BAR — thin gold line at top
// ─────────────────────────────────────────────────────────────
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-0.5 z-50"
      style={{ scaleX: scrollYProgress, transformOrigin: '0%',
        background: 'linear-gradient(90deg, #C9A84C 0%, #F5E09A 50%, #C9A84C 100%)' }} />
  )
}
