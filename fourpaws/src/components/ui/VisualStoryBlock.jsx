// ─────────────────────────────────────────────────────────────
// FOUR PAWS — VISUAL STORY BLOCK (V4 Sales Patch)
// Cinematic scrolling storytelling. Image + text pairs with
// parallax, overlays, reveal animations. Used throughout
// HomePage and AboutPage for emotional narrative sections.
// ─────────────────────────────────────────────────────────────
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CinematicReveal, LuxuryFrame, FadeIn } from '../animations/FadeIn'

// ─────────────────────────────────────────────────────────────
// STORY BLOCK — image left or right + text
// ─────────────────────────────────────────────────────────────
export function StoryBlock({
  image,
  label,
  headline,
  subheadline,
  body,
  cta,
  ctaLink = '/login',
  imageLeft = true,
  overlayColour = 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
  accentColour = '#C9A84C',
  quote,
  stats,
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const textSide = (
    <FadeIn direction={imageLeft ? 'left' : 'right'} className="flex flex-col justify-center">
      {label && (
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 flex-shrink-0" style={{ background: accentColour }} />
          <span className="font-sans text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: accentColour }}>{label}</span>
        </div>
      )}

      {headline && (
        <h2 className="luxury-heading text-4xl lg:text-5xl mb-4 leading-[1.05]"
          dangerouslySetInnerHTML={{ __html: headline }} />
      )}

      {subheadline && (
        <div className="font-serif text-xl font-light italic mb-5"
          style={{ color: accentColour + 'CC' }}>{subheadline}</div>
      )}

      {body && (
        <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-6 max-w-lg">{body}</p>
      )}

      {quote && (
        <div className="relative p-5 mb-6"
          style={{ borderLeft: `2px solid ${accentColour}40`, background: `${accentColour}06` }}>
          <p className="font-serif text-sm italic text-silver-300 leading-relaxed">"{quote.text}"</p>
          {quote.author && <p className="font-sans text-[10px] text-silver-600 mt-2">— {quote.author}</p>}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-light" style={{ color: accentColour }}>{s.value}</div>
              <div className="font-sans text-[9px] text-silver-600 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {cta && (
        <Link to={ctaLink}
          className="inline-flex items-center gap-2 font-sans text-xs font-medium tracking-widest uppercase transition-all duration-300 group"
          style={{ color: accentColour }}>
          {cta}
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      )}
    </FadeIn>
  )

  const imageSide = (
    <CinematicReveal>
      <LuxuryFrame colour={`${accentColour}40`}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
            <img src={image.src} alt={image.alt || ''}
              className="w-full h-full object-cover"
              loading="lazy" decoding="async"
            />
          </motion.div>
          {/* Cinematic overlay */}
          <div className="absolute inset-0" style={{ background: overlayColour }} />
        </div>
      </LuxuryFrame>
    </CinematicReveal>
  )

  return (
    <div ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${imageLeft ? '' : 'lg:grid-flow-dense'}`}>
      {imageLeft ? (
        <>{imageSide}{textSide}</>
      ) : (
        <><div className="lg:col-start-2">{imageSide}</div><div className="lg:col-start-1 lg:row-start-1">{textSide}</div></>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FULL BLEED STORY — edge-to-edge cinematic panel
// ─────────────────────────────────────────────────────────────
export function FullBleedStory({
  image,
  label,
  headline,
  body,
  cta,
  ctaLink = '/login',
  textAlign = 'left',
  overlayGradient = 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
}) {
  const ref    = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY   = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
        <img src={image.src} alt={image.alt || ''}
          className="w-full h-full object-cover"
          loading="lazy" decoding="async"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: overlayGradient }} />

      {/* Content */}
      <div className={`relative z-10 flex items-center min-h-[500px] px-8 lg:px-16 py-16 ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
        <FadeIn className={`max-w-xl ${textAlign === 'center' ? 'text-center' : ''}`}>
          {label && (
            <div className={`flex items-center gap-3 mb-5 ${textAlign === 'center' ? 'justify-center' : ''}`}>
              <div className="h-px w-8 bg-gold-gradient flex-shrink-0" />
              <span className="section-label">{label}</span>
              {textAlign === 'center' && <div className="h-px w-8 bg-gold-gradient flex-shrink-0" />}
            </div>
          )}
          {headline && (
            <h2 className="luxury-heading text-4xl lg:text-5xl mb-5 leading-tight"
              dangerouslySetInnerHTML={{ __html: headline }} />
          )}
          {body && (
            <p className="font-sans text-base font-light text-silver-300 leading-relaxed mb-7">{body}</p>
          )}
          {cta && (
            <Link to={ctaLink} className="btn-gold inline-flex items-center gap-2 text-xs">
              {cta} <ArrowRight size={13} />
            </Link>
          )}
        </FadeIn>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TRANSFORMATION CARD — before/after emotional visual
// ─────────────────────────────────────────────────────────────
export function TransformationCard({ before, after, label, description, accentColour = '#C9A84C' }) {
  return (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${accentColour}20` }}>
      <div className="grid grid-cols-2">
        {/* Before */}
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img src={before.image} alt="Before transformation"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.4) brightness(0.7)' }}
              loading="lazy" decoding="async"
            />
          </div>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(20,10,30,0.7) 0%, rgba(0,0,0,0.3) 100%)' }} />
          <div className="absolute bottom-3 left-3">
            <div className="font-sans text-[8px] uppercase tracking-widest text-silver-500 mb-0.5">Before</div>
            <div className="font-serif text-sm text-silver-300">{before.label}</div>
          </div>
        </div>

        {/* After */}
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img src={after.image} alt="After transformation"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.1) brightness(1.05)' }}
              loading="lazy" decoding="async"
            />
          </div>
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, transparent 40%, ${accentColour}20 100%)` }} />
          <div className="absolute bottom-3 right-3 text-right">
            <div className="font-sans text-[8px] uppercase tracking-widest mb-0.5"
              style={{ color: accentColour }}>After</div>
            <div className="font-serif text-sm text-pearl">{after.label}</div>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${accentColour} 30%, ${accentColour} 70%, transparent 100%)` }} />

      {/* Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#0A0A0A', border: `1px solid ${accentColour}60` }}>
          <span className="text-base">→</span>
        </div>
      </div>

      <div className="p-5">
        <div className="font-serif text-base font-medium text-pearl mb-1">{label}</div>
        <p className="font-sans text-xs text-silver-500 font-light">{description}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// EMOTION JOURNEY STEP — numbered timeline card
// ─────────────────────────────────────────────────────────────
export function JourneyStep({ step, label, description, icon, colour = '#C9A84C', isLast = false }) {
  return (
    <div className="relative flex gap-5">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-5 top-14 bottom-0 w-px"
          style={{ background: `linear-gradient(180deg, ${colour}40 0%, transparent 100%)` }} />
      )}

      {/* Step orb */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative z-10"
        style={{ background: `${colour}15`, border: `1px solid ${colour}40` }}>
        <span className="text-lg">{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <div className="font-sans text-[9px] uppercase tracking-widest mb-1"
          style={{ color: colour }}>Step {step}</div>
        <div className="font-serif text-lg font-medium text-pearl mb-2">{label}</div>
        <p className="font-sans text-sm text-silver-500 font-light leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PULL QUOTE BLOCK
// ─────────────────────────────────────────────────────────────
export function PullQuote({ text, author, location, accentColour = '#C9A84C' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <FadeIn className="relative py-10 px-6 text-center max-w-3xl mx-auto">
      {/* Decorative quotation mark */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 font-serif text-[120px] leading-none select-none"
        style={{ color: `${accentColour}12`, fontStyle: 'italic' }}>"</div>

      <div className="relative z-10">
        <motion.p ref={ref}
          className="font-serif text-xl lg:text-2xl font-light italic text-silver-200 leading-relaxed mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          "{text}"
        </motion.p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-6" style={{ background: accentColour + '80' }} />
          <div className="text-center">
            <div className="font-sans text-xs font-medium text-pearl">{author}</div>
            {location && <div className="font-sans text-[9px] text-silver-600">{location}</div>}
          </div>
          <div className="h-px w-6" style={{ background: accentColour + '80' }} />
        </div>
      </div>
    </FadeIn>
  )
}

// ─────────────────────────────────────────────────────────────
// PREMIUM CTA BANNER — full-width emotional CTA
// ─────────────────────────────────────────────────────────────
export function PremiumCTA({ image, headline, subtext, primaryCta, secondaryCta }) {
  const ref  = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <div ref={ref} className="relative overflow-hidden py-24 px-6">
      {/* Background image */}
      {image && (
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <img src={image} alt=""
            className="w-full h-full object-cover"
            loading="lazy" decoding="async"
          />
        </motion.div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 100%)' }} />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

      <FadeIn className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="divider-gold w-10" />
          <span className="section-label">The Invitation</span>
          <div className="divider-gold w-10" />
        </div>

        <h2 className="luxury-heading text-5xl lg:text-6xl mb-5 leading-tight"
          dangerouslySetInnerHTML={{ __html: headline }} />

        {subtext && (
          <p className="font-sans text-base font-light text-silver-300 max-w-xl mx-auto mb-10 leading-relaxed">
            {subtext}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryCta && (
            <Link to={primaryCta.link || '/login'}
              className="btn-gold flex items-center gap-2 text-xs">
              {primaryCta.label} <ArrowRight size={13} />
            </Link>
          )}
          {secondaryCta && (
            <Link to={secondaryCta.link || '/about'}
              className="btn-outline-gold text-xs">
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </FadeIn>
    </div>
  )
}
