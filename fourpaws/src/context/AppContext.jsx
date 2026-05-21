import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

// ─────────────────────────────────────────
// INITIAL STATE — Single Source of Truth
// ─────────────────────────────────────────
const initialState = {
  // App meta
  appVersion: '1.0.0',
  isLoading: false,
  notification: null,

  // Auth (Run 3+)
  currentUser: null,
  isAuthenticated: false,
  userRole: null, // 'client' | 'admin'

  // Client profile (Run 2+)
  clientProfile: null,

  // Academy access (Run 2+)
  enrolledCourses: [],
  ownedAddons: [],

  // Progress tracking (Run 2+)
  courseProgress: {},
  // structure: { [courseId]: { completedLessons: [], completedModules: [], percentComplete: 0 } }

  // Dashboard state (Run 2+)
  activeCourseId: null,
  activeModuleId: null,
  activeLessonId: null,

  // Messaging (Run 3+)
  messages: [],
  unreadCount: 0,
  notifications: [],

  // Admin state (Run 3+)
  allClients: [],
  analyticsData: null,

  // PWA distribution (Run 3+)
  distributionQueue: [],

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
        currentUser: action.payload,
        isAuthenticated: !!action.payload,
        userRole: action.payload?.role || null,
      }

    case ACTIONS.LOGOUT:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        userRole: null,
        clientProfile: null,
        activeCourseId: null,
        activeModuleId: null,
        activeLessonId: null,
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
        messages: [...state.messages, action.payload],
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
        allClients: state.allClients.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c)
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

    default:
      return state
  }
}

// ─────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const persisted = localStorage.getItem('fourpaws_state')
      if (persisted) {
        const parsed = JSON.parse(persisted)
        return {
          ...init,
          currentUser: parsed.currentUser || null,
          isAuthenticated: !!parsed.currentUser,
          userRole: parsed.currentUser?.role || null,
          clientProfile: parsed.clientProfile || null,
          enrolledCourses: parsed.enrolledCourses || [],
          ownedAddons: parsed.ownedAddons || [],
          courseProgress: parsed.courseProgress || {},
          messages: parsed.messages || [],
          notifications: parsed.notifications || [],
          allClients: parsed.allClients || [],
        }
      }
    } catch {}
    return init
  })

  // Persist key state to localStorage
  useEffect(() => {
    const persistable = {
      currentUser: state.currentUser,
      clientProfile: state.clientProfile,
      enrolledCourses: state.enrolledCourses,
      ownedAddons: state.ownedAddons,
      courseProgress: state.courseProgress,
      messages: state.messages,
      notifications: state.notifications,
      allClients: state.allClients,
    }
    localStorage.setItem('fourpaws_state', JSON.stringify(persistable))
  }, [state.currentUser, state.clientProfile, state.enrolledCourses, state.ownedAddons, state.courseProgress, state.messages, state.notifications, state.allClients])

  // Helper actions
  const notify = useCallback((message, type = 'info', duration = 4000) => {
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { message, type, id: Date.now() } })
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION }), duration)
  }, [])

  const setUser = useCallback((user) => dispatch({ type: ACTIONS.SET_USER, payload: user }), [])
  const logout = useCallback(() => dispatch({ type: ACTIONS.LOGOUT }), [])

  const completeLesson = useCallback((courseId, lessonId) => {
    dispatch({ type: ACTIONS.COMPLETE_LESSON, payload: { courseId, lessonId } })
  }, [])

  const enrollCourse = useCallback((courseId) => {
    dispatch({ type: ACTIONS.ENROLL_COURSE, payload: courseId })
  }, [])

  const value = {
    state,
    dispatch,
    notify,
    setUser,
    logout,
    completeLesson,
    enrollCourse,
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
