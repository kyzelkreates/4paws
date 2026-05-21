import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isOnboardingComplete } from '../ai/aiMemory'
import PublicLayout  from '../layouts/PublicLayout'
import AcademyLayout from '../layouts/AcademyLayout'
import AdminLayout   from '../layouts/AdminLayout'
import LoadingScreen from '../components/ui/LoadingScreen'
import AcademyLockGate from '../components/ui/AcademyLockGate'

// ── Pages ─────────────────────────────────────────────────────
const HomePage      = lazy(() => import('../pages/public/HomePage'))
const AboutPage     = lazy(() => import('../pages/public/AboutPage'))
const LoginPage     = lazy(() => import('../pages/public/LoginPage'))

// Activation page is now superseded by AcademyLockGate for PWA clients.
// We keep it for direct /activate URL access (e.g. links sent by admin).
const ActivationPage = lazy(() => import('../pages/academy/ActivationPage'))
const OnboardingQuiz = lazy(() => import('../pages/academy/OnboardingQuiz'))

const AcademyDashboard = lazy(() => import('../pages/academy/AcademyDashboard'))
const CourseOverview   = lazy(() => import('../pages/academy/CourseOverview'))
const LessonPage       = lazy(() => import('../pages/academy/LessonPage'))
const AddonsPage       = lazy(() => import('../pages/academy/AddonsPage'))

const AdminDashboard   = lazy(() => import('../pages/admin/AdminDashboard'))
const ClientsPage      = lazy(() => import('../pages/admin/ClientsPage'))
const ClientDetailPage = lazy(() => import('../pages/admin/ClientDetailPage'))
const MessagingPage    = lazy(() => import('../pages/admin/MessagingPage'))
const AnalyticsPage    = lazy(() => import('../pages/admin/AnalyticsPage'))
const DistributionPage = lazy(() => import('../pages/admin/DistributionPage'))

// ─────────────────────────────────────────────────────────────
// ROUTE GUARDS
// ─────────────────────────────────────────────────────────────

/**
 * AdminRoute — only admins may enter.
 * Redirects unauthenticated users to /login.
 */
function AdminRoute({ children }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (state.userRole !== 'admin') return <Navigate to="/academy" replace />
  return children
}

/**
 * ClientRoute — wraps the entire client academy with the lock gate.
 * The AcademyLockGate handles all auth/license checking internally.
 * Non-admin users who are not authenticated are shown the lock screen.
 */
function ClientRoute({ children }) {
  const { state } = useApp()
  // Admins who wander here get redirected to admin panel
  if (state.isAuthenticated && state.userRole === 'admin') {
    return <Navigate to="/admin" replace />
  }
  // Everything else goes through the lock gate
  return <AcademyLockGate>{children}</AcademyLockGate>
}

/**
 * OnboardingRoute — only reachable by authenticated clients who
 * haven't completed onboarding yet. Bypasses the lock gate check
 * (the lock gate itself ensures authentication first).
 */
function OnboardingRoute({ children }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/" replace />
  if (state.onboardingCompleted || isOnboardingComplete()) {
    return <Navigate to="/academy" replace />
  }
  return children
}

/**
 * OnboardingGuard — redirects to onboarding if not done yet.
 * Only applies inside the client academy layout.
 */
function OnboardingGuard({ children }) {
  const { state } = useApp()
  if (state.userRole === 'client' && !state.onboardingCompleted && !isOnboardingComplete()) {
    return <Navigate to="/academy/onboarding" replace />
  }
  return children
}

/**
 * ActivationGuard — prevents already-activated clients/admins from
 * hitting the /activate page.
 */
function ActivationGuard({ children }) {
  const { state } = useApp()
  if (state.isAuthenticated) {
    return <Navigate to={state.userRole === 'admin' ? '/admin' : '/academy'} replace />
  }
  return children
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>

        {/* ── Public ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"      element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ── Legacy activation URL (direct link from admin email/WhatsApp) ── */}
        <Route path="/activate"
          element={
            <ActivationGuard>
              <ActivationPage />
            </ActivationGuard>
          }
        />

        {/* ── Onboarding — full-screen, gated by lock + auth ── */}
        <Route path="/academy/onboarding"
          element={
            <ClientRoute>
              <OnboardingRoute>
                <OnboardingQuiz />
              </OnboardingRoute>
            </ClientRoute>
          }
        />

        {/* ── Academy client routes — all behind AcademyLockGate ── */}
        <Route
          element={
            <ClientRoute>
              <OnboardingGuard>
                <AcademyLayout />
              </OnboardingGuard>
            </ClientRoute>
          }
        >
          <Route path="/academy"                                   element={<AcademyDashboard />} />
          <Route path="/academy/course/:courseId"                  element={<CourseOverview />} />
          <Route path="/academy/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/academy/addons"                            element={<AddonsPage />} />
        </Route>

        {/* ── Admin routes — behind AdminRoute guard ── */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
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
