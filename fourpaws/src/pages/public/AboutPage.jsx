import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award, BookOpen, Heart, Star, Zap, Shield, Users } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem, CinematicReveal, LuxuryFrame, ScrollProgressBar } from '../../components/animations/FadeIn'
import { StoryBlock, FullBleedStory, PullQuote, PremiumCTA, JourneyStep } from '../../components/ui/VisualStoryBlock'
import LuxuryGallery from '../../components/ui/LuxuryGallery'

const IMG = {
  hero:        'https://media.base44.com/images/public/6a0f87a2403280642106cb46/33f547c90_generated_image.png',
  calm:        'https://media.base44.com/images/public/6a0f87a2403280642106cb46/c9bb3e265_generated_image.png',
  garden:      'https://media.base44.com/images/public/6a0f87a2403280642106cb46/873b16b5b_generated_image.png',
  transform:   'https://media.base44.com/images/public/6a0f87a2403280642106cb46/1d0305805_generated_image.png',
  connection:  'https://media.base44.com/images/public/6a0f87a2403280642106cb46/ad7860d46_generated_image.png',
  estate:      'https://media.base44.com/images/public/6a0f87a2403280642106cb46/1e1d50ea4_generated_image.png',
  training:    'https://media.base44.com/images/public/6a0f87a2403280642106cb46/630d9b1b4_generated_image.png',
}

const philosophy = [
  { icon: Heart,    title: 'Compassion First',   desc: 'Every interaction is built on trust, respect, and genuine care for your dog\'s emotional wellbeing. Force-free is not a method — it is a non-negotiable foundation.' },
  { icon: BookOpen, title: 'Science-Led',         desc: 'Our methodology draws on the latest canine psychology, neuroscience, and attachment theory — translated into practical, elegant programmes.' },
  { icon: Award,    title: 'Excellence Always',   desc: 'We set and maintain the highest standards in canine education. Nothing short of extraordinary is acceptable to our clients — or to us.' },
  { icon: Zap,      title: 'AI-Enhanced',         desc: 'Our proprietary intelligence platform personalises every programme for your dog\'s unique emotional profile, learning style, and transformation trajectory.' },
  { icon: Shield,   title: 'Private & Exclusive', desc: 'Four Paws is a private academy. We accept a limited number of clients each season, ensuring every family receives the attention they deserve.' },
  { icon: Users,    title: 'Lifetime Support',    desc: 'Transformation is not a destination — it\'s an ongoing journey. Our concierge members receive lifetime access to evolving content and direct support.' },
]

const stats = [
  { num: '500+', label: 'Dogs Transformed' },
  { num: '12',   label: 'Years of Excellence' },
  { num: '98%',  label: 'Satisfaction Rate'   },
  { num: '5★',   label: 'Member Rating'       },
]

const galleryImages = [
  { src: IMG.estate,     alt: 'Estate lifestyle dog walking' },
  { src: IMG.training,   alt: 'Private training session'     },
  { src: IMG.garden,     alt: 'Estate garden calm dog'       },
  { src: IMG.connection, alt: 'Owner and dog emotional bond' },
]

export default function AboutPage() {
  return (
    <div className="bg-charcoal-900 pt-20 overflow-hidden">
      <ScrollProgressBar />

      {/* ═══════════════════════════════════════════════════════
          HERO — full-bleed cinematic
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="Four Paws Academy"
            className="w-full h-full object-cover object-center"
            fetchpriority="high"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.4) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
        </div>

        <div className="relative z-10 flex items-center min-h-[60vh] px-6 py-20 max-w-4xl">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6">
              <div className="divider-gold w-8" />
              <span className="section-label">Our Story</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-heading text-5xl lg:text-7xl mb-7 leading-tight">
              Born from a Belief<br />that <em className="text-gold-gradient">Dogs Deserve More</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="font-sans text-lg font-light text-silver-200 max-w-xl leading-relaxed mb-8">
              Four Paws Academy was founded on a single, uncompromising belief: that the relationship between a dog and their owner
              is one of life's most extraordinary gifts — and it deserves to be extraordinary in every way.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <Link to="/login" className="btn-gold inline-flex items-center gap-2 text-xs">
                Enter the Academy <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-6 border-y border-white/5"
        style={{ background: 'linear-gradient(135deg, #0D0D0A 0%, #0A0A08 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <FadeIn key={s.label} className="text-center">
                <div className="stat-number text-4xl font-light mb-1">{s.num}</div>
                <div className="font-sans text-[10px] text-silver-600 uppercase tracking-widest">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          OUR STORY — story block
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <StoryBlock
            image={{ src: IMG.training, alt: 'Private training session' }}
            label="The Foundation"
            headline="Where Science Meets<br /><em class='text-gold-gradient'>Compassion</em>"
            body="Four Paws Academy was built by behaviourists who understood that most dogs are not failed by their owners — they are failed by the systems available to their owners. We created the academy that should have always existed: science-led, compassion-first, and profoundly effective."
            body2="Over twelve years, we have developed a methodology that combines the latest canine psychology with an elegant, accessible delivery system. The result is transformation that is permanent — not temporary management."
            cta="Meet Our Methodology"
            ctaLink="/login"
            imageLeft={true}
            quote={{
              text: "We saw too many brilliant dogs living in anxiety because their owners had no access to the right tools. That's why Four Paws exists.",
              author: 'Academy Founders'
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FULL BLEED — connection moment
      ═══════════════════════════════════════════════════════ */}
      <FullBleedStory
        image={{ src: IMG.connection, alt: 'Owner and dog emotional connection' }}
        label="The Connection"
        headline="Every Dog Deserves<br />to Feel <em>Safe.</em>"
        body="Behind every reactive dog is an anxious dog. Behind every anxious dog is an unmet emotional need. Our entire methodology is built around addressing that need — with intelligence, patience, and genuine care."
        cta="Begin the Journey"
        ctaLink="/login"
        textAlign="right"
        overlayGradient="linear-gradient(270deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)"
      />

      {/* ═══════════════════════════════════════════════════════
          PHILOSOPHY CARDS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">Our Principles</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-5xl mb-4">Six Principles.<br /><em>One Standard.</em></h2>
            <p className="font-sans text-base text-silver-500 max-w-lg mx-auto font-light">
              Every decision we make is guided by these principles. Together, they define what it means to be Four Paws.
            </p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {philosophy.map((p, i) => (
              <StaggerItem key={p.title}>
                <motion.div whileHover={{ y: -4, borderColor: 'rgba(201,168,76,0.4)' }}
                  className="glass-card gold-border-hover p-8 h-full relative overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)' }}
                  />
                  <div className="w-10 h-10 mb-6 relative">
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }} />
                    <p.icon size={20} className="text-gold-500 relative z-10 mt-2 ml-2" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-pearl mb-3">{p.title}</h3>
                  <p className="font-sans text-sm font-light text-silver-500 leading-relaxed">{p.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STORY BLOCK 2 — estate lifestyle
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 40% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto">
          <StoryBlock
            image={{ src: IMG.estate, alt: 'Dog on English estate' }}
            label="The Lifestyle"
            headline="Dogs Built for the<br /><em class='text-gold-gradient'>Life You Live</em>"
            body="Our clients are not ordinary dog owners. They hold high standards in every area of their lives — and they extend those standards to their relationship with their dog. Four Paws was created specifically for them."
            cta="View Our Programmes"
            ctaLink="/login"
            imageLeft={false}
            stats={[
              { value: '12', label: 'Years' },
              { value: '500+', label: 'Families' },
              { value: '5★', label: 'Rating' },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GALLERY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="divider-gold w-8" />
              <span className="section-label">The Academy in Moments</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-4xl">A Glimpse Into<br /><em>Four Paws World</em></h2>
          </FadeIn>
          <LuxuryGallery images={galleryImages} layout="wide-strip" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PULL QUOTE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-12 px-6">
        <PullQuote
          text="Twelve years of seeing dogs transform has never lost its magic. Every calm walk, every settled evening, every repaired relationship — this is why we exist."
          author="Four Paws Academy"
          location="Founded London, 2012"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════ */}
      <PremiumCTA
        image={IMG.garden}
        headline="Your Dog's Transformation<br /><em>Starts Here</em>"
        subtext="The private academy is accepting applications from a select number of new families this season. We would be honoured to welcome you."
        primaryCta={{ label: 'Apply for Membership', link: '/login' }}
        secondaryCta={{ label: 'Return Home', link: '/' }}
      />
    </div>
  )
}
