import React from 'react'
import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ADDONS } from '../../data/courses'
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/animations/FadeIn'

export default function AddonsPage() {
  const { state, notify } = useApp()
  const { ownedAddons } = state

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">
      <FadeIn className="mb-10">
        <div className="section-label mb-2">Premium Supplements</div>
        <h1 className="luxury-heading text-4xl lg:text-5xl mb-3">Academy Add-Ons</h1>
        <p className="font-sans text-base font-light text-silver-500 max-w-xl">
          Six specialist programmes designed to elevate your dog's transformation beyond the core curriculum.
        </p>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ADDONS.map((addon, i) => {
          const owned = ownedAddons.includes(addon.id)
          return (
            <StaggerItem key={addon.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`glass-card h-full flex flex-col relative overflow-hidden
                  ${owned ? 'border border-gold-500/30' : 'gold-border-hover'}`}
              >
                {owned && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gold-gradient rounded-full flex items-center justify-center">
                    <Check size={10} className="text-charcoal-900" />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="text-3xl mb-4">{addon.icon}</div>
                  <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-silver-600 mb-1">
                    {owned ? <span className="text-gold-500">Owned</span> : 'Add-On'}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-pearl mb-2 leading-snug">{addon.title}</h3>
                  <p className="font-sans text-xs font-light text-silver-500 italic mb-3">{addon.subtitle}</p>
                  <p className="font-sans text-xs font-light text-silver-400 leading-relaxed mb-5">{addon.description}</p>

                  <div className="space-y-1.5 mb-5">
                    {addon.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gold-500 rounded-full flex-shrink-0" />
                        <span className="font-sans text-xs text-silver-400">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="stat-number text-xl">{addon.price}</div>
                    <div className="font-sans text-[10px] text-silver-600">{addon.duration} · {addon.lessons} lessons</div>
                  </div>
                  {owned ? (
                    <div className="btn-outline-gold text-xs py-2 px-4 flex items-center gap-1 cursor-default">
                      <Check size={12} /> Enrolled
                    </div>
                  ) : (
                    <button
                      onClick={() => notify('Contact the academy to purchase this add-on.', 'info')}
                      className="btn-gold text-xs py-2 px-4 flex items-center gap-1"
                    >
                      <Lock size={11} /> Enquire
                    </button>
                  )}
                </div>
              </motion.div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      <FadeIn className="mt-10">
        <div className="glass-card p-8 text-center" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
          <p className="font-sans text-sm font-light text-silver-500 mb-2">
            To purchase add-ons, contact your academy concierge.
          </p>
          <p className="font-sans text-xs text-silver-600">
            All add-ons are assigned by the academy team directly to your account.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
