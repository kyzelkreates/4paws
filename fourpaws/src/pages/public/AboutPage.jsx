import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award, BookOpen, Heart, Star, Zap } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

const philosophy = [
  { icon: Heart, title: 'Compassion First', desc: 'Every interaction is built on trust, respect, and genuine care for your dog\'s emotional wellbeing.' },
  { icon: BookOpen, title: 'Science-Led', desc: 'Our methodology is grounded in the latest canine psychology, neuroscience, and behavioural science.' },
  { icon: Award, title: 'Excellence Always', desc: 'We set and maintain the highest standards in canine education — nothing less is acceptable.' },
  { icon: Zap, title: 'AI-Enhanced', desc: 'Proprietary enrichment intelligence personalises every programme for your dog\'s unique profile.' },
]

const stats = [
  { num: '500+', label: 'Dogs Transformed' },
  { num: '12', label: 'Years of Excellence' },
  { num: '98%', label: 'Satisfaction Rate' },
  { num: '5★', label: 'Member Rating' },
]

export default function AboutPage() {
  return (
    <div className="bg-charcoal-900 pt-20 overflow-hidden">

      {/* Hero */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="divider-gold w-8" />
            <span className="section-label">Our Story</span>
            <div className="divider-gold w-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-heading text-6xl lg:text-7xl mb-8"
          >
            Born from a Belief<br />
            that <em className="text-gold-gradient">Dogs Deserve More</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-sans text-lg font-light text-silver-300 max-w-2xl mx-auto leading-relaxed"
          >
            Four Paws Academy was founded on a single, uncompromising belief: that the relationship between a dog and their owner 
            is one of life's most extraordinary gifts — and it deserves to be extraordinary in every way.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              {/* Image placeholder */}
              <div className="relative">
                <div className="glass-card gold-border aspect-[4/5] flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🐕</div>
                    <div className="section-label">The Academy</div>
                  </div>
                  {/* Gold corner accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold-500/40" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold-500/40" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold-500/40" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold-500/40" />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -right-6 glass-card gold-border p-5 max-w-[180px]"
                >
                  <div className="stat-number text-3xl mb-1">12</div>
                  <div className="font-sans text-[10px] text-silver-500 tracking-widest uppercase leading-snug">Years of canine excellence</div>
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="flex items-center gap-3 mb-4">
                <div className="divider-gold w-8" />
                <span className="section-label">Our Mission</span>
              </div>
              <h2 className="luxury-heading text-4xl lg:text-5xl mb-6">
                Redefining What's Possible for Dogs and Their Owners
              </h2>
              <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-5">
                Four Paws Academy was born from twelve years of working with the UK's most discerning dog owners — 
                people who view their dogs not as pets, but as beloved family members deserving of the finest care and education.
              </p>
              <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-5">
                We built a programme that matched the standards of everything else in our clients' lives: 
                beautifully crafted, expertly executed, and quietly extraordinary in its results.
              </p>
              <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-10">
                Today, Four Paws Academy stands as the UK's premier luxury canine transformation platform — 
                where science, compassion, and excellence converge.
              </p>
              <Link to="/login" className="btn-gold inline-flex items-center gap-2 text-xs">
                Join the Academy
                <ArrowRight size={14} />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 relative"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.03) 50%, transparent)' }}>
        <div className="max-w-4xl mx-auto">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <StaggerItem key={s.label}>
                <div className="text-center">
                  <div className="stat-number text-5xl lg:text-6xl mb-2">{s.num}</div>
                  <div className="font-sans text-xs text-silver-600 tracking-widest uppercase">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">Our Philosophy</span>
              <div className="divider-gold w-8" />
            </div>
            <h2 className="luxury-heading text-5xl mb-6">The Four Pillars of<br /><em>Elite Training</em></h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {philosophy.map(p => (
              <StaggerItem key={p.title}>
                <div className="glass-card gold-border-hover p-8 text-center group">
                  <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-gold-500/20 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                    <p.icon size={20} className="text-gold-500" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-pearl mb-3">{p.title}</h3>
                  <p className="font-sans text-sm font-light text-silver-500 leading-relaxed">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card gold-border p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 50% 80% at 100% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <FadeIn>
                <div className="flex items-center gap-3 mb-4">
                  <div className="divider-gold w-8" />
                  <span className="section-label">AI-Enhanced Learning</span>
                </div>
                <h2 className="luxury-heading text-4xl lg:text-5xl mb-6">
                  Intelligence That<br />Adapts to <em>Your Dog</em>
                </h2>
                <p className="font-sans text-base font-light text-silver-400 leading-relaxed mb-6">
                  Our proprietary AI enrichment engine analyses your dog's progress, learning style, and behavioural profile 
                  to intelligently personalise every aspect of their programme.
                </p>
                <p className="font-sans text-base font-light text-silver-400 leading-relaxed">
                  The result is an education that feels custom-built — because it is.
                </p>
              </FadeIn>
              <FadeIn direction="left">
                <div className="space-y-4">
                  {[
                    'Personalised lesson sequencing',
                    'Adaptive pacing based on progress',
                    'Enrichment recommendations tailored to breed & age',
                    'Behavioural pattern recognition',
                    'Progress celebration & milestone rewards',
                  ].map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 bg-charcoal-900 rounded-full" />
                      </div>
                      <span className="font-sans text-sm font-light text-silver-300">{f}</span>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="divider-gold w-8" />
              <span className="section-label">The Founder</span>
              <div className="divider-gold w-8" />
            </div>
          </FadeIn>
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="glass-card gold-border p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-charcoal-800 border border-gold-500/30 flex items-center justify-center text-3xl">
                  👩‍🏫
                </div>
                <h3 className="font-display text-3xl font-light text-pearl mb-2">Dr. Charlotte Pemberton</h3>
                <div className="section-label mb-6">Founder & Chief Behaviourist</div>
                <div className="divider-gold mb-6" />
                <p className="font-serif text-lg font-light text-silver-300 leading-relaxed italic mb-6">
                  "I created Four Paws Academy because I believed that exceptional dog owners deserved an exceptional academy. 
                  Not just good training — but a transformative experience that honours the profound bond between dog and human."
                </p>
                <p className="font-sans text-sm font-light text-silver-500 leading-relaxed">
                  BSc (Hons) Animal Behaviour · MSc Canine Cognition · PhD Companion Animal Psychology<br />
                  Fellow of the Association of Pet Behaviour Counsellors · 12 years clinical practice
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="luxury-heading text-5xl lg:text-6xl mb-8">
              Ready to Begin?
            </h2>
            <p className="font-sans text-base font-light text-silver-400 mb-10">
              Join the exclusive community of discerning owners who have transformed their relationship with their dogs.
            </p>
            <Link to="/login" className="btn-gold inline-flex items-center gap-2 text-xs">
              Begin Your Journey
              <ArrowRight size={14} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-sans text-xs text-silver-700">© 2024 Four Paws Training & Enrichment Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
