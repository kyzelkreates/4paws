// ─────────────────────────────────────────────────────────────
// useAI — React hook for offline AI intelligence
// Connects AI engine to AppContext. Single integration point.
// ─────────────────────────────────────────────────────────────
import { useCallback, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  scoreBehaviour,
  recommendCourses,
  recommendAddons,
  generateBehaviourInsight,
  getDailyPrompt,
  generateProgressInsight,
} from '../ai/behaviourEngine'
import {
  loadAIMemory,
  saveRecommendations,
  recordBehaviourSnapshot,
  generateEnrichmentPlan,
  recordLessonActivity,
  loadStreak,
  checkAndRecordMilestone,
  recordSession,
  markOnboardingComplete,
  isOnboardingComplete,
  patchAIMemory,
} from '../ai/aiMemory'

export function useAI() {
  const { state, dispatch, ACTIONS } = useApp()

  const memory = useMemo(() => loadAIMemory(), [state.dogProfile, state.behaviourScores, state.courseProgress])

  // ── Run full AI analysis on a dog profile ─────────────────
  const runAnalysis = useCallback((dogProfile, enrolledCourses = [], ownedAddons = []) => {
    const scores       = scoreBehaviour(dogProfile)
    const courses      = recommendCourses(scores, dogProfile, enrolledCourses)
    const addons       = recommendAddons(scores, dogProfile, ownedAddons)
    const enrichment   = generateEnrichmentPlan(scores, dogProfile)
    const insight      = generateBehaviourInsight(dogProfile.name, scores)
    const progressNote = generateProgressInsight(dogProfile.name, state.courseProgress, [])
    const dailyPrompt  = getDailyPrompt(dogProfile.name)

    // Persist to AI memory
    recordBehaviourSnapshot(scores, dogProfile)
    saveRecommendations(courses, addons, enrichment)

    // Hydrate AppContext
    dispatch({ type: ACTIONS.SET_DOG_PROFILE,       payload: dogProfile })
    dispatch({ type: ACTIONS.SET_BEHAVIOUR_SCORES,  payload: scores })
    dispatch({ type: ACTIONS.SET_AI_RECOMMENDATIONS, payload: { courses, addons, enrichment } })
    dispatch({ type: ACTIONS.SET_TRAINING_INSIGHTS,  payload: { insight, progressNote, dailyPrompt } })

    return { scores, courses, addons, enrichment, insight, dailyPrompt }
  }, [state.courseProgress, dispatch, ACTIONS])

  // ── Complete onboarding ────────────────────────────────────
  const completeOnboarding = useCallback((dogProfile, clientProfile) => {
    markOnboardingComplete(dogProfile, clientProfile)
    dispatch({ type: ACTIONS.SET_DOG_PROFILE,    payload: dogProfile })
    dispatch({ type: ACTIONS.SET_CLIENT_PROFILE, payload: { ...state.clientProfile, ...clientProfile } })
    dispatch({ type: ACTIONS.SET_ONBOARDING_DONE })
    runAnalysis(dogProfile, state.enrolledCourses, state.ownedAddons)
  }, [state, dispatch, ACTIONS, runAnalysis])

  // ── Check milestones on lesson completion ─────────────────
  const checkMilestone = useCallback(() => {
    const total = Object.values(state.courseProgress)
      .reduce((a, p) => a + (p.completedLessons?.length || 0), 0)
    const dogName = state.dogProfile?.name || 'your dog'
    recordLessonActivity()
    return checkAndRecordMilestone(total, dogName)
  }, [state.courseProgress, state.dogProfile])

  // ── Getters ────────────────────────────────────────────────
  const getDailyInsight = useCallback(() => {
    const dog = state.dogProfile
    if (!dog) return null
    return {
      prompt:   getDailyPrompt(dog.name),
      streak:   loadStreak(),
      insight:  state.trainingInsights?.insight || generateBehaviourInsight(dog.name, state.behaviourScores),
    }
  }, [state.dogProfile, state.behaviourScores, state.trainingInsights])

  const getEnrichmentPlan = useCallback(() => {
    if (memory.enrichmentPlans?.length) return memory.enrichmentPlans
    return generateEnrichmentPlan(state.behaviourScores, state.dogProfile)
  }, [state.behaviourScores, state.dogProfile, memory])

  const onboardingComplete = useMemo(() => {
    return state.onboardingCompleted || isOnboardingComplete()
  }, [state.onboardingCompleted])

  return {
    runAnalysis,
    completeOnboarding,
    checkMilestone,
    getDailyInsight,
    getEnrichmentPlan,
    onboardingComplete,
    memory,
    behaviourScores:    state.behaviourScores,
    aiRecommendations:  state.aiRecommendations,
    dogProfile:         state.dogProfile,
    trainingInsights:   state.trainingInsights,
    streak:             loadStreak(),
  }
}
