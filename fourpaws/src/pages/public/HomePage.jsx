import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Award, Star, Users, Zap, Shield, Heart, Crown, ChevronDown } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem, GoldLineReveal } from '../../components/animations/FadeIn'

const benefits = [
  { icon: Crown, title: 'Elite Methodology', desc: 'Psychology-first training rooted in cutting-edge canine science and decades of exclusive expertise.' },
  { icon: Award, title: 'Proven Transformation', desc: 'Every programme is designed to deliver permanent, measurable change in your dog\'s behaviour and character.' },
  { icon: Shield, title: 'Private Academy Access', desc: 'Members-only platform with exclusive content, personalised support, and a curated community of discerning owners.' },
  { icon: Zap, title: 'AI-Enhanced Enrichment', desc: 'Proprietary enrichment intelligence that adapts to your dog\'s unique personality and learning style.' },
  { icon: Heart, title: 'Compassionate Excellence', desc: 'Force-free methodology that respects your dog\'s emotional wellbeing while achieving exceptional standards.' },
  { icon: Star, title: 'Concierge Support', desc: 'White-glove guidance at every step. You are never alone on your transformation journey.' },
]

const testimonials = [
  {
    quote: 'Caspian\'s transformation has been nothing short of extraordinary. What Four Paws achieved in eight weeks took other trainers years to attempt.',
    author: 'Victoria H.',
    location: 'Kensington, London',
    dog: 'Golden Retriever',
    stars: 5,
  },
  {
    quote: 'The level of sophistication in this programme matches everything else in our life. Duchess is now the composed, elegant companion I always knew she could be.',
    author: 'Sebastian M.',
    location: 'Chelsea, London',
    dog: 'Cavalier King Charles',
    stars: 5,
  },
  {
    quote: 'Atlas went from reactive and anxious to calm and confident. The science behind this programme is extraordinary. Nothing else compares.',
    author: 'Arabella F.',
    location: 'Mayfair, London',
    dog: 'German Shepherd',
    stars: 5,
  },
]

const academyPreviews = [
  { title: 'Elite Puppy Foundations', lessons: 24, weeks: 8, level: 'Foundation', icon: '🐾' },
  { title: 'Luxury Behaviour Transformation', lessons: 24, weeks: 10, level: 'Advanced', icon: '✨' },
  { title: 'Reactive Dog Recovery', lessons: 24, weeks: 12, level: 'Specialist', icon: '🔬' },
  { title: 'Advanced Obedience Psychology', lessons: 24, weeks: 10, level: 'Elite', icon: '👑' },
]

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="bg-charcoal-900 overflow-hidden">

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(201,168,76,0.08) 0%, rgba(10,10,10,1) 70%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
          {/* Animated orbs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${300 + i * 200}px`,
                height: `${300 + i * 200}px`,
                left: `${20 + i * 25}%`,
                top: `${10 + i * 20}%`,
                background: `radial-gradient(circle, rgba(201,168,76,${0.03 - i * 0.008}) 0%, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* Fine grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </motion.div>

        {/* Content */}
        <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="divider-gold w-12" />
            <span className="section-label">The Luxury Canine Academy</span>
            <div className="divider-gold w-12" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-heading text-6xl sm:text-7xl lg:text-[96px] leading-[0.9] mb-8"
          >
            Transform Your<br />
            <span className="text-gold-gradient italic">Dog's World</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-sans text-lg font-light text-silver-300 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The private academy for discerning owners who demand nothing less than extraordinary. 
            Science-led. Compassion-driven. Results that redefine what's possible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="btn-gold flex items-center gap-2 text-xs">
              Begin Your Transformation
              <ArrowRight size={14} />
            </Link>
            <Link to="/about" className="btn-outline-gold text-xs">
              Discover the Academy
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[['500+', 'Dogs Transformed'], ['98%', 'Success Rate'], ['5★', 'Member Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="stat-number text-2xl font-light">{num}</div>
                <div className="font-sans text-[10px] text-silver-600 tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-silver-600">Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={16} className="text-gold-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 opacity-30"
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

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <StaggerItem key={b.title}>
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(201,168,76,0.4)' }}
                  className="glass-card gold-border-hover p-8 group cursor-default h-full"
                >
                  <div className="w-10 h-10 mb-6 relative">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                    />
                    <b.icon size={20} className="text-gold-500 relative z-10 mt-2 ml-2" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-pearl mb-3">{b.title}</h3>
                  <p className="font-sans text-sm font-light text-silver-400 leading-relaxed">{b.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="divider-gold" />
      </div>

      {/* ─── ACADEMY PREVIEW ─── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="flex items-center gap-3 mb-4">
                <div className="divider-gold w-8" />
                <span className="section-label">The Academy</span>
              </div>
              <h2 className="luxury-heading text-5xl lg:text-6xl mb-6">
                Five Elite<br />Programmes
              </h2>
              <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-8">
                From first-year foundations to advanced obedience mastery — our five comprehensive programmes represent the most sophisticated canine education available. Each one crafted by the UK's leading canine psychologists.
              </p>
              <div className="space-y-2 mb-10">
                {['24 expert-crafted lessons per course', 'Luxury video production quality', 'Downloadable resources & guides', 'Progress tracking & milestone rewards'].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-gold-500 rounded-full flex-shrink-0" />
                    <span className="font-sans text-sm font-light text-silver-300">{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" className="btn-gold inline-flex items-center gap-2 text-xs">
                Explore All Programmes
                <ArrowRight size={14} />
              </Link>
            </FadeIn>

            <FadeIn direction="left">
              <div className="grid grid-cols-2 gap-4">
                {academyPreviews.map((course, i) => (
                  <motion.div
                    key={course.title}
                    whileHover={{ y: -3, boxShadow: '0 0 30px rgba(201,168,76,0.1)' }}
                    className="glass-card p-5 gold-border-hover cursor-default"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <div className="text-2xl mb-3">{course.icon}</div>
                    <div className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold-600 mb-1">{course.level}</div>
                    <h4 className="font-serif text-sm font-medium text-pearl mb-3 leading-snug">{course.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-[10px] text-silver-600">{course.lessons} lessons</span>
                      <span className="text-silver-700">·</span>
                      <span className="font-sans text-[10px] text-silver-600">{course.weeks} weeks</span>
                    </div>
                    <div className="progress-bar mt-3">
                      <div className="progress-fill" style={{ width: '0%' }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-28 px-6 relative"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.03) 50%, transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">Success Stories</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-5xl lg:text-6xl">
              Extraordinary<br /><em>Results</em>
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <StaggerItem key={t.author}>
                <div className="glass-card gold-border p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={12} className="fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-base font-light text-silver-200 leading-relaxed italic flex-1 mb-6">
                    "{t.quote}"
                  </blockquote>
                  <div className="border-t border-white/5 pt-5">
                    <div className="font-sans text-sm font-medium text-pearl">{t.author}</div>
                    <div className="font-sans text-xs text-silver-600 mt-0.5">{t.location}</div>
                    <div className="font-sans text-[10px] text-gold-600 tracking-widest uppercase mt-1">{t.dog}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="divider-gold w-12" />
              <span className="section-label">Begin Today</span>
              <div className="divider-gold w-12" />
            </div>
            <h2 className="luxury-heading text-5xl lg:text-7xl mb-8">
              Your Dog's<br />
              <span className="text-gold-gradient italic">Finest Chapter</span><br />
              Starts Here
            </h2>
            <p className="font-sans text-base font-light text-silver-400 max-w-xl mx-auto mb-12">
              Join an exclusive community of discerning owners who have chosen the very best for their companions. 
              The transformation you've imagined is within reach.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="btn-gold flex items-center gap-2 text-xs">
                Join the Academy
                <ArrowRight size={14} />
              </Link>
              <Link to="/about" className="btn-outline-gold text-xs">
                Learn Our Philosophy
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">🐾</span>
                <div>
                  <div className="font-display text-base font-light tracking-[0.15em] text-pearl uppercase">Four Paws Academy</div>
                  <div className="font-sans text-[9px] font-medium tracking-[0.3em] uppercase text-gold-500">Luxury Canine Transformation</div>
                </div>
              </div>
              <p className="font-sans text-sm font-light text-silver-500 max-w-xs leading-relaxed">
                The premier destination for discerning dog owners who demand extraordinary results and an exceptional experience.
              </p>
            </div>
            <div>
              <div className="section-label mb-5">Academy</div>
              <div className="space-y-3">
                {['About Us', 'Our Programmes', 'Add-Ons', 'Philosophy'].map(l => (
                  <div key={l}>
                    <Link to="/about" className="font-sans text-sm font-light text-silver-500 hover:text-silver-200 transition-colors">{l}</Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="section-label mb-5">Contact</div>
              <div className="space-y-3">
                <p className="font-sans text-sm font-light text-silver-500">hello@fourpawsacademy.com</p>
                <p className="font-sans text-sm font-light text-silver-500">+44 20 7946 0958</p>
                <div className="flex gap-4 pt-2">
                  {['Instagram', 'Facebook'].map(s => (
                    <span key={s} className="font-sans text-xs font-light text-silver-600 hover:text-gold-500 cursor-pointer transition-colors">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="divider-gold mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans text-xs text-silver-700">© 2024 Four Paws Training & Enrichment Academy. All rights reserved.</p>
            <p className="font-sans text-xs text-silver-700">Crafted with excellence · London, UK</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
