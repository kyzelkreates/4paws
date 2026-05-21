// ─────────────────────────────────────────────────────────────
// SESSION RESTORE HOOK — extended with AI memory restoration
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
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
import { scoreBehaviour, recommendCourses, recommendAddons, generateBehaviourInsight, getDailyPrompt } from '../ai/behaviourEngine'
import { generateEnrichmentPlan } from '../ai/aiMemory'

export function useSessionRestore() {
  const { state, dispatch, ACTIONS, setUser } = useApp()
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    if (state.isAuthenticated) { setRestoring(false); return }

    const deviceIdentity = getLinkedDeviceIdentity()
    const clientIdentity = getClientIdentity()

    if (!deviceIdentity || !clientIdentity) { setRestoring(false); return }

    const registryEntry = lookupByLinkCode(deviceIdentity.academyLinkCode)
    if (!registryEntry || registryEntry.academyStatus === 'suspended') { setRestoring(false); return }

    // Restore auth session
    const restoredUser = {
      id:              clientIdentity.clientId,
      name:            clientIdentity.name,
      email:           clientIdentity.email,
      role:            'client',
      academyId:       clientIdentity.academyId,
      academyLinkCode: clientIdentity.academyLinkCode,
      academyStatus:   registryEntry.academyStatus,
      enrolledCourses: registryEntry.enrolledCourses  || [],
      ownedAddons:     registryEntry.ownedAddons      || [],
      courseProgress:  registryEntry.courseProgress   || {},
      linkedDevices:   registryEntry.linkedDevices    || [],
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

    // Restore AI memory
    const aiMemory = loadAIMemory()
    if (aiMemory.dogProfile) {
      dispatch({ type: ACTIONS.SET_DOG_PROFILE, payload: aiMemory.dogProfile })
    }
    if (aiMemory.behaviourScores) {
      dispatch({ type: ACTIONS.SET_BEHAVIOUR_SCORES, payload: aiMemory.behaviourScores })
    }
    if (aiMemory.aiRecommendations) {
      dispatch({ type: ACTIONS.SET_AI_RECOMMENDATIONS, payload: aiMemory.aiRecommendations })
    }
    if (aiMemory.onboardingCompleted) {
      dispatch({ type: ACTIONS.SET_ONBOARDING_DONE })
    }

    // Re-generate daily insights
    if (aiMemory.dogProfile) {
      const scores  = aiMemory.behaviourScores || scoreBehaviour(aiMemory.dogProfile)
      const insight = generateBehaviourInsight(aiMemory.dogProfile.name, scores)
      const dailyPrompt = getDailyPrompt(aiMemory.dogProfile.name)
      dispatch({
        type: ACTIONS.SET_TRAINING_INSIGHTS,
        payload: { insight, dailyPrompt }
      })
    }

    if (Object.keys(restoredUser.courseProgress).length > 0) {
      syncProgressToRegistry(clientIdentity.academyLinkCode, restoredUser.courseProgress)
    }

    setRestoring(false)
  }, [])

  return { restoring }
}
