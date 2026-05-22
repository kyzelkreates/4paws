import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isOnboardingComplete } from '../ai/aiMemory'
import PublicLayout    from '../layouts/PublicLayout'
import AcademyLayout   from '../layouts/AcademyLayout'
import AdminLayout     from '../layouts/AdminLayout'
import LoadingScreen   from '../components/ui/LoadingScreen'
import AcademyLockGate from '../components/ui/AcademyLockGate'

// ── Public ─────────────────────────────────────────────────────
const HomePage       = lazy(() => import('../pages/public/HomePage'))
const AboutPage      = lazy(() => import('../pages/public/AboutPage'))
const LoginPage      = lazy(() => import('../pages/public/LoginPage'))
const ActivationPage = lazy(() => import('../pages/academy/ActivationPage'))
const OnboardingQuiz = lazy(() => import('../pages/academy/OnboardingQuiz'))

// ── Academy V1 ──────────────────────────────────────────────────
const AcademyDashboard  = lazy(() => import('../pages/academy/AcademyDashboard'))
const CourseOverview    = lazy(() => import('../pages/academy/CourseOverview'))
const LessonPage        = lazy(() => import('../pages/academy/LessonPage'))
const AddonsPage        = lazy(() => import('../pages/academy/AddonsPage'))
const PuppyPassport     = lazy(() => import('../pages/academy/PuppyPassport'))
const BehaviourTimeline = lazy(() => import('../pages/academy/BehaviourTimeline'))
const BehaviourHeatmap  = lazy(() => import('../pages/academy/BehaviourHeatmap'))
const EmergencyMode     = lazy(() => import('../pages/academy/EmergencyMode'))

// ── Academy V2 ──────────────────────────────────────────────────
const DigitalTwin        = lazy(() => import('../pages/academy/DigitalTwin'))
const WellnessDashboard  = lazy(() => import('../pages/academy/WellnessDashboard'))
const WeeklyReport       = lazy(() => import('../pages/academy/WeeklyReport'))
const LegacyArchive      = lazy(() => import('../pages/academy/LegacyArchive'))

// ── Academy V3 ──────────────────────────────────────────────────
const CalmnessCentre     = lazy(() => import('../pages/academy/CalmnessCentre'))
const TransformationMap  = lazy(() => import('../pages/academy/TransformationMap'))
const AcademyJournal     = lazy(() => import('../pages/academy/AcademyJournal'))
const StabilityDashboard = lazy(() => import('../pages/academy/StabilityDashboard'))
const AcademyCeremony    = lazy(() => import('../pages/academy/AcademyCeremony'))

// ── Admin ──────────────────────────────────────────────────────
const AdminDashboard   = lazy(() => import('../pages/admin/AdminDashboard'))
const ClientsPage      = lazy(() => import('../pages/admin/ClientsPage'))
const ClientDetailPage = lazy(() => import('../pages/admin/ClientDetailPage'))
const MessagingPage    = lazy(() => import('../pages/admin/MessagingPage'))
const AnalyticsPage    = lazy(() => import('../pages/admin/AnalyticsPage'))
const DistributionPage = lazy(() => import('../pages/admin/DistributionPage'))

// ─────────────────────────────────────────────────────────────
// GUARDS
// ─────────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (state.userRole !== 'admin') return <Navigate to="/academy" replace />
  return children
}

function ClientRoute({ children }) {
  const { state } = useApp()
  if (state.isAuthenticated && state.userRole === 'admin') return <Navigate to="/admin" replace />
  return <AcademyLockGate>{children}</AcademyLockGate>
}

function OnboardingRoute({ children }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/" replace />
  if (state.onboardingCompleted || isOnboardingComplete()) return <Navigate to="/academy" replace />
  return children
}

function OnboardingGuard({ children }) {
  const { state } = useApp()
  if (state.userRole === 'client' && !state.onboardingCompleted && !isOnboardingComplete()) {
    return <Navigate to="/academy/onboarding" replace />
  }
  return children
}

function ActivationGuard({ children }) {
  const { state } = useApp()
  if (state.isAuthenticated) return <Navigate to={state.userRole === 'admin' ? '/admin' : '/academy'} replace />
  return children
}

// ─────────────────────────────────────────────────────────────
// ROUTES
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
          element={<ActivationGuard><ActivationPage /></ActivationGuard>} />

        {/* Onboarding */}
        <Route path="/academy/onboarding"
          element={<ClientRoute><OnboardingRoute><OnboardingQuiz /></OnboardingRoute></ClientRoute>} />

        {/* Academy — all routes under layout */}
        <Route element={
          <ClientRoute>
            <OnboardingGuard>
              <AcademyLayout />
            </OnboardingGuard>
          </ClientRoute>
        }>
          {/* Core */}
          <Route path="/academy"                                   element={<AcademyDashboard />} />
          <Route path="/academy/course/:courseId"                  element={<CourseOverview />} />
          <Route path="/academy/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/academy/addons"                            element={<AddonsPage />} />

          {/* V1 */}
          <Route path="/academy/passport"   element={<PuppyPassport />} />
          <Route path="/academy/timeline"   element={<BehaviourTimeline />} />
          <Route path="/academy/analytics"  element={<BehaviourHeatmap />} />
          <Route path="/academy/emergency"  element={<EmergencyMode />} />

          {/* V2 */}
          <Route path="/academy/twin"       element={<DigitalTwin />} />
          <Route path="/academy/wellness"   element={<WellnessDashboard />} />
          <Route path="/academy/report"     element={<WeeklyReport />} />
          <Route path="/academy/archive"    element={<LegacyArchive />} />

          {/* V3 */}
          <Route path="/academy/calm"       element={<CalmnessCentre />} />
          <Route path="/academy/map"        element={<TransformationMap />} />
          <Route path="/academy/journal"    element={<AcademyJournal />} />
          <Route path="/academy/stability"  element={<StabilityDashboard />} />
          <Route path="/academy/ceremony"   element={<AcademyCeremony />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
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
