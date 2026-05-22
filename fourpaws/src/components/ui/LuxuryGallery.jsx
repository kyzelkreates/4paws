// ─────────────────────────────────────────────────────────────
// FOUR PAWS — LUXURY IMAGE GALLERY COMPONENT (V4 Sales Patch)
// Cinematic gallery with lightbox, hover interactions, smooth transitions.
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { CinematicReveal } from '../animations/FadeIn'

// ─────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowRight')  setIdx(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft')   setIdx(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [images.length, onClose])

  const image = images[idx]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}>

      {/* Image */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl max-h-[85vh] mx-6"
        onClick={e => e.stopPropagation()}>

        {/* Gold frame */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-gold-500/50" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-gold-500/50" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-gold-500/50" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-gold-500/50" />
        </div>

        <img src={image.src} alt={image.alt || ''}
          className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.15)' }}
        />

        {/* Caption */}
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center"
            style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
            <p className="font-serif text-sm italic text-silver-300">{image.caption}</p>
          </div>
        )}
      </motion.div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-silver-400 hover:text-gold-400 hover:border-gold-500/30 transition-all backdrop-blur-sm"
            style={{ background: 'rgba(10,10,10,0.6)' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-silver-400 hover:text-gold-400 hover:border-gold-500/30 transition-all backdrop-blur-sm"
            style={{ background: 'rgba(10,10,10,0.6)' }}>
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Close */}
      <button onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-silver-400 hover:text-gold-400 transition-all"
        style={{ background: 'rgba(10,10,10,0.7)' }}>
        <X size={14} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-[10px] text-silver-600 tracking-widest">
        {idx + 1} / {images.length}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// GALLERY ITEM
// ─────────────────────────────────────────────────────────────
function GalleryItem({ image, index, onOpen, variant = 'standard', delay = 0 }) {
  const [hovered, setHovered] = useState(false)

  const aspectMap = {
    standard:  'aspect-[4/3]',
    portrait:  'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    square:    'aspect-square',
    wide:      'aspect-[21/9]',
  }
  const aspect = aspectMap[variant] || aspectMap.standard

  return (
    <CinematicReveal delay={delay * 0.1}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => onOpen(index)}
        className={`relative ${aspect} overflow-hidden cursor-pointer group`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>

        <img src={image.src} alt={image.alt || ''}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1.0)' }}
          loading="lazy" decoding="async"
        />

        {/* Gold shimmer overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 50%, rgba(201,168,76,0.05) 100%)' }}
            />
          )}
        </AnimatePresence>

        {/* Gradient overlay bottom */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)' }} />

        {/* Zoom icon */}
        <motion.div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(201,168,76,0.3)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}>
          <ZoomIn size={12} className="text-gold-400" />
        </motion.div>

        {/* Gold corner frame */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}>
          <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-gold-500/60" />
          <div className="absolute top-3 right-3 w-7 h-7 border-t border-r border-gold-500/60" />
          <div className="absolute bottom-3 left-3 w-7 h-7 border-b border-l border-gold-500/60" />
          <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-gold-500/60" />
        </div>

        {/* Caption */}
        {image.caption && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ y: 10, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <p className="font-serif text-xs italic text-silver-200">{image.caption}</p>
          </motion.div>
        )}
      </motion.div>
    </CinematicReveal>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN GALLERY
// ─────────────────────────────────────────────────────────────
export default function LuxuryGallery({ images, layout = 'masonry', showLightbox = true }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const openLightbox  = (idx) => showLightbox && setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)

  if (layout === 'featured') {
    // Featured: 1 large left + 2 stacked right
    return (
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            {images[0] && <GalleryItem image={images[0]} index={0} onOpen={openLightbox} variant="portrait" delay={0} />}
          </div>
          <div className="grid grid-rows-2 gap-3">
            {images[1] && <GalleryItem image={images[1]} index={1} onOpen={openLightbox} variant="square" delay={1} />}
            {images[2] && <GalleryItem image={images[2]} index={2} onOpen={openLightbox} variant="square" delay={2} />}
          </div>
        </div>
        <AnimatePresence>
          {lightboxIdx !== null && (
            <Lightbox images={images} startIndex={lightboxIdx} onClose={closeLightbox} />
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (layout === 'wide-strip') {
    return (
      <div className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <GalleryItem key={i} image={img} index={i} onOpen={openLightbox} variant="portrait" delay={i} />
          ))}
        </div>
        <AnimatePresence>
          {lightboxIdx !== null && (
            <Lightbox images={images} startIndex={lightboxIdx} onClose={closeLightbox} />
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (layout === 'editorial') {
    // Editorial: 1 wide hero + row of 3
    return (
      <div className="relative space-y-3">
        {images[0] && (
          <GalleryItem image={images[0]} index={0} onOpen={openLightbox} variant="landscape" delay={0} />
        )}
        <div className="grid grid-cols-3 gap-3">
          {images.slice(1, 4).map((img, i) => (
            <GalleryItem key={i+1} image={img} index={i+1} onOpen={openLightbox} variant="standard" delay={i+1} />
          ))}
        </div>
        <AnimatePresence>
          {lightboxIdx !== null && (
            <Lightbox images={images} startIndex={lightboxIdx} onClose={closeLightbox} />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Default: masonry-style grid
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <GalleryItem key={i} image={img} index={i} onOpen={openLightbox}
            variant={i % 3 === 0 ? 'portrait' : 'standard'} delay={i} />
        ))}
      </div>
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox images={images} startIndex={lightboxIdx} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </div>
  )
}
