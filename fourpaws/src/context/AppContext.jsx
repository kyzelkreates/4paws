import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import {
  seedRegistryFromClients,
  syncProgressToRegistry,
  getLinkedDeviceIdentity,
  getClientIdentity,
  unlinkDevice,
} from '../utils/academyIdentity'

// ─────────────────────────────────────────
// INITIAL STATE — Single Source of Truth
// ─────────────────────────────────────────
const initialState = {
  // App meta
  appVersion: '1.0.0',
  isLoading: false,
  notification: null,

  // Auth
  currentUser: null,
  isAuthenticated: false,
  userRole: null, // 'client' | 'admin'

  // Client profile
  clientProfile: null,

  // Academy access
  enrolledCourses: [],
  ownedAddons: [],

  // Progress tracking
  courseProgress: {},

  // Dashboard state
  activeCourseId: null,
  activeModuleId: null,
  activeLessonId: null,

  // Messaging
  messages: [],
  unreadCount: 0,
  notifications: [],

  // Admin state
  allClients: [],
  analyticsData: null,

  // PWA distribution
  distributionQueue: [],

  // ── Academy Linking System (Patch) ───────────────────────
  academyLinkCode:      null,   // active client's link code
  academyId:            null,   // active client's academy ID
  academyStatus:        null,   // 'pending' | 'active' | 'suspended'
  deviceIdentity:       null,   // { deviceId, linkedAt, ... }
  linkedDevices:        [],     // devices linked to this client (admin view)
  activationStep:       'idle', // 'idle' | 'entering' | 'validating' | 'success' | 'error'
  activationError:      null,

  // UI state
  sidebarOpen: false,
  mobileMenuOpen: false,
  currentTheme: 'dark',
}

// ─────────────────────────────────────────
// ACTION TYPES
// ─────────────────────────────────────────
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',

  // Auth
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',

  // Profile
  SET_CLIENT_PROFILE: 'SET_CLIENT_PROFILE',
  UPDATE_CLIENT_PROFILE: 'UPDATE_CLIENT_PROFILE',

  // Academy
  ENROLL_COURSE: 'ENROLL_COURSE',
  ADD_ADDON: 'ADD_ADDON',
  REMOVE_ADDON: 'REMOVE_ADDON',
  SET_ENROLLED_COURSES: 'SET_ENROLLED_COURSES',
  SET_OWNED_ADDONS: 'SET_OWNED_ADDONS',

  // Progress
  COMPLETE_LESSON: 'COMPLETE_LESSON',
  COMPLETE_MODULE: 'COMPLETE_MODULE',
  SET_PROGRESS: 'SET_PROGRESS',

  // Navigation
  SET_ACTIVE_COURSE: 'SET_ACTIVE_COURSE',
  SET_ACTIVE_MODULE: 'SET_ACTIVE_MODULE',
  SET_ACTIVE_LESSON: 'SET_ACTIVE_LESSON',

  // Messaging
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  MARK_READ: 'MARK_READ',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',

  // Admin
  SET_ALL_CLIENTS: 'SET_ALL_CLIENTS',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  ADD_CLIENT: 'ADD_CLIENT',
  SET_ANALYTICS: 'SET_ANALYTICS',

  // UI
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  SET_MOBILE_MENU: 'SET_MOBILE_MENU',

  // ── Academy Linking System ────────────────────────────────
  SET_ACADEMY_IDENTITY:   'SET_ACADEMY_IDENTITY',
  CLEAR_ACADEMY_IDENTITY: 'CLEAR_ACADEMY_IDENTITY',
  SET_DEVICE_IDENTITY:    'SET_DEVICE_IDENTITY',
  SET_ACTIVATION_STEP:    'SET_ACTIVATION_STEP',
  SET_ACTIVATION_ERROR:   'SET_ACTIVATION_ERROR',
  UPDATE_LINKED_DEVICES:  'UPDATE_LINKED_DEVICES',
  SET_ACADEMY_STATUS:     'SET_ACADEMY_STATUS',
}

// ─────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case ACTIONS.SET_NOTIFICATION:
      return { ...state, notification: action.payload }

    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null }

    case ACTIONS.SET_USER:
      return {
        ...state,
        currentUser:     action.payload,
        isAuthenticated: !!action.payload,
        userRole:        action.payload?.role || null,
        // Hydrate linking fields from user object when setting user
        academyLinkCode: action.payload?.academyLinkCode || state.academyLinkCode,
        academyId:       action.payload?.academyId       || state.academyId,
        academyStatus:   action.payload?.academyStatus   || state.academyStatus,
        linkedDevices:   action.payload?.linkedDevices   || state.linkedDevices,
      }

    case ACTIONS.LOGOUT:
      return {
        ...state,
        currentUser:      null,
        isAuthenticated:  false,
        userRole:         null,
        clientProfile:    null,
        activeCourseId:   null,
        activeModuleId:   null,
        activeLessonId:   null,
        academyLinkCode:  null,
        academyId:        null,
        academyStatus:    null,
        deviceIdentity:   null,
        linkedDevices:    [],
        activationStep:   'idle',
        activationError:  null,
      }

    case ACTIONS.SET_CLIENT_PROFILE:
      return { ...state, clientProfile: action.payload }

    case ACTIONS.UPDATE_CLIENT_PROFILE:
      return { ...state, clientProfile: { ...state.clientProfile, ...action.payload } }

    case ACTIONS.ENROLL_COURSE:
      if (state.enrolledCourses.includes(action.payload)) return state
      return { ...state, enrolledCourses: [...state.enrolledCourses, action.payload] }

    case ACTIONS.SET_ENROLLED_COURSES:
      return { ...state, enrolledCourses: action.payload }

    case ACTIONS.ADD_ADDON:
      if (state.ownedAddons.includes(action.payload)) return state
      return { ...state, ownedAddons: [...state.ownedAddons, action.payload] }

    case ACTIONS.REMOVE_ADDON:
      return { ...state, ownedAddons: state.ownedAddons.filter(id => id !== action.payload) }

    case ACTIONS.SET_OWNED_ADDONS:
      return { ...state, ownedAddons: action.payload }

    case ACTIONS.COMPLETE_LESSON: {
      const { courseId, lessonId } = action.payload
      const existing = state.courseProgress[courseId] || { completedLessons: [], completedModules: [], percentComplete: 0 }
      if (existing.completedLessons.includes(lessonId)) return state
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [courseId]: { ...existing, completedLessons: [...existing.completedLessons, lessonId] }
        }
      }
    }

    case ACTIONS.COMPLETE_MODULE: {
      const { courseId, moduleId } = action.payload
      const existing = state.courseProgress[courseId] || { completedLessons: [], completedModules: [], percentComplete: 0 }
      if (existing.completedModules.includes(moduleId)) return state
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [courseId]: { ...existing, completedModules: [...existing.completedModules, moduleId] }
        }
      }
    }

    case ACTIONS.SET_PROGRESS:
      return { ...state, courseProgress: action.payload }

    case ACTIONS.SET_ACTIVE_COURSE:
      return { ...state, activeCourseId: action.payload }

    case ACTIONS.SET_ACTIVE_MODULE:
      return { ...state, activeModuleId: action.payload }

    case ACTIONS.SET_ACTIVE_LESSON:
      return { ...state, activeLessonId: action.payload }

    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages:    [...state.messages, action.payload],
        unreadCount: action.payload.from !== 'client' ? state.unreadCount + 1 : state.unreadCount
      }

    case ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload }

    case ACTIONS.MARK_READ:
      return { ...state, unreadCount: 0, messages: state.messages.map(m => ({ ...m, read: true })) }

    case ACTIONS.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload }

    case ACTIONS.ADD_NOTIFICATION:
      return { ...state, notifications: [action.payload, ...state.notifications] }

    case ACTIONS.SET_ALL_CLIENTS:
      return { ...state, allClients: action.payload }

    case ACTIONS.UPDATE_CLIENT:
      return {
        ...state,
        allClients: state.allClients.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        )
      }

    case ACTIONS.ADD_CLIENT:
      return { ...state, allClients: [...state.allClients, action.payload] }

    case ACTIONS.SET_ANALYTICS:
      return { ...state, analyticsData: action.payload }

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case ACTIONS.SET_SIDEBAR:
      return { ...state, sidebarOpen: action.payload }

    case ACTIONS.TOGGLE_MOBILE_MENU:
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen }

    case ACTIONS.SET_MOBILE_MENU:
      return { ...state, mobileMenuOpen: action.payload }

    // ── Academy Linking System ──────────────────────────────

    case ACTIONS.SET_ACADEMY_IDENTITY:
      return {
        ...state,
        academyLinkCode: action.payload.academyLinkCode,
        academyId:       action.payload.academyId,
        academyStatus:   action.payload.academyStatus || 'active',
        linkedDevices:   action.payload.linkedDevices || [],
      }

    case ACTIONS.CLEAR_ACADEMY_IDENTITY:
      return {
        ...state,
        academyLinkCode: null,
        academyId:       null,
        academyStatus:   null,
        deviceIdentity:  null,
        linkedDevices:   [],
        activationStep:  'idle',
        activationError: null,
      }

    case ACTIONS.SET_DEVICE_IDENTITY:
      return { ...state, deviceIdentity: action.payload }

    case ACTIONS.SET_ACTIVATION_STEP:
      return { ...state, activationStep: action.payload, activationError: null }

    case ACTIONS.SET_ACTIVATION_ERROR:
      return { ...state, activationError: action.payload, activationStep: 'error' }

    case ACTIONS.UPDATE_LINKED_DEVICES:
      return {
        ...state,
        linkedDevices: action.payload,
        allClients: state.allClients.map(c =>
          c.academyLinkCode === action.payload.linkCode
            ? { ...c, linkedDevices: action.payload.devices }
            : c
        )
      }

    case ACTIONS.SET_ACADEMY_STATUS:
      return {
        ...state,
        academyStatus: action.payload.status,
        allClients: state.allClients.map(c =>
          c.id === action.payload.clientId
            ? { ...c, academyStatus: action.payload.status }
            : c
        )
      }

    default:
      return state
  }
}

// ─────────────────────────────────────────
// CONTEXT + PROVIDER
// ─────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const persisted = localStorage.getItem('fourpaws_state')
      if (persisted) {
        const p = JSON.parse(persisted)
        return {
          ...init,
          currentUser:     p.currentUser     || null,
          isAuthenticated: !!p.currentUser,
          userRole:        p.currentUser?.role || null,
          clientProfile:   p.clientProfile   || null,
          enrolledCourses: p.enrolledCourses  || [],
          ownedAddons:     p.ownedAddons      || [],
          courseProgress:  p.courseProgress   || {},
          messages:        p.messages         || [],
          notifications:   p.notifications    || [],
          allClients:      p.allClients       || [],
          // Restore linking fields
          academyLinkCode: p.academyLinkCode  || null,
          academyId:       p.academyId        || null,
          academyStatus:   p.academyStatus    || null,
          linkedDevices:   p.linkedDevices    || [],
        }
      }
    } catch {}
    return init
  })

  // ── Persist to localStorage ─────────────────────────────────
  useEffect(() => {
    const persistable = {
      currentUser:     state.currentUser,
      clientProfile:   state.clientProfile,
      enrolledCourses: state.enrolledCourses,
      ownedAddons:     state.ownedAddons,
      courseProgress:  state.courseProgress,
      messages:        state.messages,
      notifications:   state.notifications,
      allClients:      state.allClients,
      // Linking fields
      academyLinkCode: state.academyLinkCode,
      academyId:       state.academyId,
      academyStatus:   state.academyStatus,
      linkedDevices:   state.linkedDevices,
    }
    localStorage.setItem('fourpaws_state', JSON.stringify(persistable))
  }, [
    state.currentUser, state.clientProfile, state.enrolledCourses,
    state.ownedAddons, state.courseProgress, state.messages,
    state.notifications, state.allClients,
    state.academyLinkCode, state.academyId, state.academyStatus, state.linkedDevices,
  ])

  // ── Seed registry when allClients loads ────────────────────
  useEffect(() => {
    if (state.allClients.length > 0) {
      seedRegistryFromClients(state.allClients)
    }
  }, [state.allClients])

  // ── Sync progress to registry whenever it changes ──────────
  useEffect(() => {
    if (state.academyLinkCode && Object.keys(state.courseProgress).length > 0) {
      syncProgressToRegistry(state.academyLinkCode, state.courseProgress)
    }
  }, [state.courseProgress, state.academyLinkCode])

  // ── Helper: notify ──────────────────────────────────────────
  const notify = useCallback((message, type = 'info', duration = 4000) => {
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { message, type, id: Date.now() } })
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION }), duration)
  }, [])

  const setUser = useCallback((user) => dispatch({ type: ACTIONS.SET_USER, payload: user }), [])

  const logout = useCallback(() => {
    unlinkDevice()
    dispatch({ type: ACTIONS.LOGOUT })
  }, [])

  const completeLesson = useCallback((courseId, lessonId) => {
    dispatch({ type: ACTIONS.COMPLETE_LESSON, payload: { courseId, lessonId } })
  }, [])

  const enrollCourse = useCallback((courseId) => {
    dispatch({ type: ACTIONS.ENROLL_COURSE, payload: courseId })
  }, [])

  // ── Helper: restore session from device identity ────────────
  const restoreDeviceSession = useCallback(() => {
    const identity = getLinkedDeviceIdentity()
    const clientId = getClientIdentity()
    if (!identity || !clientId) return false

    dispatch({ type: ACTIONS.SET_DEVICE_IDENTITY, payload: identity })
    dispatch({
      type: ACTIONS.SET_ACADEMY_IDENTITY,
      payload: {
        academyLinkCode: identity.academyLinkCode,
        academyId:       identity.academyId,
        academyStatus:   clientId.academyStatus || 'active',
        linkedDevices:   clientId.linkedDevices || [],
      }
    })
    return true
  }, [])

  const value = {
    state,
    dispatch,
    notify,
    setUser,
    logout,
    completeLesson,
    enrollCourse,
    restoreDeviceSession,
    ACTIONS,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export default AppContext
