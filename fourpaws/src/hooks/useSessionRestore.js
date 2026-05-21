// ─────────────────────────────────────────────────────────────
// SESSION RESTORE HOOK
// Called once on app mount. Checks whether this device is already
// linked to an academy profile and silently restores the session.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  getLinkedDeviceIdentity,
  getClientIdentity,
  lookupByLinkCode,
  syncProgressToRegistry,
} from '../utils/academyIdentity'

export function useSessionRestore() {
  const { state, dispatch, ACTIONS, setUser } = useApp()
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    // Only run if not already authenticated
    if (state.isAuthenticated) {
      setRestoring(false)
      return
    }

    const deviceIdentity = getLinkedDeviceIdentity()
    const clientIdentity = getClientIdentity()

    if (!deviceIdentity || !clientIdentity) {
      setRestoring(false)
      return
    }

    // Re-validate the link code still exists in the registry
    const registryEntry = lookupByLinkCode(deviceIdentity.academyLinkCode)
    if (!registryEntry || registryEntry.academyStatus === 'suspended') {
      setRestoring(false)
      return
    }

    // Restore session silently ─────────────────────────────
    const restoredUser = {
      id:              clientIdentity.clientId,
      name:            clientIdentity.name,
      email:           clientIdentity.email,
      role:            'client',
      academyId:       clientIdentity.academyId,
      academyLinkCode: clientIdentity.academyLinkCode,
      academyStatus:   registryEntry.academyStatus,
      enrolledCourses: registryEntry.enrolledCourses  || clientIdentity.enrolledCourses  || [],
      ownedAddons:     registryEntry.ownedAddons      || clientIdentity.ownedAddons      || [],
      courseProgress:  registryEntry.courseProgress   || clientIdentity.courseProgress   || {},
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

    // Re-sync any local progress that happened offline
    if (Object.keys(restoredUser.courseProgress).length > 0) {
      syncProgressToRegistry(clientIdentity.academyLinkCode, restoredUser.courseProgress)
    }

    setRestoring(false)
  }, []) // run once on mount

  return { restoring }
}
