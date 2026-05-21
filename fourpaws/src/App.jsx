import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes'
import GlobalNotification from './components/ui/GlobalNotification'
import SessionRestoreGate from './components/ui/SessionRestoreGate'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <GlobalNotification />
        <SessionRestoreGate>
          <AppRoutes />
        </SessionRestoreGate>
      </AppProvider>
    </BrowserRouter>
  )
}
