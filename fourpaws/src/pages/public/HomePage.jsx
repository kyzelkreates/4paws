import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Award, Star, Users, Zap, Shield, Heart, Crown, ChevronDown, Play } from 'lucide-react'
import {
  FadeIn, StaggerContainer, StaggerItem, GoldLineReveal,
  ParallaxImage, TextReveal, ScrollProgressBar, LuxuryFrame, CinematicReveal,
} from '../../components/animations/FadeIn'
import {
  StoryBlock, FullBleedStory, JourneyStep, PullQuote, PremiumCTA, TransformationCard,
} from '../../components/ui/VisualStoryBlock'
import LuxuryGallery from '../../components/ui/LuxuryGallery'

// ─────────────────────────────────────────────────────────────
// IMAGE ASSETS — generated & curated
// ─────────────────────────────────────────────────────────────
const IMG = {
  hero:        'https://media.base44.com/images/public/6a0f87a2403280642106cb46/33f547c90_generated_image.png',
  calm:        'https://media.base44.com/images/public/6a0f87a2403280642106cb46/c9bb3e265_generated_image.png',
  garden:      'https://media.base44.com/images/public/6a0f87a2403280642106cb46/873b16b5b_generated_image.png',
  transform:   'https://media.base44.com/images/public/6a0f87a2403280642106cb46/1d0305805_generated_image.png',
  connection:  'https://media.base44.com/images/public/6a0f87a2403280642106cb46/ad7860d46_generated_image.png',
  estate:      'https://media.base44.com/images/public/6a0f87a2403280642106cb46/1e1d50ea4_generated_image.png',
  training:    'https://media.base44.com/images/public/6a0f87a2403280642106cb46/630d9b1b4_generated_image.png',
}

const benefits = [
  { icon: Crown,  title: 'Elite Methodology',    desc: 'Psychology-first training rooted in cutting-edge canine science and decades of exclusive expertise.' },
  { icon: Award,  title: 'Proven Transformation', desc: 'Every programme is designed to deliver permanent, measurable change in your dog\'s behaviour and character.' },
  { icon: Shield, title: 'Private Academy Access',desc: 'Members-only platform with exclusive content, personalised support, and a curated community of discerning owners.' },
  { icon: Zap,    title: 'AI-Enhanced Intelligence', desc: 'Proprietary intelligence that adapts to your dog\'s unique personality, emotional state, and learning style.' },
  { icon: Heart,  title: 'Compassionate Excellence', desc: 'Force-free methodology that respects your dog\'s emotional wellbeing while achieving extraordinary standards.' },
  { icon: Star,   title: 'Concierge Support',    desc: 'White-glove guidance at every step. You are never alone on this transformation journey.' },
]

const testimonials = [
  {
    quote: "Caspian's transformation has been nothing short of extraordinary. What Four Paws achieved in eight weeks took other trainers years to attempt.",
    author: 'Victoria H.', location: 'Kensington, London', dog: 'Golden Retriever', stars: 5,
  },
  {
    quote: "The level of sophistication in this programme matches everything else in our life. Duchess is now the composed, elegant companion I always knew she could be.",
    author: 'Sebastian M.', location: 'Chelsea, London', dog: 'Cavalier King Charles', stars: 5,
  },
  {
    quote: "Atlas went from reactive and anxious to calm and confident. The science behind this programme is extraordinary. Nothing else compares.",
    author: 'Arabella F.', location: 'Mayfair, London', dog: 'German Shepherd', stars: 5,
  },
]

const academyPreviews = [
  { title: 'Elite Puppy Foundations',        lessons: 24, weeks: 8,  level: 'Foundation', icon: '🐾' },
  { title: 'Luxury Behaviour Transformation',lessons: 24, weeks: 10, level: 'Advanced',   icon: '✨' },
  { title: 'Reactive Dog Recovery',          lessons: 24, weeks: 12, level: 'Specialist', icon: '🔬' },
  { title: 'Advanced Obedience Psychology',  lessons: 24, weeks: 10, level: 'Elite',      icon: '👑' },
]

const galleryImages = [
  { src: IMG.hero,       alt: 'Golden retriever with owner in luxury home', caption: 'Trust. Calm. Transformation.' },
  { src: IMG.calm,       alt: 'Calm labrador in luxury interior',           caption: 'The calmness you always imagined.' },
  { src: IMG.garden,     alt: 'Border collie in estate garden',             caption: 'Confidence restored.' },
  { src: IMG.connection, alt: 'Samoyed with owner in modern apartment',     caption: 'The bond you deserve.' },
  { src: IMG.estate,     alt: 'Irish wolfhound on English estate',          caption: 'Elite outdoor mastery.' },
  { src: IMG.training,   alt: 'Private training session',                   caption: 'Private. Intelligent. Yours.' },
]

// ─────────────────────────────────────────────────────────────
// AMBIENT PARTICLES
// ─────────────────────────────────────────────────────────────
function AmbientParticles({ count = 12 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width:  `${60 + (i % 4) * 40}px`,
            height: `${60 + (i % 4) * 40}px`,
            left:   `${(i * 17 + 5) % 95}%`,
            top:    `${(i * 23 + 8) % 90}%`,
            background: `radial-gradient(circle, rgba(201,168,76,${0.04 - (i % 3) * 0.01}) 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5], x: [0, (i % 2 ? 8 : -8), 0], y: [0, -10, 0] }}
          transition={{ duration: 5 + (i % 4) * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <div className="bg-charcoal-900 overflow-hidden">
      <ScrollProgressBar />

      {/* ═══════════════════════════════════════════════════════
          HERO — Cinematic image hero with parallax
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Hero image — parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <img src={IMG.hero} alt="Four Paws Academy — Luxury Canine Transformation"
            className="w-full h-full object-cover object-center"
            fetchpriority="high"
          />
          {/* Cinematic darkening overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.45) 100%)' }} />
          {/* Warm gold atmospheric tint */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 70% at 40% 60%, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
        </motion.div>

        {/* Ambient particles */}
        <AmbientParticles count={10} />

        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* Hero content */}
        <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ opacity: heroOpacity }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-10">
            <div className="divider-gold w-12" />
            <span className="section-label">The Luxury Canine Academy</span>
            <div className="divider-gold w-12" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-heading text-6xl sm:text-7xl lg:text-[100px] leading-[0.88] mb-8">
            Transform Your<br />
            <span className="text-gold-gradient italic">Dog's World</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="font-sans text-lg lg:text-xl font-light text-silver-200 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            The private academy for discerning owners who demand nothing less than extraordinary.
            Science-led. Compassion-driven. Results that redefine what's possible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="btn-gold flex items-center gap-2 text-xs">
              Begin Your Transformation <ArrowRight size={14} />
            </Link>
            <Link to="/about" className="btn-outline-gold text-xs">
              Discover the Academy
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[['500+', 'Dogs Transformed'], ['98%', 'Success Rate'], ['5★', 'Member Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="stat-number text-3xl font-light drop-shadow-lg">{num}</div>
                <div className="font-sans text-[10px] text-silver-400 tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-silver-500">Discover</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={16} className="text-gold-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EMOTIONAL INTRO — first story block
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto">
          <StoryBlock
            image={{ src: IMG.connection, alt: 'Emotional connection with dog' }}
            label="Your Companion Deserves More"
            headline="The Bond You Always<br /><em class='text-gold-gradient'>Imagined is Possible</em>"
            body="You love your dog unconditionally — yet living with anxiety, reactivity, or unpredictability robs you both of the deep, peaceful companionship you deserve. Four Paws Academy was built for owners who refuse to accept anything less than extraordinary."
            cta="Discover Our Approach"
            ctaLink="/about"
            imageLeft={false}
            quote={{
              text: "I didn't realise how much our relationship was being held back by behaviour I thought was just part of who she was. Four Paws changed everything.",
              author: 'Helena C., Chelsea'
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FULL BLEED — Calm landscape moment
      ═══════════════════════════════════════════════════════ */}
      <section>
        <FullBleedStory
          image={{ src: IMG.estate, alt: 'Dog walking on English estate' }}
          label="The Life You Envisioned"
          headline="Calm. Confident.<br /><em>Completely Yours.</em>"
          body="Imagine a dog that walks calmly at your side through any environment. That greets guests with poise. That settles with ease in any setting. This is not a dream — it is precisely what our clients experience."
          cta="Begin Your Journey"
          ctaLink="/login"
          overlayGradient="linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          BENEFITS GRID — animated feature cards
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto relative">
          <FadeIn className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">Why Four Paws</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-5xl lg:text-6xl mb-6">The Difference is<br /><em>Everything</em></h2>
            <p className="font-sans text-base font-light text-silver-400 max-w-xl mx-auto">
              Every element of our academy is designed with one purpose: to deliver transformation that lasts a lifetime.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <StaggerItem key={b.title}>
                <motion.div whileHover={{ y: -4, borderColor: 'rgba(201,168,76,0.4)' }}
                  className="glass-card gold-border-hover p-8 group cursor-default h-full relative overflow-hidden">
                  {/* Ambient hover glow */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
                  />
                  <div className="w-10 h-10 mb-6 relative">
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }} />
                    <b.icon size={20} className="text-gold-500 relative z-10 mt-2 ml-2" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-pearl mb-3">{b.title}</h3>
                  <p className="font-sans text-sm font-light text-silver-500 leading-relaxed">{b.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRANSFORMATION VISUAL — story block 2
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 40% at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto">
          <StoryBlock
            image={{ src: IMG.garden, alt: 'Calm dog in estate garden' }}
            label="The Transformation"
            headline="From Anxious &<br />Reactive to<br /><em class='text-gold-gradient'>Profoundly Calm</em>"
            subheadline="Permanent transformation. Not management."
            body="Most approaches manage the problem. We dissolve it. Our science-led methodology rebuilds the emotional foundation of your dog's behaviour — creating lasting calm that does not erode under real-world pressure."
            cta="Explore the Programmes"
            ctaLink="/login"
            imageLeft={true}
            stats={[
              { value: '8', label: 'Week Foundation' },
              { value: '98%', label: 'Success Rate' },
              { value: '500+', label: 'Transformed' },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CLIENT EMOTIONAL JOURNEY — vertical timeline
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">The Client Journey</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-5xl lg:text-6xl mb-4">Your Path to<br /><em>Extraordinary</em></h2>
            <p className="font-sans text-base text-silver-500 max-w-lg mx-auto font-light">
              Every transformation follows the same emotional arc — from recognition to mastery.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              {[
                { step: 1, icon: '💭', label: 'Recognition',       description: 'You recognise that your dog\'s behaviour is affecting the quality of your shared life — and that you deserve more.',                       colour: '#6B7280' },
                { step: 2, icon: '💔', label: 'The Struggle',      description: 'Walks become stressful. Visitors become unpredictable. The joy of dog ownership feels out of reach. You feel isolated in this.',            colour: '#8B5CF6' },
                { step: 3, icon: '✨', label: 'The Discovery',     description: 'You find Four Paws Academy — and something shifts. You realise there is a science-based path to the relationship you always imagined.',      colour: '#C9A84C' },
                { step: 4, icon: '🌱', label: 'The Programme',     description: 'Your personalised programme begins. Your AI-powered academy adapts to your dog\'s unique emotional profile in real time.',                   colour: '#10B981' },
                { step: 5, icon: '🏆', label: 'Transformation',    description: 'Week by week, the change is undeniable. Calmer walks. Confident greetings. An emotional depth to your relationship you\'ve never felt.',    colour: '#F59E0B' },
                { step: 6, icon: '👑', label: 'Elite Lifestyle',   description: 'Your transformed companion is now the dog you always dreamed of — elegant, calm, and an extension of the life you\'ve built.',               colour: '#C9A84C' },
              ].map((s, i) => (
                <FadeIn key={s.step} delay={i * 0.08}>
                  <JourneyStep {...s} isLast={i === 5} />
                </FadeIn>
              ))}
            </div>

            <FadeIn direction="left" className="sticky top-8 space-y-4">
              <CinematicReveal>
                <LuxuryFrame>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <img src={IMG.training} alt="Private training session"
                      className="w-full h-full object-cover" loading="lazy" decoding="async"
                    />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="section-label mb-1">Private Session</div>
                      <div className="font-serif text-xl text-pearl">The intelligence behind the transformation.</div>
                    </div>
                  </div>
                </LuxuryFrame>
              </CinematicReveal>

              <div className="glass-card p-6" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="font-sans text-[9px] text-gold-600 uppercase tracking-widest mb-3">Academy Intelligence</div>
                <div className="space-y-3">
                  {[
                    { label: 'AI Behaviour Analysis',    active: true  },
                    { label: 'Emotional State Tracking', active: true  },
                    { label: 'Digital Twin Modelling',   active: true  },
                    { label: 'Concierge Support',        active: true  },
                    { label: 'Weekly Intelligence Reports', active: false },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${f.active ? 'bg-gold-400' : 'bg-silver-800'}`}
                        style={f.active ? { boxShadow: '0 0 6px rgba(201,168,76,0.6)' } : {}} />
                      <span className={`font-sans text-xs ${f.active ? 'text-silver-400' : 'text-silver-700'}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LUXURY GALLERY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="divider-gold w-8" />
              <span className="section-label">Life at Four Paws</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-4xl lg:text-5xl">The World You're<br /><em>Stepping Into</em></h2>
          </FadeIn>
          <LuxuryGallery images={galleryImages} layout="editorial" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STORY BLOCK 3 — calm labrador
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <StoryBlock
            image={{ src: IMG.calm, alt: 'Calm labrador in luxury interior' }}
            label="The Result"
            headline="The Calmness You<br />Always<br /><em class='text-gold-gradient'>Imagined</em>"
            body="When you stand in a room and your dog simply settles — at ease, composed, a presence of calm rather than anxiety — that is the Four Paws result. Not trained compliance. Genuine emotional wellbeing."
            cta="Enter the Private Academy"
            ctaLink="/login"
            imageLeft={false}
            quote={{
              text: "Atlas is a different dog. Not because he's suppressed — because he's genuinely at peace. That peace has changed our entire home.",
              author: 'Arabella F., Mayfair'
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PULL QUOTES — emotional social proof
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="divider-gold w-8" />
              <span className="section-label">Member Voices</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-4xl lg:text-5xl">Stories That<br /><em>Speak for Themselves</em></h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }}
                  className="glass-card p-7 relative overflow-hidden h-full"
                  style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
                  <div className="absolute top-4 left-5 font-serif text-7xl leading-none select-none"
                    style={{ color: 'rgba(201,168,76,0.07)', fontStyle: 'italic' }}>"</div>
                  <div className="flex mb-4">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={11} className="text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <p className="font-serif text-sm font-light text-silver-300 leading-relaxed mb-5 relative z-10 italic">
                    "{t.quote}"
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <div className="font-sans text-xs font-medium text-pearl">{t.author}</div>
                    <div className="font-sans text-[9px] text-silver-600">{t.location} · {t.dog}</div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ACADEMY PREVIEW CARDS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">The Curriculum</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-5xl lg:text-6xl mb-4">Programmes Designed for<br /><em>Extraordinary Dogs</em></h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {academyPreviews.map((p, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -5, borderColor: 'rgba(201,168,76,0.4)' }}
                  className="glass-card gold-border-hover p-6 cursor-default h-full relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
                  <div className="text-4xl mb-5">{p.icon}</div>
                  <div className="font-sans text-[9px] uppercase tracking-widest text-gold-600 mb-2">{p.level}</div>
                  <h3 className="font-serif text-base font-medium text-pearl mb-3 leading-snug">{p.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-sans text-silver-600">
                    <span>{p.lessons} lessons</span>
                    <span className="w-px h-3 bg-silver-800" />
                    <span>{p.weeks} weeks</span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="text-center mt-12">
            <Link to="/login" className="btn-outline-gold text-xs inline-flex items-center gap-2">
              View All Programmes <ArrowRight size={13} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL FULL-BLEED CTA — garden image
      ═══════════════════════════════════════════════════════ */}
      <section>
        <PremiumCTA
          image={IMG.garden}
          headline="Begin Your Dog's<br /><em>Transformation Today</em>"
          subtext="The private academy is open to a select number of clients each season. Applications are reviewed personally by our senior behaviourists."
          primaryCta={{ label: 'Enter the Private Academy', link: '/login' }}
          secondaryCta={{ label: 'Learn More', link: '/about' }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER BRAND STRIP
      ═══════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-2xl">🐾</span>
            <div className="font-display text-lg font-light tracking-[0.25em] text-pearl uppercase">Four Paws</div>
            <div className="h-4 w-px bg-silver-800" />
            <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-silver-600">Elite Academy</div>
          </div>
          <div className="divider-gold max-w-32 mx-auto mb-5" />
          <p className="font-sans text-xs text-silver-700">
            The private academy for discerning owners. By invitation only.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <Link to="/about" className="font-sans text-[10px] text-silver-700 hover:text-silver-400 tracking-widest uppercase transition-colors">About</Link>
            <Link to="/login" className="font-sans text-[10px] text-silver-700 hover:text-silver-400 tracking-widest uppercase transition-colors">Login</Link>
            <Link to="/activate" className="font-sans text-[10px] text-silver-700 hover:text-silver-400 tracking-widest uppercase transition-colors">Activate</Link>
          </div>
          <p className="font-sans text-[9px] text-silver-800 mt-6">© {new Date().getFullYear()} Four Paws Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
