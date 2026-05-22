// ─────────────────────────────────────────────────────────────────────────────
// useIntelligenceCore — unified intelligence hook
// Every component in the academy uses this single hook to access
// ALL AI intelligence. One import. One coherent data model.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useAI } from './useAI'
import {
  generateCoreIntelligence,
  generateBehaviouralNarrative,
  generateMilestoneNarrative,
  generateWeeklyNarrative,
  getTimeContext,
  getTimeAwareGreeting,
  SOUNDS,
  loadSoundPrefs,
  saveSoundPrefs,
  markNarrativeSeen,
  hasNarrativeBeenSeen,
} from '../ai/intelligenceCore'
import { loadAIMemory, loadStreak } from '../ai/aiMemory'
import { buildSingleSurface } from '../ai/narrativeVoice'

export function useIntelligenceCore() {
  const { state }         = useApp()
  const { dogProfile, behaviourScores, onboardingComplete } = useAI()

  const { enrolledCourses, courseProgress, clientProfile, currentUser } = state
  const client  = clientProfile || currentUser
  const dog     = dogProfile || state.dogProfile
  const memory  = useMemo(() => loadAIMemory(), [state.courseProgress, state.dogProfile])
  const streak  = useMemo(() => loadStreak(), [])
  const timeCtx = useMemo(() => getTimeContext(), [])

  // ── Core intelligence snapshot ─────────────────────────────
  const core = useMemo(() => {
    if (!dog) return null
    return generateCoreIntelligence(dog, client, enrolledCourses, courseProgress)
  }, [dog?.name, behaviourScores, enrolledCourses, Object.keys(courseProgress).join(','), memory.sessionCount])

  // ── Time-aware greeting ───────────────────────────────────
  const timeGreeting = useMemo(() =>
    getTimeAwareGreeting(
      client?.name?.split(' ')[0],
      dog?.name,
      memory.sessionCount || 0
    ),
    [client?.name, dog?.name, memory.sessionCount]
  )

  // ── Narrative helpers ─────────────────────────────────────
  const narrateProgress = useCallback((lessonCount, streak) =>
    generateMilestoneNarrative('lesson', dog?.name, lessonCount),
    [dog?.name]
  )

  const narrateWeek = useCallback((score) =>
    generateWeeklyNarrative(dog?.name, score),
    [dog?.name]
  )

  // ── Single-surface narrative output (ODIN doctrine) ───────
  const surface = useMemo(() =>
    buildSingleSurface(core, core?.behaviourScores, core?.emotionalState, streak, dog?.name),
    [core?.dogName, core?.behaviourScores, core?.emotionalState, streak]
  )

  // ── Sound helpers ─────────────────────────────────────────
  const sound = useMemo(() => ({
    play:           (name) => SOUNDS[name]?.(),
    activation:     () => SOUNDS.activation(),
    complete:       () => SOUNDS.complete(),
    achievement:    () => SOUNDS.achievement(),
    tap:            () => SOUNDS.tap(),
    notification:   () => SOUNDS.notification(),
    unlock:         () => SOUNDS.unlock(),
    transition:     () => SOUNDS.transition(),
    prefs:          loadSoundPrefs(),
    setEnabled:     (v) => saveSoundPrefs({ ...loadSoundPrefs(), enabled: v }),
    setVolume:      (v) => saveSoundPrefs({ ...loadSoundPrefs(), volume: v }),
  }), [])

  // ── Narrative state helpers ───────────────────────────────
  const narrative = useMemo(() => ({
    markSeen:  markNarrativeSeen,
    hasSeen:   hasNarrativeBeenSeen,
    primary:   core?.narratives?.[0]?.text || null,
    secondary: core?.narratives?.[1]?.text || null,
    insight:   core?.dailyInsight           || null,
    coaching:  core?.coaching               || null,
    weekly:    core?.weeklyNarrative        || null,
    greeting:  core?.greeting              || timeGreeting,
  }), [core, timeGreeting])

  return {
    // Core snapshot
    core,
    ready:         !!core && onboardingComplete,
    onboardingComplete,

    // Direct access
    dogProfile:        dog,
    clientProfile:     client,
    behaviourScores:   core?.behaviourScores   || behaviourScores,
    emotionalState:    core?.emotionalState    || null,
    archetype:         core?.archetype         || null,
    tier:              core?.tier              || null,
    intScores:         core?.intScores         || null,
    alerts:            core?.alerts            || [],
    achievements:      core?.achievements      || [],
    streak,
    memory,

    // Narratives
    narrative,
    timeGreeting,
    timeContext: timeCtx,

    // Helpers
    sound,
    narrateProgress,
    narrateWeek,
  }
}
