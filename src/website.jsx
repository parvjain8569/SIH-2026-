import { useState, useRef } from 'react'
import './website.css'

// ── Layout Components ──────────────────────────────────────────
import Navbar               from './components/Navbar'
import HeroSection          from './components/HeroSection'
import ThreeStepsSection    from './components/ThreeStepsSection'
import TransformationFlow   from './components/TransformationFlow'
import MyRecordsSection     from './components/MyRecordsSection'
import Footer               from './components/Footer'

// ── Drawer (Logo Menu) ─────────────────────────────────────────
import MenuDrawer           from './components/drawer/MenuDrawer'

// ── Modals ─────────────────────────────────────────────────────
import AuthRequiredModal    from './components/modals/AuthRequiredModal'
import RecordDetailsModal   from './components/modals/RecordDetailsModal'

// ── Initial Data ───────────────────────────────────────────────
const INITIAL_RECORDS = [
  { id: 'REC-20391', ownerName: 'Ramesh Kumar',  parcelId: 'HR-20391', date: '04 Sep 2026', status: 'Verified',      khasraNo: '45/12',  district: 'Gurugram', state: 'Haryana',     area: '2.45 Acres', documentName: 'khasra_khatouni_ramesh.pdf' },
  { id: 'REC-18776', ownerName: 'Sunita Devi',   parcelId: 'HR-18776', date: '28 Aug 2026', status: 'Verified',      khasraNo: '118/4',  district: 'Karnal',   state: 'Haryana',     area: '1.80 Acres', documentName: 'sale_deed_sunita.pdf' },
  { id: 'REC-17402', ownerName: 'Mahesh Yadav',  parcelId: 'HR-17402', date: '15 Aug 2026', status: 'Needs Review',  khasraNo: '92/1',   district: 'Rewari',   state: 'Haryana',     area: '3.10 Acres', documentName: 'mutation_doc_mahesh.jpg' },
]

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'processing', title: 'Document OCR Complete',           message: 'khasra_khatouni_ramesh.pdf processed. 14 boundary coordinates extracted.',                                   time: '12 mins ago', unread: true  },
  { id: 'n2', type: 'status',     title: 'Registry Verification Confirmed', message: 'Parcel HR-20391: Digital hash #98AF42 confirmed by Revenue Inspector against Tehsil records.',              time: '1 hour ago',  unread: true  },
  { id: 'n3', type: 'decision',   title: 'Application Accepted',            message: '✅ Land Parcel HR-20391 application approved for digital certificate issuance.',                             time: '4 hours ago', unread: true  },
  { id: 'n4', type: 'processing', title: 'Jamabandi Cross-Check in Progress',message: 'sale_deed_sunita.pdf OCR scan finished. Cross-referencing sub-registrar database.',                         time: '1 day ago',   unread: false },
  { id: 'n5', type: 'decision',   title: 'Boundary Review Required',        message: '⚠️ Mutation application for HR-17402 flagged for physical ground-truth re-survey.',                          time: '2 days ago',  unread: false },
  { id: 'n6', type: 'status',     title: 'Digital Cryptographic Seal Applied',message: 'Parcel HR-18776 received immutable blockchain validation seal.',                                           time: '4 days ago',  unread: false },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function Website({ user, onLogout, onOpenLogin }) {
  // ── Page state ──────────────────────────────────────────────────────────────
  const [activeNav, setActiveNav]   = useState('Home') // 'Home' | 'My Records'

  // ── Menu Drawer state ───────────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen]         = useState(false)
  const [activeDrawerTab, setActiveDrawerTab]   = useState('profile')

  // ── Profile data (contact & email only changeable via Settings OTP) ─────────
  const [profileData, setProfileData] = useState({
    name:    user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Ramesh Kumar',
    age:     '34',
    gender:  'Male',
    address: 'House No. 42, Civil Lines, Sector 15, Gurugram, Haryana - 122001',
    dob:     '1992-06-14',
    contact: '00000000000',
    email:   user?.email || 'ramesh.kumar@example.com',
  })

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

  const stepsRef    = useRef(null)
  const fileInputRef= useRef(null)

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const scrollToSteps = () => {
    if (activeNav !== 'Home') {
      setActiveNav('Home')
      setTimeout(() => stepsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      stepsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ── Upload logic ────────────────────────────────────────────────────────────
  const triggerUpload = () => {
    if (!user) { setShowAuthPromptModal(true); return }
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`

    setLastUploadedDoc({ name: file.name, size: sizeStr, uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
    setIsProcessing(true)
    setShowModal(true)

    const newParcelId = 'HR-' + Math.floor(21000 + Math.random() * 8000)
    const newRecord = {
      id:           'REC-' + Math.floor(10000 + Math.random() * 90000),
      ownerName:    profileData.name || 'Authorized Landholder',
      parcelId:     newParcelId,
      date:         new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status:       'Verified',
      khasraNo:     `${Math.floor(20 + Math.random() * 150)}/${Math.floor(1 + Math.random() * 15)}`,
      district:     'Dehradun',
      state:        'Uttarakhand',
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
        id: 'n-' + Date.now(), type: 'processing',
        title:   'Document Uploaded & Digitized',
        message: `${file.name} successfully parsed. Parcel ${newParcelId} created and verified.`,
        time: 'Just now', unread: true,
      }, ...prev])
    }, 1600)
  }

  // ── Profile & Settings update handlers ─────────────────────────────────────
  const handleProfileSave = (updates) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
  }

  // ── Drawer helpers ──────────────────────────────────────────────────────────
  const openDrawer = (tab = 'profile') => { setActiveDrawerTab(tab); setIsDrawerOpen(true) }

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
        onOpenDrawer={() => openDrawer('profile')}
        onOpenNotifications={() => openDrawer('notification')}
        onOpenProfile={() => openDrawer('profile')}
        onOpenLogin={onOpenLogin}
        onLogout={onLogout}
      />

      {/* ── Logo Menu Drawer (Profile, Notifications, Settings, Help, About) ── */}
      {isDrawerOpen && (
        <MenuDrawer
          activeTab={activeDrawerTab}
          onTabChange={setActiveDrawerTab}
          onClose={() => setIsDrawerOpen(false)}
          profileData={profileData}
          onProfileSave={handleProfileSave}
          onProfileUpdate={handleProfileSave}
          notifications={notifications}
          onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
          unreadCount={unreadCount}
        />
      )}

      {/* ── AUTH REQUIRED MODAL (shown when unauthenticated user clicks Upload) ── */}
      {showAuthPromptModal && (
        <AuthRequiredModal
          onClose={() => setShowAuthPromptModal(false)}
          onProceedToLogin={() => { setShowAuthPromptModal(false); onOpenLogin && onOpenLogin('create') }}
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
          <HeroSection
            lastUploadedDoc={lastUploadedDoc}
            onUpload={triggerUpload}
            onScrollToSteps={scrollToSteps}
            onViewRecords={() => setActiveNav('My Records')}
          />
          <ThreeStepsSection ref={stepsRef} />
          <TransformationFlow />
        </main>
      )}

      {/* ── MY RECORDS VIEW ── */}
      {activeNav === 'My Records' && (
        <MyRecordsSection
          records={records}
          onUpload={triggerUpload}
          onViewRecord={(rec) => { setSelectedRecordForModal(rec); setIsProcessing(false); setShowModal(true) }}
        />
      )}

      <Footer />
    </div>
  )
}
