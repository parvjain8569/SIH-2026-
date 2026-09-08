import { useState, useRef, useEffect } from 'react'
import './website.css'
import { extractCleanUsername, formatDisplayName } from './utils/userUtils'

// ── Layout Components ──────────────────────────────────────────
import Navbar               from './components/Navbar'
import HeroSection          from './components/HeroSection'
import FeaturesSection      from './components/FeaturesSection'
import ThreeStepsSection    from './components/ThreeStepsSection'
import ImpactSection        from './components/ImpactSection'
import TransformationFlow   from './components/TransformationFlow'
import MyRecordsSection     from './components/MyRecordsSection'
import Footer               from './components/Footer'

// ── Drawer (Logo Menu) ─────────────────────────────────────────
import MenuDrawer           from './components/drawer/MenuDrawer'

// ── Modals ─────────────────────────────────────────────────────
import AuthRequiredModal    from './components/modals/AuthRequiredModal'
import RecordDetailsModal   from './components/modals/RecordDetailsModal'

// ── Initial Sample Records for Demo Registry ───────────────────
const INITIAL_RECORDS = [
  { id: 'REC-20391', ownerName: 'Ramesh Kumar',  parcelId: 'HR-20391', date: '04 Sep 2026', status: 'Verified',      khasraNo: '45/12',  district: 'Gurugram', state: 'Haryana',     area: '2.45 Acres', documentName: 'khasra_khatouni_ramesh.pdf' },
  { id: 'REC-18776', ownerName: 'Sunita Devi',   parcelId: 'HR-18776', date: '28 Aug 2026', status: 'Verified',      khasraNo: '118/4',  district: 'Karnal',   state: 'Haryana',     area: '1.80 Acres', documentName: 'sale_deed_sunita.pdf' },
  { id: 'REC-17402', ownerName: 'Mahesh Yadav',  parcelId: 'HR-17402', date: '15 Aug 2026', status: 'Needs Review',  khasraNo: '92/1',   district: 'Rewari',   state: 'Haryana',     area: '3.10 Acres', documentName: 'mutation_doc_mahesh.jpg' },
]

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'processing', title: 'Document OCR Complete',           message: 'khasra_khatouni_ramesh.pdf processed. 14 boundary coordinates extracted.',                                   time: '12 mins ago', unread: true  },
  { id: 'n2', type: 'status',     title: 'Registry Verification Confirmed', message: 'Parcel HR-20391: Digital hash #98AF42 confirmed by Revenue Inspector against Tehsil records.',              time: '1 hour ago',  unread: true  },
  { id: 'n3', type: 'decision',   title: 'Application Accepted',            message: '✅ Land Parcel HR-20391 application approved for digital certificate issuance.',                             time: '4 hours ago', unread: true  },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function Website({ user, onLogout, onOpenLogin }) {
  // ── Page state ──────────────────────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState('Home') // 'Home' | 'My Records'

  // ── Menu Drawer state ───────────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState('profile')
  const [verificationAlert, setVerificationAlert] = useState(false)

  // ── Profile data (starts clean, populated when user signs in with email) ─────
  const emailUsername = user?.email ? extractCleanUsername(user.email) : ''
  const defaultDisplayName = user?.name || (emailUsername ? formatDisplayName(emailUsername) : '')
  const defaultUsername = user?.username || emailUsername || ''

  const [profileData, setProfileData] = useState({
    name: defaultDisplayName,
    username: defaultUsername,
    email: user?.email || '',
    contact: '',
    isPhoneVerified: false,
    gender: '',
    dob: '',
    address: '',
    district: '',
    state: 'Haryana',
  })

  // Sync profile when user logs in or user prop changes
  useEffect(() => {
    if (user) {
      const uUsername = user.username || (user.email ? extractCleanUsername(user.email) : '')
      const uName = user.name || (uUsername ? formatDisplayName(uUsername) : 'Landholder')

      setProfileData((prev) => ({
        ...prev,
        name: uName,
        username: uUsername,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  // ── Notifications ───────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => n.unread).length

  // ── Records & document upload ───────────────────────────────────────────────
  const [records,                setRecords]               = useState(INITIAL_RECORDS)
  const [lastUploadedDoc,        setLastUploadedDoc]       = useState(null)
  const [isProcessing,           setIsProcessing]          = useState(false)
  const [selectedRecordForModal, setSelectedRecordForModal]= useState(null)
  const [showModal,              setShowModal]             = useState(false)
  const [showAuthPromptModal,    setShowAuthPromptModal]   = useState(false)

  const stepsRef     = useRef(null)
  const fileInputRef = useRef(null)

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const scrollToSection = (sectionId) => {
    if (activeNav !== 'Home') {
      setActiveNav('Home')
    }
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 80)
  }

  // ── Upload logic (Gated by Login AND Mobile Number OTP Verification) ────────
  const triggerUpload = () => {
    // 1. Must be logged in
    if (!user) {
      setShowAuthPromptModal(true)
      return
    }

    // 2. Must have verified mobile number in profile
    if (!profileData.isPhoneVerified || !profileData.contact) {
      setVerificationAlert(true)
      setActiveDrawerTab('profile')
      setIsDrawerOpen(true)
      return
    }

    // 3. All verifications pass -> open system file picker
    setVerificationAlert(false)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`

    setLastUploadedDoc({
      name: file.name,
      size: sizeStr,
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    setIsProcessing(true)
    setShowModal(true)

    const newParcelId = 'HR-' + Math.floor(21000 + Math.random() * 8000)
    const newRecord = {
      id:           'REC-' + Math.floor(10000 + Math.random() * 90000),
      ownerName:    profileData.name || user?.name || user?.username || 'Authorized Landholder',
      parcelId:     newParcelId,
      date:         new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status:       'Verified',
      khasraNo:     `${Math.floor(20 + Math.random() * 150)}/${Math.floor(1 + Math.random() * 15)}`,
      district:     profileData.district || 'Dehradun',
      state:        profileData.state || 'Uttarakhand',
      area:         '1.45 Hectares',
      documentName: file.name,
      fileSize:     sizeStr,
      isNew:        true,
    }

    setTimeout(() => {
      setIsProcessing(false)
      setSelectedRecordForModal(newRecord)
      setRecords((prev) => [newRecord, ...prev])
      setNotifications((prev) => [{
        id: 'n-' + Date.now(),
        type: 'processing',
        title:   'Document Uploaded & Digitized',
        message: `${file.name} successfully parsed for ${newRecord.ownerName}. Parcel ${newParcelId} created.`,
        time: 'Just now',
        unread: true,
      }, ...prev])
    }, 1600)
  }

  // ── Profile & Settings update handlers ─────────────────────────────────────
  const handleProfileSave = (updates) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
    if (updates.isPhoneVerified) {
      setVerificationAlert(false)
    }
  }

  // ── Drawer helpers ──────────────────────────────────────────────────────────
  const openDrawer = (tab = 'profile') => {
    setVerificationAlert(false)
    setActiveDrawerTab(tab)
    setIsDrawerOpen(true)
  }

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="bhoomi-container">

      {/* Hidden file input — real OS folder picker for land documents */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
      />

      {/* ── Navigation Bar ── */}
      <Navbar
        user={user}
        unreadCount={unreadCount}
        onOpenDrawer={() => openDrawer(user ? 'profile' : 'about')}
        onOpenNotifications={() => openDrawer('notification')}
        onOpenProfile={() => openDrawer('profile')}
        onOpenAbout={() => openDrawer('about')}
        onOpenSupport={() => openDrawer('help')}
        onOpenLogin={onOpenLogin}
        onLogout={onLogout}
        onScrollToSection={scrollToSection}
      />

      {/* ── Logo Menu Drawer (Profile, Notifications, Settings, Help, About) ── */}
      {isDrawerOpen && (
        <MenuDrawer
          user={user}
          activeTab={activeDrawerTab}
          onTabChange={setActiveDrawerTab}
          onClose={() => {
            setIsDrawerOpen(false)
            setVerificationAlert(false)
          }}
          profileData={profileData}
          onProfileSave={handleProfileSave}
          onProfileUpdate={handleProfileSave}
          notifications={notifications}
          onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
          unreadCount={unreadCount}
          verificationAlert={verificationAlert}
        />
      )}

      {/* ── AUTH REQUIRED MODAL (shown when unauthenticated user clicks Upload) ── */}
      {showAuthPromptModal && (
        <AuthRequiredModal
          onClose={() => setShowAuthPromptModal(false)}
          onProceedToLogin={() => {
            setShowAuthPromptModal(false)
            onOpenLogin && onOpenLogin('signin')
          }}
        />
      )}

      {/* ── RECORD DETAILS / PROCESSING MODAL ── */}
      <RecordDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isProcessing={isProcessing}
        lastUploadedDoc={lastUploadedDoc}
        selectedRecord={selectedRecordForModal}
        onNavigateToRecords={() => setActiveNav('My Records')}
      />

      {/* ── HOME VIEW ── */}
      {activeNav === 'Home' && (
        <main>
          {/* Split Hero Section */}
          <HeroSection
            user={user}
            lastUploadedDoc={lastUploadedDoc}
            onUpload={triggerUpload}
            onScrollToSteps={() => scrollToSection('three-steps')}
            onViewRecords={() => setActiveNav('My Records')}
          />

          {/* 4-Card Technology Features Grid */}
          <FeaturesSection />

          {/* Three Simple Steps Section */}
          <ThreeStepsSection ref={stepsRef} />

          {/* Impact & Metric Statistics Section */}
          <ImpactSection />

          {/* Transformation Flow */}
          <TransformationFlow />
        </main>
      )}

      {/* ── MY RECORDS VIEW ── */}
      {activeNav === 'My Records' && (
        <MyRecordsSection
          records={records}
          onUpload={triggerUpload}
          onViewRecord={(rec) => {
            setSelectedRecordForModal(rec)
            setIsProcessing(false)
            setShowModal(true)
          }}
        />
      )}

      <Footer />
    </div>
  )
}
