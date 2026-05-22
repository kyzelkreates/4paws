import React, { Suspense } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import { AcademyConfigProvider } from './context/AcademyConfigContext'
import AppRoutes from './routes'
import GlobalNotification from './components/ui/GlobalNotification'
import SessionRestoreGate from './components/ui/SessionRestoreGate'
import LoadingScreen from './components/ui/LoadingScreen'
import { ScrollProgressBar } from './components/animations/FadeIn'

// AnimatePresence wrapper needs to be inside Router to read location
function AnimatedApp() {
  const location = useLocation()
  return (
    <>
      <ScrollProgressBar />
      <GlobalNotification />
      <SessionRestoreGate>
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<LoadingScreen />}>
            <AppRoutes key={location.pathname} />
          </Suspense>
        </AnimatePresence>
      </SessionRestoreGate>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AcademyConfigProvider>
          <AnimatedApp />
        </AcademyConfigProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
