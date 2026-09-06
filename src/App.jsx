import { useState } from 'react'
import Login from './login.jsx'
import Website from './website.jsx'
import './login.css'
import './App.css'

export default function App() {
  // Default to 'website' when opening the site as requested!
  const [currentPage, setCurrentPage] = useState('website')
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('signin') // 'signin' or 'create'

  // Called when user clicks "Login" or is asked to login before upload
  const handleOpenLogin = (mode = 'signin') => {
    setAuthMode(mode)
    setCurrentPage('auth')
  }

  // Called when sign in succeeds -> leads to website as authenticated user
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData)
    setCurrentPage('website')
  }

  // Logout handler resets user and stays on website as guest
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPage('website')
  }

  return (
    <div className="app-root">
      {currentPage === 'website' ? (
        <Website
          user={currentUser}
          onLogout={handleLogout}
          onOpenLogin={handleOpenLogin}
        />
      ) : (
        <Login
          initialView={authMode}
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={() => setCurrentPage('website')}
        />
      )}
    </div>
  )
}
