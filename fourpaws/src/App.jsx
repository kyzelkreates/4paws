import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AcademyConfigProvider } from './context/AcademyConfigContext'
import AppRoutes from './routes'
import GlobalNotification from './components/ui/GlobalNotification'
import SessionRestoreGate from './components/ui/SessionRestoreGate'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AcademyConfigProvider>
          <GlobalNotification />
          <SessionRestoreGate>
            <AppRoutes />
          </SessionRestoreGate>
        </AcademyConfigProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
