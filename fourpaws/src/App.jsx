import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes'
import GlobalNotification from './components/ui/GlobalNotification'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <GlobalNotification />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
