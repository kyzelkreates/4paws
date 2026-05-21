// ─────────────────────────────────────────────────────────────
// SESSION RESTORE HOOK
// On app mount: verifies the license, then restores session state.
// The AcademyLockGate handles enforcement — this hook just primes
// AppContext so the rest of the app has the right data immediately.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { verifyLicense, LICENSE_STATUS }  from '../utils/academyLicense'
import {
  getLinkedDeviceIdentity,
  getClientIdentity,
  lookupByLinkCode,
  syncProgressToRegistry,
} from '../utils/academyIdentity'
import {
  loadAIMemory,
  isOnboardingComplete,
} from '../ai/aiMemory'
import {
  scoreBehaviour,
  generateBehaviourInsight,
  getDailyPrompt,
} from '../ai/behaviourEngine'

export function useSessionRestore() {
  const { state, dispatch, ACTIONS, setUser } = useApp()
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    // Already authenticated in this React session — nothing to restore
    if (state.isAuthenticated) {
      setRestoring(false)
      return
    }

    // Admins restore via LoginPage — no license to check
    // (admin has no license; skip)
    attemptRestore().finally(() => setRestoring(false))
  }, [])

  async function attemptRestore() {
    // ── PRIMARY PATH: license-based restore ─────────────────
    const { valid, status, license } = verifyLicense()

    if (valid && license) {
      const { clientSnapshot, dogSnapshot, academyId, academyLinkCode } = license
      const aiMemory = loadAIMemory()

      const restoredUser = {
        id:              clientSnapshot.clientId,
        name:            clientSnapshot.name,
        email:           clientSnapshot.email,
        role:            'client',
        academyId,
        academyLinkCode,
        academyStatus:   'active',
        enrolledCourses: clientSnapshot.enrolledCourses || [],
        ownedAddons:     clientSnapshot.ownedAddons     || [],
        linkedDevices:   [],
      }

      setUser(restoredUser)
      dispatch({ type: ACTIONS.SET_CLIENT_PROFILE,   payload: restoredUser })
      dispatch({ type: ACTIONS.SET_ENROLLED_COURSES, payload: restoredUser.enrolledCourses })
      dispatch({ type: ACTIONS.SET_OWNED_ADDONS,     payload: restoredUser.ownedAddons })
      dispatch({ type: ACTIONS.SET_PROGRESS,         payload: clientSnapshot.courseProgress || {} })
      dispatch({
        type: ACTIONS.SET_ACADEMY_IDENTITY,
        payload: { academyLinkCode, academyId, academyStatus: 'active', linkedDevices: [] }
      })

      // Restore AI layer
      const dog = aiMemory?.dogProfile || dogSnapshot || null
      if (dog) {
        dispatch({ type: ACTIONS.SET_DOG_PROFILE, payload: dog })
        const scores = aiMemory?.behaviourScores || scoreBehaviour(dog)
        if (scores) dispatch({ type: ACTIONS.SET_BEHAVIOUR_SCORES, payload: scores })
        dispatch({
          type: ACTIONS.SET_TRAINING_INSIGHTS,
          payload: {
            insight:     generateBehaviourInsight(dog.name, scores),
            dailyPrompt: getDailyPrompt(dog.name),
          }
        })
      }
      if (aiMemory?.aiRecommendations) {
        dispatch({ type: ACTIONS.SET_AI_RECOMMENDATIONS, payload: aiMemory.aiRecommendations })
      }
      if (aiMemory?.onboardingCompleted || isOnboardingComplete()) {
        dispatch({ type: ACTIONS.SET_ONBOARDING_DONE })
      }

      // Sync progress to registry
      if (clientSnapshot.courseProgress && Object.keys(clientSnapshot.courseProgress).length > 0) {
        syncProgressToRegistry(academyLinkCode, clientSnapshot.courseProgress)
      }

      return
    }

    // ── FALLBACK PATH: legacy identity-only restore ─────────
    // Handles devices activated before the license system was added.
    const deviceIdentity = getLinkedDeviceIdentity()
    const clientIdentity = getClientIdentity()

    if (!deviceIdentity || !clientIdentity) return

    const registryEntry = lookupByLinkCode(deviceIdentity.academyLinkCode)
    if (!registryEntry || registryEntry.academyStatus === 'suspended') return

    // Restore session
    const restoredUser = {
      id:              clientIdentity.clientId,
      name:            clientIdentity.name,
      email:           clientIdentity.email,
      role:            'client',
      academyId:       clientIdentity.academyId,
      academyLinkCode: clientIdentity.academyLinkCode,
      academyStatus:   registryEntry.academyStatus,
      enrolledCourses: registryEntry.enrolledCourses || [],
      ownedAddons:     registryEntry.ownedAddons     || [],
      courseProgress:  registryEntry.courseProgress  || {},
      linkedDevices:   registryEntry.linkedDevices   || [],
    }

    setUser(restoredUser)
    dispatch({ type: ACTIONS.SET_CLIENT_PROFILE,   payload: restoredUser })
    dispatch({ type: ACTIONS.SET_ENROLLED_COURSES, payload: restoredUser.enrolledCourses })
    dispatch({ type: ACTIONS.SET_OWNED_ADDONS,     payload: restoredUser.ownedAddons })
    dispatch({ type: ACTIONS.SET_PROGRESS,         payload: restoredUser.courseProgress })
    dispatch({ type: ACTIONS.SET_DEVICE_IDENTITY,  payload: deviceIdentity })
    dispatch({
      type: ACTIONS.SET_ACADEMY_IDENTITY,
      payload: {
        academyLinkCode: clientIdentity.academyLinkCode,
        academyId:       clientIdentity.academyId,
        academyStatus:   registryEntry.academyStatus,
        linkedDevices:   registryEntry.linkedDevices || [],
      }
    })

    const aiMemory = loadAIMemory()
    if (aiMemory?.dogProfile) dispatch({ type: ACTIONS.SET_DOG_PROFILE, payload: aiMemory.dogProfile })
    if (aiMemory?.behaviourScores) dispatch({ type: ACTIONS.SET_BEHAVIOUR_SCORES, payload: aiMemory.behaviourScores })
    if (aiMemory?.aiRecommendations) dispatch({ type: ACTIONS.SET_AI_RECOMMENDATIONS, payload: aiMemory.aiRecommendations })
    if (aiMemory?.onboardingCompleted) dispatch({ type: ACTIONS.SET_ONBOARDING_DONE })

    if (Object.keys(restoredUser.courseProgress).length > 0) {
      syncProgressToRegistry(clientIdentity.academyLinkCode, restoredUser.courseProgress)
    }
  }

  return { restoring }
}
