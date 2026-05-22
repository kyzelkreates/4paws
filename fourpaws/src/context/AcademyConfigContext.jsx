// ─────────────────────────────────────────────────────────────
// FOUR PAWS — ACADEMY CONFIG CONTEXT
// Provides dynamic package configuration to the entire app.
// Reads from localStorage, falls back to full-access default.
// ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  loadAcademyConfig, saveAcademyConfig, buildAcademyConfig,
  hasFeature, hasAICapability, hasDashboard,
  getConciergeGreeting, getMotionLevel,
  PACKAGES, TIER_LEVELS, FEATURE_MATRIX, buildDynamicNav,
  TRANSFORMATION_PATHWAYS, ALL_NAV_ITEMS,
} from '../config/academyConfig'
import { loadActiveTheme, saveActiveTheme, VISUAL_THEMES } from '../ai/wellness'

const AcademyConfigContext = createContext(null)

// Full nav — used as fallback when no config yet
const ALL_FEATURES = Object.keys(FEATURE_MATRIX)

export function AcademyConfigProvider({ children }) {
  const [config,  setConfig]  = useState(null)
  const [theme,   setTheme]   = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Initialise ────────────────────────────────────────────
  useEffect(() => {
    const stored = loadAcademyConfig()
    let cfg
    if (stored?.version >= 3) {
      cfg = stored
    } else {
      // Default: full founders access so existing clients see everything
      cfg = buildAcademyConfig({ packageId: 'FOUNDERS_CIRCLE' })
      saveAcademyConfig(cfg)
    }
    setConfig(cfg)

    const activeTheme = loadActiveTheme()
    setTheme(activeTheme)
    setLoading(false)
  }, [])

  // ── Apply theme CSS vars ──────────────────────────────────
  useEffect(() => {
    if (!theme) return
    const r = document.documentElement
    r.style.setProperty('--academy-primary', theme.primary)
    r.style.setProperty('--academy-bg',      theme.bg)
    r.style.setProperty('--academy-surface', theme.surface)
    r.style.setProperty('--academy-text',    theme.text)
    r.style.setProperty('--academy-accent',  theme.accent)
  }, [theme])

  // ── Apply package colour ──────────────────────────────────
  useEffect(() => {
    if (!config) return
    const r = document.documentElement
    r.style.setProperty('--package-colour',      config.colour         || '#C9A84C')
    r.style.setProperty('--package-tier-colour', config.tierMeta?.colour || '#C9A84C')
  }, [config])

  // ─────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────
  const activatePackage = useCallback((packageId, overrides = {}) => {
    const built = buildAcademyConfig({ packageId, ...overrides })
    setConfig(built)
    saveAcademyConfig(built)
    const themeId = overrides.theme || built.theme
    if (themeId && VISUAL_THEMES[themeId]) {
      setTheme(VISUAL_THEMES[themeId])
      saveActiveTheme(themeId)
    }
    return built
  }, [])

  const switchTheme = useCallback((themeId) => {
    const t = VISUAL_THEMES[themeId]
    if (!t) return
    setTheme(t)
    saveActiveTheme(themeId)
    setConfig(prev => {
      if (!prev) return prev
      const updated = { ...prev, theme: themeId, savedAt: new Date().toISOString() }
      saveAcademyConfig(updated)
      return updated
    })
  }, [])

  const updateConfig = useCallback((patch) => {
    setConfig(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...patch, savedAt: new Date().toISOString() }
      saveAcademyConfig(updated)
      return updated
    })
  }, [])

  // ─────────────────────────────────────────────────────────
  // DERIVED (memoised)
  // ─────────────────────────────────────────────────────────
  const can = useMemo(() => ({
    feature:       (f) => hasFeature(config, f),
    ai:            (a) => hasAICapability(config, a),
    dashboard:     (d) => hasDashboard(config, d),
    motion:            getMotionLevel(config),
    voiceCoach:        config?.voiceCoach      ?? true,
    digitalTwin:       config?.digitalTwin     ?? true,
    whiteGlove:        config?.whiteGlove      ?? false,
    foundersAccess:    config?.foundersAccess  ?? false,
  }), [config])

  const navItems = useMemo(() => {
    if (!config) return buildDynamicNav(ALL_FEATURES)
    return config.navItems || buildDynamicNav(config.enabledFeatures === '__ALL__' ? ALL_FEATURES : (config.enabledFeatures || ALL_FEATURES))
  }, [config])

  const tierMeta       = config?.tierMeta      || TIER_LEVELS.FOUNDERS
  const pathwayMeta    = config?.pathwayMeta   || TRANSFORMATION_PATHWAYS.FOUNDERS
  const conciergeLevel = config?.conciergeLevel|| 'white_glove'
  const packageMeta    = PACKAGES[config?.packageId] || PACKAGES.FOUNDERS_CIRCLE

  const greeting = useCallback((clientName, dogName) =>
    getConciergeGreeting(config, clientName, dogName),
    [config]
  )

  const value = {
    config,
    theme,
    loading,
    can,
    navItems,
    tierMeta,
    pathwayMeta,
    conciergeLevel,
    packageMeta,
    activatePackage,
    switchTheme,
    updateConfig,
    greeting,
    packageId:   config?.packageId   || 'FOUNDERS_CIRCLE',
    tierLevel:   config?.tierLevel   || 'FOUNDERS',
    themeId:     config?.theme       || 'obsidian_gold',
    motionLevel: config?.motionLevel || 'ultra',
  }

  if (loading) return null   // brief — config loaded synchronously from localStorage

  return (
    <AcademyConfigContext.Provider value={value}>
      {children}
    </AcademyConfigContext.Provider>
  )
}

export function useAcademyConfig() {
  const ctx = useContext(AcademyConfigContext)
  if (!ctx) throw new Error('useAcademyConfig must be used within AcademyConfigProvider')
  return ctx
}
