import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isOnboardingComplete } from '../ai/aiMemory'
import PublicLayout from '../layouts/PublicLayout'
import AcademyLayout from '../layouts/AcademyLayout'
import AdminLayout from '../layouts/AdminLayout'
import LoadingScreen from '../components/ui/LoadingScreen'

// Public
const HomePage      = lazy(() => import('../pages/public/HomePage'))
const AboutPage     = lazy(() => import('../pages/public/AboutPage'))
const LoginPage     = lazy(() => import('../pages/public/LoginPage'))

// Activation
const ActivationPage = lazy(() => import('../pages/academy/ActivationPage'))

// Onboarding (no layout — full screen)
const OnboardingQuiz = lazy(() => import('../pages/academy/OnboardingQuiz'))

// Academy
const AcademyDashboard = lazy(() => import('../pages/academy/AcademyDashboard'))
const CourseOverview   = lazy(() => import('../pages/academy/CourseOverview'))
const LessonPage       = lazy(() => import('../pages/academy/LessonPage'))
const AddonsPage       = lazy(() => import('../pages/academy/AddonsPage'))

// Admin
const AdminDashboard   = lazy(() => import('../pages/admin/AdminDashboard'))
const ClientsPage      = lazy(() => import('../pages/admin/ClientsPage'))
const ClientDetailPage = lazy(() => import('../pages/admin/ClientDetailPage'))
const MessagingPage    = lazy(() => import('../pages/admin/MessagingPage'))
const AnalyticsPage    = lazy(() => import('../pages/admin/AnalyticsPage'))
const DistributionPage = lazy(() => import('../pages/admin/DistributionPage'))

// ── Guards ────────────────────────────────────────────────────

function ProtectedRoute({ children, requiredRole }) {
  const { state } = useApp()
  if (!state.isAuthenticated) {
    return <Navigate to={requiredRole === 'admin' ? '/login' : '/activate'} replace />
  }
  if (requiredRole && state.userRole !== requiredRole) {
    return <Navigate to={state.userRole === 'admin' ? '/admin' : '/academy'} replace />
  }
  return children
}

function ActivationGuard({ children }) {
  const { state } = useApp()
  if (state.isAuthenticated) {
    return <Navigate to={state.userRole === 'admin' ? '/admin' : '/academy'} replace />
  }
  return children
}

/**
 * Redirect to onboarding if client hasn't completed it yet.
 * Admins bypass this entirely.
 */
function OnboardingGuard({ children }) {
  const { state } = useApp()
  if (state.userRole === 'client' && !state.onboardingCompleted && !isOnboardingComplete()) {
    return <Navigate to="/academy/onboarding" replace />
  }
  return children
}

/**
 * Prevent re-doing onboarding once complete.
 */
function OnboardingRoute({ children }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/activate" replace />
  if (state.onboardingCompleted || isOnboardingComplete()) {
    return <Navigate to="/academy" replace />
  }
  return children
}

// ─────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>

        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/"      element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Activation */}
        <Route path="/activate"
          element={<ActivationGuard><ActivationPage /></ActivationGuard>}
        />

        {/* Onboarding — full-screen, no sidebar */}
        <Route path="/academy/onboarding"
          element={<OnboardingRoute><OnboardingQuiz /></OnboardingRoute>}
        />

        {/* Academy — client */}
        <Route element={
          <ProtectedRoute requiredRole="client">
            <OnboardingGuard>
              <AcademyLayout />
            </OnboardingGuard>
          </ProtectedRoute>
        }>
          <Route path="/academy"                                   element={<AcademyDashboard />} />
          <Route path="/academy/course/:courseId"                  element={<CourseOverview />} />
          <Route path="/academy/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/academy/addons"                            element={<AddonsPage />} />
        </Route>

        {/* Admin */}
        <Route element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin"                   element={<AdminDashboard />} />
          <Route path="/admin/clients"           element={<ClientsPage />} />
          <Route path="/admin/clients/:clientId" element={<ClientDetailPage />} />
          <Route path="/admin/messages"          element={<MessagingPage />} />
          <Route path="/admin/analytics"         element={<AnalyticsPage />} />
          <Route path="/admin/distribution"      element={<DistributionPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
