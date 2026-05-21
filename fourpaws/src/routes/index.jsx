import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PublicLayout from '../layouts/PublicLayout'
import AcademyLayout from '../layouts/AcademyLayout'
import AdminLayout from '../layouts/AdminLayout'
import LoadingScreen from '../components/ui/LoadingScreen'

// Public pages
const HomePage      = lazy(() => import('../pages/public/HomePage'))
const AboutPage     = lazy(() => import('../pages/public/AboutPage'))
const LoginPage     = lazy(() => import('../pages/public/LoginPage'))

// Activation (no layout wrapper — full-screen luxury experience)
const ActivationPage = lazy(() => import('../pages/academy/ActivationPage'))

// Academy pages
const AcademyDashboard = lazy(() => import('../pages/academy/AcademyDashboard'))
const CourseOverview   = lazy(() => import('../pages/academy/CourseOverview'))
const LessonPage       = lazy(() => import('../pages/academy/LessonPage'))
const AddonsPage       = lazy(() => import('../pages/academy/AddonsPage'))

// Admin pages
const AdminDashboard   = lazy(() => import('../pages/admin/AdminDashboard'))
const ClientsPage      = lazy(() => import('../pages/admin/ClientsPage'))
const ClientDetailPage = lazy(() => import('../pages/admin/ClientDetailPage'))
const MessagingPage    = lazy(() => import('../pages/admin/MessagingPage'))
const AnalyticsPage    = lazy(() => import('../pages/admin/AnalyticsPage'))
const DistributionPage = lazy(() => import('../pages/admin/DistributionPage'))

// ── Route guards ─────────────────────────────────────────────

function ProtectedRoute({ children, requiredRole }) {
  const { state } = useApp()
  if (!state.isAuthenticated) {
    // Clients without a session go to activation, admins to login
    return <Navigate to={requiredRole === 'admin' ? '/login' : '/activate'} replace />
  }
  if (requiredRole && state.userRole !== requiredRole) {
    return <Navigate to={state.userRole === 'admin' ? '/admin' : '/academy'} replace />
  }
  return children
}

/**
 * Prevent already-activated clients from hitting /activate again.
 * Also prevents admins from landing there.
 */
function ActivationGuard({ children }) {
  const { state } = useApp()
  if (state.isAuthenticated) {
    return <Navigate to={state.userRole === 'admin' ? '/admin' : '/academy'} replace />
  }
  return children
}

// ─────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>

        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/"      element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Activation — full-screen, no layout */}
        <Route
          path="/activate"
          element={
            <ActivationGuard>
              <ActivationPage />
            </ActivationGuard>
          }
        />

        {/* Academy routes — client access */}
        <Route element={
          <ProtectedRoute requiredRole="client">
            <AcademyLayout />
          </ProtectedRoute>
        }>
          <Route path="/academy"                                       element={<AcademyDashboard />} />
          <Route path="/academy/course/:courseId"                      element={<CourseOverview />} />
          <Route path="/academy/course/:courseId/lesson/:lessonId"     element={<LessonPage />} />
          <Route path="/academy/addons"                                element={<AddonsPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin"                    element={<AdminDashboard />} />
          <Route path="/admin/clients"            element={<ClientsPage />} />
          <Route path="/admin/clients/:clientId"  element={<ClientDetailPage />} />
          <Route path="/admin/messages"           element={<MessagingPage />} />
          <Route path="/admin/analytics"          element={<AnalyticsPage />} />
          <Route path="/admin/distribution"       element={<DistributionPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
