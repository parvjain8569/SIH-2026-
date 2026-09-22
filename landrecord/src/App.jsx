import { useState, useEffect } from 'react'
import Login from './login.jsx'
import Website from './website.jsx'
import LanguageSelectModal from './components/modals/LanguageSelectModal.jsx'
import { supabase } from './lib/supabase.js'
import { generateMockAadhaarData } from './utils/userUtils.js'
import './login.css'
import './App.css'

export default function App() {
  const getDevUser = () => ({
    email: 'dev@bhoomintelli.in',
    name: 'Dev User',
    username: 'devuser',
    aadhaarVerified: true,
    aadhaarDetails: {
      aadhaarNumber: '234567891234',
      formattedAadhaar: '2345 6789 1234',
      maskedAadhaar: 'XXXX XXXX 1234',
      name: 'Dev User',
      dob: '15/06/1995',
      gender: 'Male',
      address: 'Village Khandsa, Gurugram',
      district: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      contact: '9876543210',
    }
  })

  // Default to 'website' when opening the site as requested!
  const [currentPage, setCurrentPage] = useState('website')
  const [devMode, setDevMode] = useState(() => {
    try { return localStorage.getItem('devMode') === 'true' } catch { return false }
  })
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [authMode, setAuthMode] = useState('signin')
  const [showLangModal, setShowLangModal] = useState(true)

  useEffect(() => {
    if (devMode) {
      setCurrentUser(getDevUser())
      return
    }

    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUserProfile(session.user)
      else setCurrentUser(null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setCurrentUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [devMode])

  const fetchUserProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.warn("Could not fetch profile:", error)
        // Fallback to basic user data
        setCurrentUser({ email: user.email, name: user.email })
        return
      }

      let mockDetails = {}
      if (data.aadhaar_number) {
        mockDetails = generateMockAadhaarData(data.aadhaar_number, data.name)
        // Ensure the phone number from the DB is prioritized
        mockDetails.contact = data.phone_number || mockDetails.contact
      }

      // Map Supabase profile to our expected user format
      setCurrentUser({
        email: data.email,
        name: data.name,
        username: data.email?.split('@')[0],
        aadhaarVerified: data.aadhaar_verified,
        aadhaarDetails: {
          ...mockDetails,
          aadhaarNumber: data.aadhaar_number,
          formattedAadhaar: data.aadhaar_number?.replace(/(\d{4})(?=\d)/g, '$1 '),
          maskedAadhaar: `XXXX XXXX ${data.aadhaar_number?.slice(-4)}`,
          name: data.name,
          contact: data.phone_number || mockDetails.contact
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const toggleDevMode = () => {
    const next = !devMode
    setDevMode(next)
    try { localStorage.setItem('devMode', String(next)) } catch {}
    window.dispatchEvent(new Event('devModeChange'))
  }

  const handleOpenLogin = (mode = 'signin') => {
    setAuthMode(mode)
    setCurrentPage('auth')
  }

  const handleLoginSuccess = () => {
    // We don't need to manually set user here; onAuthStateChange will catch it!
    setCurrentPage('website')
  }

  const handleLogout = async () => {
    if (!devMode) {
      await supabase.auth.signOut()
    }
    setCurrentPage('website')
    if (devMode) {
      setDevMode(false)
      try { localStorage.setItem('devMode', 'false') } catch {}
      window.dispatchEvent(new Event('devModeChange'))
    }
  }

  return (
    <div className="app-root">
      <LanguageSelectModal 
        forceShow={showLangModal} 
        onClose={() => setShowLangModal(false)} 
      />
      {currentPage === 'website' ? (
        <Website
          user={currentUser}
          onLogout={handleLogout}
          onOpenLogin={handleOpenLogin}
          onOpenLanguage={() => setShowLangModal(true)}
        />
      ) : (
        <Login
          initialView={authMode}
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={() => setCurrentPage('website')}
        />
      )}

      {/* ── Global Dev Mode Toggle Button ── */}
      <button
        onClick={toggleDevMode}
        title={devMode ? 'Dev Mode: ON — Click to disable' : 'Dev Mode: OFF — Click to enable'}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
          width: '44px', height: '44px', borderRadius: '50%',
          border: devMode ? '2px solid #16a34a' : '2px solid #94a3b8',
          background: devMode ? '#dcfce7' : '#f1f5f9',
          color: devMode ? '#15803d' : '#64748b',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)', transition: 'all 0.2s ease',
          fontSize: '18px',
        }}
      >
        {devMode ? '✓' : '⚙'}
      </button>
    </div>
  )
}
