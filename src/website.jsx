import { useState, useRef } from 'react'
import './website.css'

export default function Website({ user, onLogout, onOpenLogin }) {
  // Navigation tabs for the page: 'Home' | 'My Records'
  const [activeNav, setActiveNav] = useState('Home')

  // Auth requirement prompt modal
  const [showAuthPromptModal, setShowAuthPromptModal] = useState(false)

  // Logo Menu Drawer State (from handwritten sketch)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState('profile') // 'profile' | 'notification' | 'settings' | 'help' | 'about'

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Ramesh Kumar',
    age: '34',
    gender: 'Male',
    address: 'House No. 42, Civil Lines, Sector 15, Gurugram, Haryana - 122001',
    dob: '1992-06-14',
    contact: '+91 98765 43210',
    email: user?.email || 'ramesh.kumar@example.com',
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState({ ...profileData })

  // Notification State
  const [notifFilter, setNotifFilter] = useState('all') // 'all' | 'processing' | 'status' | 'decision'
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'processing',
      title: 'Document OCR Complete',
      message: 'khasra_khatouni_ramesh.pdf processed successfully. 14 boundary coordinates extracted.',
      time: '12 mins ago',
      unread: true,
    },
    {
      id: 'n2',
      type: 'status',
      title: 'Registry Verification Confirmed',
      message: 'Parcel HR-20391: Digital hash #98AF42 confirmed by Revenue Inspector against Tehsil records.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 'n3',
      type: 'decision',
      title: 'Application Accepted',
      message: '✅ Land Parcel HR-20391 application approved for digital certificate issuance.',
      time: '4 hours ago',
      unread: true,
    },
    {
      id: 'n4',
      type: 'processing',
      title: 'Jamabandi Cross-Check in Progress',
      message: 'sale_deed_sunita.pdf OCR scan finished. Cross-referencing sub-registrar database.',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 'n5',
      type: 'decision',
      title: 'Boundary Review Required',
      message: '⚠️ Mutation application for HR-17402 flagged for physical ground-truth re-survey.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 'n6',
      type: 'status',
      title: 'Digital Cryptographic Seal Applied',
      message: 'Parcel HR-18776 received immutable blockchain validation seal.',
      time: '4 days ago',
      unread: false,
    },
  ])

  // Settings & OTP State
  const [settingSubTab, setSettingSubTab] = useState('email') // 'email' | 'phone' | 'password'
  const [newEmailInput, setNewEmailInput] = useState('')
  const [newPhoneInput, setNewPhoneInput] = useState('')
  const [currentPassInput, setCurrentPassInput] = useState('')
  const [newPassInput, setNewPassInput] = useState('')
  const [otpStep, setOtpStep] = useState(1) // 1: input, 2: verify otp, 3: success
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', ''])
  const [otpTarget, setOtpTarget] = useState('')
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('')
  const [settingsErrorMsg, setSettingsErrorMsg] = useState('')

  // Help Center FAQ Accordions
  const [openFaq, setOpenFaq] = useState(null)

  // Real uploaded document state
  const [lastUploadedDoc, setLastUploadedDoc] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedRecordForModal, setSelectedRecordForModal] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const stepsRef = useRef(null)
  const fileInputRef = useRef(null)

  // Records list matching screenshot
  const [records, setRecords] = useState([
    {
      id: 'REC-20391',
      ownerName: 'Ramesh Kumar',
      parcelId: 'HR-20391',
      date: '04 Sep 2026',
      status: 'Verified',
      khasraNo: '45/12',
      district: 'Gurugram',
      state: 'Haryana',
      area: '2.45 Acres',
      documentName: 'khasra_khatouni_ramesh.pdf',
    },
    {
      id: 'REC-18776',
      ownerName: 'Sunita Devi',
      parcelId: 'HR-18776',
      date: '28 Aug 2026',
      status: 'Verified',
      khasraNo: '118/4',
      district: 'Karnal',
      state: 'Haryana',
      area: '1.80 Acres',
      documentName: 'sale_deed_sunita.pdf',
    },
    {
      id: 'REC-17402',
      ownerName: 'Mahesh Yadav',
      parcelId: 'HR-17402',
      date: '15 Aug 2026',
      status: 'Needs Review',
      khasraNo: '92/1',
      district: 'Rewari',
      state: 'Haryana',
      area: '3.10 Acres',
      documentName: 'mutation_doc_mahesh.jpg',
    },
  ])

  // Navigation helpers
  const scrollToSteps = () => {
    if (activeNav !== 'Home') {
      setActiveNav('Home')
      setTimeout(() => {
        stepsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      stepsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    setActiveNav('Home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const triggerUpload = () => {
    if (!user) {
      setShowAuthPromptModal(true)
      return
    }
    fileInputRef.current?.click()
  }

  // Handle document upload from local folder
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeInKb = (file.size / 1024).toFixed(1)
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`

    const docInfo = {
      name: file.name,
      size: sizeStr,
      type: file.type || 'Document',
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setLastUploadedDoc(docInfo)
    setIsProcessing(true)
    setShowModal(true)

    const newRecordId = 'HR-' + Math.floor(21000 + Math.random() * 8000)
    const newRecord = {
      id: 'REC-' + Math.floor(10000 + Math.random() * 90000),
      ownerName: profileData.name || 'Authorized Landholder',
      parcelId: newRecordId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2026' }),
      status: 'Verified',
      khasraNo: `${Math.floor(20 + Math.random() * 150)}/${Math.floor(1 + Math.random() * 15)}`,
      district: 'Dehradun',
      state: 'Uttarakhand',
      area: '1.45 Hectares',
      documentName: file.name,
      fileSize: sizeStr,
      isNew: true,
    }

    setTimeout(() => {
      setIsProcessing(false)
      setSelectedRecordForModal(newRecord)
      setRecords((prev) => [newRecord, ...prev])

      // Add a processing notification
      setNotifications((prev) => [
        {
          id: 'n-' + Date.now(),
          type: 'processing',
          title: 'Document Uploaded & Digtized',
          message: `${file.name} successfully parsed. Parcel ${newRecordId} created and verified.`,
          time: 'Just now',
          unread: true,
        },
        ...prev,
      ])
    }, 1600)
  }

  // Profile Edit Handlers
  const handleSaveProfile = () => {
    setProfileData((prev) => ({
      ...prev,
      name: editProfileForm.name,
      age: editProfileForm.age,
      gender: editProfileForm.gender,
      address: editProfileForm.address,
      dob: editProfileForm.dob,
      // email & contact remain locked as requested!
    }))
    setIsEditingProfile(false)
  }

  // Settings OTP Flow Handlers
  const handleSendOtp = (type) => {
    setSettingsErrorMsg('')
    setSettingsSuccessMsg('')

    if (type === 'email') {
      if (!newEmailInput || !newEmailInput.includes('@')) {
        setSettingsErrorMsg('Please enter a valid new email address.')
        return
      }
      setOtpTarget(newEmailInput)
    } else if (type === 'phone') {
      if (!newPhoneInput || newPhoneInput.length < 10) {
        setSettingsErrorMsg('Please enter a valid 10-digit mobile number.')
        return
      }
      setOtpTarget(newPhoneInput)
    } else if (type === 'password') {
      if (!currentPassInput || !newPassInput) {
        setSettingsErrorMsg('Please enter your current and new password.')
        return
      }
      if (newPassInput.length < 6) {
        setSettingsErrorMsg('New password must be at least 6 characters.')
        return
      }
      setOtpTarget(profileData.email)
    }

    setOtpStep(2)
    setOtpValue(['', '', '', '', '', ''])
  }

  const handleVerifyOtp = () => {
    const fullOtp = otpValue.join('')
    if (fullOtp.length < 6) {
      setSettingsErrorMsg('Please enter the full 6-digit OTP.')
      return
    }

    // Accept mock OTP or any 6 digits for testing
    if (settingSubTab === 'email') {
      setProfileData((prev) => ({ ...prev, email: otpTarget }))
      setSettingsSuccessMsg(`Email address successfully updated to ${otpTarget}!`)
    } else if (settingSubTab === 'phone') {
      setProfileData((prev) => ({ ...prev, contact: otpTarget }))
      setSettingsSuccessMsg(`Phone number successfully updated to ${otpTarget}!`)
    } else if (settingSubTab === 'password') {
      setSettingsSuccessMsg('Password updated successfully!')
    }

    setOtpStep(3)
  }

  const resetSettingsForm = () => {
    setOtpStep(1)
    setNewEmailInput('')
    setNewPhoneInput('')
    setCurrentPassInput('')
    setNewPassInput('')
    setSettingsErrorMsg('')
    setSettingsSuccessMsg('')
    setOtpValue(['', '', '', '', '', ''])
  }

  const openRecordModal = (record) => {
    setSelectedRecordForModal(record)
    setIsProcessing(false)
    setShowModal(true)
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="bhoomi-container">
      {/* Hidden file input: opens folder to pick land documents */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
      />

      {/* NAVBAR */}
      <header className="bhoomi-navbar">
        {/* LOGO TRIGGER (Opens menu drawer on click as requested) */}
        <div
          className="bhoomi-logo-trigger"
          onClick={() => setIsDrawerOpen(true)}
          title="Click to open Profile, Notifications, Settings, Help & About"
        >
          <div className="bhoomi-hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="bhoomi-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <polyline points="9 15 11 17 15 13"></polyline>
            </svg>
          </div>
          <span className="bhoomi-logo-text">BhoomiSetu</span>
        </div>

        {/* CENTER NAVBAR LINKS REMOVED AS REQUESTED */}

        <div className="bhoomi-nav-right">
          {/* Quick Notification Bell in Navbar */}
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px' }}
            onClick={() => {
              setIsDrawerOpen(true)
              setActiveDrawerTab('notification')
            }}
            title="View Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                }}
              />
            )}
          </button>

          {user ? (
            <>
              <div
                className="bhoomi-user-pill"
                onClick={() => {
                  setIsDrawerOpen(true)
                  setActiveDrawerTab('profile')
                }}
                style={{ cursor: 'pointer' }}
                title="Click to view Profile"
              >
                <div className="bhoomi-user-avatar">
                  {(user.name?.[0] || 'U').toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button
                className="bhoomi-login-btn"
                onClick={onLogout}
                title="Sign out of account"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="bhoomi-login-btn"
              onClick={() => onOpenLogin && onOpenLogin('signin')}
              title="Sign in to your account"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* ============================================================
          LOGO DRAWER MENU (Profile, Notification, Setting, Help Center, About Us)
          ============================================================ */}
      {isDrawerOpen && (
        <div className="bhoomi-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="bhoomi-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Top Bar */}
            <div className="bhoomi-drawer-top">
              <div className="bhoomi-drawer-brand">
                <div className="bhoomi-logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <polyline points="9 15 11 17 15 13"></polyline>
                  </svg>
                </div>
                <h2 className="bhoomi-drawer-title">BhoomiSetu Workspace</h2>
              </div>
              <button
                className="bhoomi-drawer-close"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Menu Tabs (Matching Handwritten Diagram) */}
            <div className="bhoomi-drawer-tabs">
              <button
                className={`bhoomi-tab-btn ${activeDrawerTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('profile')}
              >
                👤 Profile
              </button>
              <button
                className={`bhoomi-tab-btn ${activeDrawerTab === 'notification' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('notification')}
              >
                🔔 Notification
                {unreadCount > 0 && <span className="bhoomi-tab-badge">{unreadCount}</span>}
              </button>
              <button
                className={`bhoomi-tab-btn ${activeDrawerTab === 'settings' ? 'active' : ''}`}
                onClick={() => {
                  setActiveDrawerTab('settings')
                  resetSettingsForm()
                }}
              >
                ⚙️ Setting
              </button>
              <button
                className={`bhoomi-tab-btn ${activeDrawerTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('help')}
              >
                ❓ Help Center
              </button>
              <button
                className={`bhoomi-tab-btn ${activeDrawerTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('about')}
              >
                ℹ️ About Us
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="bhoomi-drawer-body">
              {/* TAB 1: PROFILE */}
              {activeDrawerTab === 'profile' && (
                <div>
                  <div className="profile-card-header">
                    <div className="profile-avatar-row">
                      <div className="profile-large-avatar">
                        {(profileData.name?.[0] || 'R').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="profile-name-text">{profileData.name}</h3>
                        <span className="profile-verified-tag">
                          ✓ Aadhaar Verified Landholder
                        </span>
                      </div>
                    </div>

                    {!isEditingProfile ? (
                      <button
                        className="btn-edit-profile"
                        onClick={() => {
                          setEditProfileForm({ ...profileData })
                          setIsEditingProfile(true)
                        }}
                      >
                        ✏️ Edit Profile
                      </button>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                        Editing Details...
                      </span>
                    )}
                  </div>

                  {/* Profile Fields */}
                  <div className="profile-fields-grid">
                    {/* Name */}
                    <div className="profile-field-box">
                      <div className="profile-field-label">Name</div>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          className="profile-input"
                          value={editProfileForm.name}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                        />
                      ) : (
                        <div className="profile-field-val">{profileData.name}</div>
                      )}
                    </div>

                    {/* Age */}
                    <div className="profile-field-box">
                      <div className="profile-field-label">Age</div>
                      {isEditingProfile ? (
                        <input
                          type="number"
                          className="profile-input"
                          value={editProfileForm.age}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, age: e.target.value })}
                        />
                      ) : (
                        <div className="profile-field-val">{profileData.age} Years</div>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="profile-field-box">
                      <div className="profile-field-label">Gender</div>
                      {isEditingProfile ? (
                        <select
                          className="profile-input"
                          value={editProfileForm.gender}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, gender: e.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="profile-field-val">{profileData.gender}</div>
                      )}
                    </div>

                    {/* DOB */}
                    <div className="profile-field-box">
                      <div className="profile-field-label">Date of Birth (DOB)</div>
                      {isEditingProfile ? (
                        <input
                          type="date"
                          className="profile-input"
                          value={editProfileForm.dob}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, dob: e.target.value })}
                        />
                      ) : (
                        <div className="profile-field-val">{profileData.dob}</div>
                      )}
                    </div>

                    {/* Address (Full Width) */}
                    <div className="profile-field-box profile-field-full">
                      <div className="profile-field-label">Address</div>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          className="profile-input"
                          value={editProfileForm.address}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                        />
                      ) : (
                        <div className="profile-field-val">{profileData.address}</div>
                      )}
                    </div>

                    {/* Contact (Locked: update via Settings OTP) */}
                    <div className="profile-field-box locked">
                      <div className="profile-field-label">
                        <span>Contact (Mobile Number)</span>
                        <span className="locked-badge">🔒 Locked</span>
                      </div>
                      <div className="profile-field-val">{profileData.contact}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Can only be changed via Settings with OTP verification
                      </div>
                    </div>

                    {/* Email (Locked: update via Settings OTP) */}
                    <div className="profile-field-box locked">
                      <div className="profile-field-label">
                        <span>Email Address</span>
                        <span className="locked-badge">🔒 Locked</span>
                      </div>
                      <div className="profile-field-val">{profileData.email}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Can only be changed via Settings with OTP verification
                      </div>
                    </div>

                    {/* Edit Mode Action Buttons */}
                    {isEditingProfile && (
                      <div className="profile-edit-actions">
                        <button
                          className="btn-how-it-works-downward"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Cancel
                        </button>
                        <button className="btn-upload-primary" onClick={handleSaveProfile}>
                          Save Profile Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: NOTIFICATIONS */}
              {activeDrawerTab === 'notification' && (
                <div>
                  {/* Filter Pills */}
                  <div className="notif-filter-bar">
                    <button
                      className={`notif-filter-pill ${notifFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setNotifFilter('all')}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      className={`notif-filter-pill ${notifFilter === 'processing' ? 'active' : ''}`}
                      onClick={() => setNotifFilter('processing')}
                    >
                      📄 Document Processing
                    </button>
                    <button
                      className={`notif-filter-pill ${notifFilter === 'status' ? 'active' : ''}`}
                      onClick={() => setNotifFilter('status')}
                    >
                      🔍 Verification Status
                    </button>
                    <button
                      className={`notif-filter-pill ${notifFilter === 'decision' ? 'active' : ''}`}
                      onClick={() => setNotifFilter('decision')}
                    >
                      ⚖️ Accept / Reject
                    </button>
                  </div>

                  {/* Notification List */}
                  <div className="notif-list">
                    {notifications
                      .filter((n) => notifFilter === 'all' || n.type === notifFilter)
                      .map((n) => (
                        <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                          <div
                            className="notif-icon-circle"
                            style={{
                              backgroundColor:
                                n.type === 'decision' ? '#fef3c7' : n.type === 'status' ? '#dcfce7' : '#e0e7ff',
                              color:
                                n.type === 'decision' ? '#d97706' : n.type === 'status' ? '#15803d' : '#4338ca',
                            }}
                          >
                            {n.type === 'decision' ? '⚖️' : n.type === 'status' ? '✓' : '📄'}
                          </div>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <div className="notif-title-row">
                              <h4 className="notif-title">{n.title}</h4>
                              <span className="notif-time">{n.time}</span>
                            </div>
                            <p className="notif-message">{n.message}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      className="btn-view-record"
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                    >
                      ✓ Mark all as read
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: SETTINGS (Change Email, Phone, Password via OTP) */}
              {activeDrawerTab === 'settings' && (
                <div>
                  <div className="settings-subtabs">
                    <button
                      className={`settings-subtab-btn ${settingSubTab === 'email' ? 'active' : ''}`}
                      onClick={() => {
                        setSettingSubTab('email')
                        resetSettingsForm()
                      }}
                    >
                      📧 Change Email
                    </button>
                    <button
                      className={`settings-subtab-btn ${settingSubTab === 'phone' ? 'active' : ''}`}
                      onClick={() => {
                        setSettingSubTab('phone')
                        resetSettingsForm()
                      }}
                    >
                      📱 Change Number
                    </button>
                    <button
                      className={`settings-subtab-btn ${settingSubTab === 'password' ? 'active' : ''}`}
                      onClick={() => {
                        setSettingSubTab('password')
                        resetSettingsForm()
                      }}
                    >
                      🔑 Change Password
                    </button>
                  </div>

                  <div className="settings-card">
                    {settingsErrorMsg && (
                      <div className="auth-alert auth-alert-error" style={{ marginBottom: '16px' }}>
                        {settingsErrorMsg}
                      </div>
                    )}
                    {settingsSuccessMsg && (
                      <div className="auth-alert auth-alert-success" style={{ marginBottom: '16px' }}>
                        {settingsSuccessMsg}
                      </div>
                    )}

                    {/* STEP 1: Enter New Details */}
                    {otpStep === 1 && (
                      <div>
                        {settingSubTab === 'email' && (
                          <div className="settings-form-group">
                            <label className="settings-label">Current Email</label>
                            <input
                              type="text"
                              disabled
                              className="profile-input"
                              value={profileData.email}
                              style={{ backgroundColor: '#f1f5f9' }}
                            />
                            <label className="settings-label" style={{ marginTop: '14px' }}>
                              New Email Address
                            </label>
                            <input
                              type="email"
                              className="profile-input"
                              placeholder="Enter your new email"
                              value={newEmailInput}
                              onChange={(e) => setNewEmailInput(e.target.value)}
                            />
                            <button
                              className="btn-upload-primary"
                              style={{ marginTop: '18px' }}
                              onClick={() => handleSendOtp('email')}
                            >
                              Send Verification OTP to New Email
                            </button>
                          </div>
                        )}

                        {settingSubTab === 'phone' && (
                          <div className="settings-form-group">
                            <label className="settings-label">Current Mobile Number</label>
                            <input
                              type="text"
                              disabled
                              className="profile-input"
                              value={profileData.contact}
                              style={{ backgroundColor: '#f1f5f9' }}
                            />
                            <label className="settings-label" style={{ marginTop: '14px' }}>
                              New Mobile Number
                            </label>
                            <input
                              type="tel"
                              className="profile-input"
                              placeholder="+91 9XXXXXXXXX"
                              value={newPhoneInput}
                              onChange={(e) => setNewPhoneInput(e.target.value)}
                            />
                            <button
                              className="btn-upload-primary"
                              style={{ marginTop: '18px' }}
                              onClick={() => handleSendOtp('phone')}
                            >
                              Send SMS OTP to New Number
                            </button>
                          </div>
                        )}

                        {settingSubTab === 'password' && (
                          <div className="settings-form-group">
                            <label className="settings-label">Current Password</label>
                            <input
                              type="password"
                              className="profile-input"
                              placeholder="Enter current password"
                              value={currentPassInput}
                              onChange={(e) => setCurrentPassInput(e.target.value)}
                            />
                            <label className="settings-label" style={{ marginTop: '14px' }}>
                              New Password
                            </label>
                            <input
                              type="password"
                              className="profile-input"
                              placeholder="At least 6 characters"
                              value={newPassInput}
                              onChange={(e) => setNewPassInput(e.target.value)}
                            />
                            <button
                              className="btn-upload-primary"
                              style={{ marginTop: '18px' }}
                              onClick={() => handleSendOtp('password')}
                            >
                              Send OTP to Confirm Password Change
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 2: Enter & Verify 6-digit OTP */}
                    {otpStep === 2 && (
                      <div style={{ textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111827' }}>
                          Enter Verification OTP
                        </h4>
                        <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
                          A 6-digit one-time code was sent to <strong>{otpTarget}</strong>
                        </p>

                        {/* Demo Testing Pill for Convenience */}
                        <div className="demo-otp-pill">
                          💡 Demo Testing Code: <strong>482910</strong> (or enter any 6 digits)
                        </div>

                        {/* 6 Digit Inputs */}
                        <div className="otp-box-row">
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              type="text"
                              maxLength={1}
                              className="otp-digit-input"
                              value={otpValue[idx]}
                              onChange={(e) => {
                                const val = e.target.value.slice(-1)
                                const newArr = [...otpValue]
                                newArr[idx] = val
                                setOtpValue(newArr)
                                if (val && idx < 5) {
                                  document.getElementById(`otp-${idx + 1}`)?.focus()
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otpValue[idx] && idx > 0) {
                                  document.getElementById(`otp-${idx - 1}`)?.focus()
                                }
                              }}
                            />
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          <button className="btn-how-it-works-downward" onClick={() => setOtpStep(1)}>
                            Back
                          </button>
                          <button className="btn-upload-primary" onClick={handleVerifyOtp}>
                            Verify OTP & Update
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Success Confirmation */}
                    {otpStep === 3 && (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '42px', marginBottom: '12px' }}>🎉</div>
                        <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#15803d' }}>
                          Verification Successful!
                        </h4>
                        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
                          Your updated details have been securely recorded.
                        </p>
                        <button className="btn-upload-primary" onClick={resetSettingsForm}>
                          Update Another Setting
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: HELP CENTER */}
              {activeDrawerTab === 'help' && (
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#0f172a' }}>
                    BhoomiSetu Help Center & Knowledge Base
                  </h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>
                    Everything you need to know about updating details, verification, and support.
                  </p>

                  {/* FAQ Accordions */}
                  <div className="help-guide-card">
                    <div
                      className="help-guide-header"
                      onClick={() => setOpenFaq(openFaq === 'faq1' ? null : 'faq1')}
                    >
                      <span>1. How to update Email Address via OTP Verification</span>
                      <span>{openFaq === 'faq1' ? '▲' : '▼'}</span>
                    </div>
                    {openFaq === 'faq1' && (
                      <div className="help-guide-body">
                        To update your registered email: Go to <strong>Setting ➔ Change Email</strong>. Enter your new email address and click "Send Verification OTP". Check your inbox for the 6-digit OTP code, enter it in the prompt, and click "Verify & Update". Your profile will immediately reflect the new email.
                      </div>
                    )}
                  </div>

                  <div className="help-guide-card">
                    <div
                      className="help-guide-header"
                      onClick={() => setOpenFaq(openFaq === 'faq2' ? null : 'faq2')}
                    >
                      <span>2. How to change your Mobile Number</span>
                      <span>{openFaq === 'faq2' ? '▲' : '▼'}</span>
                    </div>
                    {openFaq === 'faq2' && (
                      <div className="help-guide-body">
                        Go to <strong>Setting ➔ Change Number</strong>. Enter your new 10-digit mobile number. You will receive an SMS containing a 6-digit OTP. Enter the code to bind the new phone number to your landholder profile.
                      </div>
                    )}
                  </div>

                  <div className="help-guide-card">
                    <div
                      className="help-guide-header"
                      onClick={() => setOpenFaq(openFaq === 'faq3' ? null : 'faq3')}
                    >
                      <span>3. Why are Email and Phone locked in the Profile tab?</span>
                      <span>{openFaq === 'faq3' ? '▲' : '▼'}</span>
                    </div>
                    {openFaq === 'faq3' && (
                      <div className="help-guide-body">
                        For land record security and fraud prevention, critical identifiers (Email & Phone Number) cannot be casually overwritten in the profile editor. They require cryptographic two-factor OTP verification in the <strong>Setting</strong> tab.
                      </div>
                    )}
                  </div>

                  <div className="help-guide-card">
                    <div
                      className="help-guide-header"
                      onClick={() => setOpenFaq(openFaq === 'faq4' ? null : 'faq4')}
                    >
                      <span>4. What does "Needs Review" status mean?</span>
                      <span>{openFaq === 'faq4' ? '▲' : '▼'}</span>
                    </div>
                    {openFaq === 'faq4' && (
                      <div className="help-guide-body">
                        "Needs Review" indicates that the uploaded document had partial legibility or a slight discrepancy with the Tehsil GIS map. Our automated system routes it to the local Revenue Officer for physical cross-verification.
                      </div>
                    )}
                  </div>

                  {/* Support Contact Channels (Requested by user) */}
                  <h4 style={{ margin: '28px 0 12px 0', fontSize: '16px', color: '#0f172a' }}>
                    Official Support Channels
                  </h4>
                  <div className="help-channels-grid">
                    <a
                      href="mailto:support@bhoomisetu.gov.in"
                      className="help-channel-box"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="help-channel-icon" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                        ✉️
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Official Email</div>
                        <strong style={{ fontSize: '14px' }}>support@bhoomisetu.gov.in</strong>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/919812345678"
                      className="help-channel-box"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="help-channel-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        💬
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>WhatsApp Helpdesk</div>
                        <strong style={{ fontSize: '14px' }}>+91 98123 45678</strong>
                      </div>
                    </a>

                    <a
                      href="https://x.com/BhoomiSetu_Gov"
                      className="help-channel-box"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="help-channel-icon" style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}>
                        𝕏
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>X (Twitter) Support</div>
                        <strong style={{ fontSize: '14px' }}>@BhoomiSetu_Gov</strong>
                      </div>
                    </a>

                    <a
                      href="https://instagram.com/bhoomisetu_official"
                      className="help-channel-box"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="help-channel-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                        📷
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Instagram Portal</div>
                        <strong style={{ fontSize: '14px' }}>@bhoomisetu_official</strong>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 5: ABOUT US (With Project Info & Live Updates Changelog) */}
              {activeDrawerTab === 'about' && (
                <div>
                  <div className="about-hero-box">
                    <span className="about-version-tag">Version 2.4.0 · SIH 2026 Edition</span>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>
                      BhoomiSetu: Intelligent Land Record Digitization & Validation System
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
                      BhoomiSetu is a national-scale digital infrastructure platform designed to bridge traditional paper land registries with modern, tamper-proof digital property ecosystems through AI OCR extraction, GIS spatial boundary alignment, and blockchain cryptographic auditing.
                    </p>
                  </div>

                  <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>
                    Core Technology Pillars
                  </h4>
                  <div className="about-features-grid">
                    <div className="about-feature-card">
                      <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '4px' }}>
                        🧠 Multilingual OCR
                      </strong>
                      <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Parses regional Khasra, Khatauni, and Jamabandi scripts with high accuracy.
                      </span>
                    </div>

                    <div className="about-feature-card">
                      <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '4px' }}>
                        🗺️ Cadastral GIS Alignment
                      </strong>
                      <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Instantly maps extracted polygon coordinates directly onto village survey plans.
                      </span>
                    </div>

                    <div className="about-feature-card">
                      <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '4px' }}>
                        🔒 Cryptographic Seal
                      </strong>
                      <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Digital certificate timestamping prevents duplicate registry tampering.
                      </span>
                    </div>

                    <div className="about-feature-card">
                      <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '4px' }}>
                        ⚡ Two-Factor OTP Security
                      </strong>
                      <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                        Protects landholder identity with multi-channel authentication.
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Changelog Box (Always updated with upcoming changes as requested!) */}
                  <div className="changelog-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                        🚀 Project Release History & Updates
                      </strong>
                      <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Current Release: v2.4.0
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13.5px', color: '#4b5563', lineHeight: '1.8' }}>
                      <li>
                        <strong>Logo Drawer System:</strong> Integrated quick-access drawer for Profile, Notifications, Settings, Help Center, and About Us.
                      </li>
                      <li>
                        <strong>Secure Profile & OTP Engine:</strong> Lock protection on critical identifiers with interactive 6-digit OTP verification.
                      </li>
                      <li>
                        <strong>Real Folder Document Ingestion:</strong> Native file dialog integration with live file name badge & instant digitization.
                      </li>
                      <li>
                        <strong>My Records Portal:</strong> Full registry ledger matching BhoomiSetu portal specifications with instant certificate viewer.
                      </li>
                      <li>
                        <strong>Responsive UI Architecture:</strong> Clean contrast styling optimized for government portal accessibility standards.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUTH REQUIRED MODAL PROMPT (when unauthenticated user clicks Upload) */}
      {showAuthPromptModal && (
        <div className="bhoomi-modal-overlay" onClick={() => setShowAuthPromptModal(false)}>
          <div
            className="bhoomi-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', textAlign: 'center' }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#166534',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
              }}
            >
              🔒
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Sign In Required
            </h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              To upload, digitize, and verify your land records, please sign in or create an account first.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-upload-primary"
                style={{ justifyContent: 'center', width: '100%' }}
                onClick={() => {
                  setShowAuthPromptModal(false)
                  onOpenLogin && onOpenLogin('create')
                }}
              >
                Create Account / Sign In →
              </button>
              <button
                className="btn-how-it-works-downward"
                style={{ width: '100%' }}
                onClick={() => setShowAuthPromptModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 1: HOME PAGE (Hero + Downwards How It Works + Steps)
          ============================================================ */}
      {activeNav === 'Home' && (
        <main>
          {/* HERO SECTION */}
          <section className="bhoomi-hero">
            <h1 className="bhoomi-hero-title">
              Turn Your Land Documents Into
              <br />
              Verified Digital Records
            </h1>

            <p className="bhoomi-hero-subtitle">
              Upload your land document and let BhoomiSetu extract, validate and
              organize the information for you.
            </p>

            {/* Display name of recently uploaded document if available */}
            {lastUploadedDoc && (
              <div className="bhoomi-uploaded-banner">
                <div className="bhoomi-uploaded-info">
                  <div className="bhoomi-uploaded-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <polyline points="9 15 11 17 15 13"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="bhoomi-uploaded-name">
                      📄 {lastUploadedDoc.name}
                    </div>
                    <div className="bhoomi-uploaded-sub">
                      {lastUploadedDoc.size} · Uploaded at {lastUploadedDoc.uploadTime} · Digitized
                    </div>
                  </div>
                </div>

                <button
                  className="bhoomi-view-records-btn"
                  onClick={() => setActiveNav('My Records')}
                >
                  View in My Records →
                </button>
              </div>
            )}

            {/* ACTIONS: "How It Works" IS POSITIONED DOWNWARDS (BELOW UPLOAD) AS REQUESTED */}
            <div className="bhoomi-hero-actions-column">
              {/* Top: Upload Land Document */}
              <button className="btn-upload-primary" onClick={triggerUpload}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m8 16 4-4 4 4"></path>
                </svg>
                Upload Land Document
              </button>

              {/* Downwards: How It Works Button */}
              <button className="btn-how-it-works-downward" onClick={scrollToSteps}>
                How It Works
              </button>
            </div>

            {/* WORKING DOWN ARROW: Scrolls down to Three Simple Steps */}
            <div
              className="bhoomi-down-arrow-container"
              onClick={scrollToSteps}
              role="button"
              tabIndex={0}
              aria-label="Scroll down to Three Simple Steps"
              onKeyDown={(e) => e.key === 'Enter' && scrollToSteps()}
            >
              <div className="bhoomi-down-arrow-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14"></path>
                  <path d="m19 12-7 7-7-7"></path>
                </svg>
              </div>
              <span className="bhoomi-down-arrow-label">Explore Steps</span>
            </div>
          </section>

          {/* SECTION 2: THREE SIMPLE STEPS (Displayed before the transformation flow) */}
          <section className="bhoomi-steps-section" ref={stepsRef} id="three-steps">
            <div className="bhoomi-steps-wrapper">
              <h2 className="bhoomi-steps-heading">Three Simple Steps</h2>

              <div className="bhoomi-steps-grid">
                {/* Step 1 */}
                <div className="bhoomi-step-card">
                  <div className="bhoomi-step-icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                      <path d="M12 12v9"></path>
                      <path d="m8 16 4-4 4 4"></path>
                    </svg>
                  </div>
                  <span className="bhoomi-step-number">01</span>
                  <h3 className="bhoomi-step-title">Upload</h3>
                  <p className="bhoomi-step-desc">Upload your document.</p>
                </div>

                {/* Step 2 */}
                <div className="bhoomi-step-card">
                  <div className="bhoomi-step-icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <span className="bhoomi-step-number">02</span>
                  <h3 className="bhoomi-step-title">Verify</h3>
                  <p className="bhoomi-step-desc">Information is extracted and validated.</p>
                </div>

                {/* Step 3 */}
                <div className="bhoomi-step-card">
                  <div className="bhoomi-step-icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <span className="bhoomi-step-number">03</span>
                  <h3 className="bhoomi-step-title">Get Digital Record</h3>
                  <p className="bhoomi-step-desc">Receive your verified digital record.</p>
                </div>
              </div>
            </div>
          </section>

          {/* TRANSFORMATION FLOW (Placed just above the end of page) */}
          <section className="bhoomi-flow-section">
            <div className="bhoomi-flow-wrapper">
              <div className="flow-card-source">
                <div className="flow-card-icon-grey">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="flow-card-title">Land Document</div>
                  <div className="flow-card-sub">PDF / JPG / PNG</div>
                </div>
              </div>

              <div className="flow-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>

              <div className="flow-card-target">
                <div className="flow-card-icon-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="flow-card-title">Verified Digital Record</div>
                  <div className="flow-card-sub green">Ready to download</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================
          VIEW 2: MY RECORDS VIEW (Matching User's Screenshot)
          ============================================================ */}
      {activeNav === 'My Records' && (
        <main className="bhoomi-my-records-section">
          {/* Header Row: Title & "Upload New Document" Button */}
          <div className="bhoomi-my-records-header">
            <div>
              <h1 className="bhoomi-records-title">My Records</h1>
              <p className="bhoomi-records-subtitle">
                Your digitized land records in one place.
              </p>
            </div>

            <button className="btn-upload-primary" onClick={triggerUpload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m8 16 4-4 4 4"></path>
              </svg>
              Upload New Document
            </button>
          </div>

          {/* Records List Card */}
          <div className="bhoomi-records-card">
            {records.map((rec) => (
              <div
                key={rec.id}
                className={`bhoomi-record-item ${rec.isNew ? 'newly-added' : ''}`}
              >
                <div className="bhoomi-record-left">
                  <h3 className="bhoomi-record-owner">
                    {rec.ownerName}
                    {rec.isNew && (
                      <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
                        Just Uploaded
                      </span>
                    )}
                  </h3>
                  <p className="bhoomi-record-meta">
                    Parcel ID: {rec.parcelId} · {rec.date}
                  </p>
                  {rec.documentName && (
                    <span className="bhoomi-record-filename-tag">
                      📄 {rec.documentName} {rec.fileSize ? `(${rec.fileSize})` : ''}
                    </span>
                  )}
                </div>

                <div className="bhoomi-record-right">
                  {/* Status Badge */}
                  {rec.status === 'Verified' ? (
                    <span className="status-pill status-pill-verified">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="9 12 11 14 15 10"></polyline>
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="status-pill status-pill-review">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      Needs Review
                    </span>
                  )}

                  {/* View Record Button */}
                  <button
                    className="btn-view-record"
                    onClick={() => openRecordModal(rec)}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="bhoomi-footer">
        <div className="bhoomi-footer-left">BhoomiSetu</div>
        <div className="bhoomi-footer-right">
          Intelligent Land Record Digitization & Validation System
        </div>
      </footer>

      {/* DETAILED VERIFIED RECORD / EXTRACTION MODAL */}
      {showModal && (
        <div className="bhoomi-modal-overlay" onClick={() => !isProcessing && setShowModal(false)}>
          <div className="bhoomi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bhoomi-modal-header">
              <h3 className="bhoomi-modal-title">
                {isProcessing ? 'Validating Land Record...' : 'Record Digitized & Verified'}
              </h3>
              {!isProcessing && (
                <button className="bhoomi-modal-close" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              )}
            </div>

            {isProcessing ? (
              <div className="bhoomi-upload-status">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#111827' }}>
                    Reading {lastUploadedDoc?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4b5563' }}>
                    Extracting cadastral survey map & registry seal...
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="bhoomi-upload-status"
                  style={{
                    backgroundColor: selectedRecordForModal?.status === 'Verified' ? '#ecfdf5' : '#fffbeb',
                    borderColor: selectedRecordForModal?.status === 'Verified' ? '#a7f3d0' : '#fde68a',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedRecordForModal?.status === 'Verified' ? '#16a34a' : '#d97706'} strokeWidth="2.5">
                    {selectedRecordForModal?.status === 'Verified' ? (
                      <>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="9 12 11 14 15 10"></polyline>
                      </>
                    ) : (
                      <>
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </>
                    )}
                  </svg>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14.5px', color: selectedRecordForModal?.status === 'Verified' ? '#166534' : '#92400e' }}>
                      {selectedRecordForModal?.status === 'Verified' ? 'Official Registry Verified' : 'Manual Review Pending'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: selectedRecordForModal?.status === 'Verified' ? '#15803d' : '#b45309' }}>
                      {selectedRecordForModal?.status === 'Verified'
                        ? 'Cryptographic digital hash verified against state land records database.'
                        : 'Discrepancy detected in boundary survey. Scheduled for officer review.'}
                    </div>
                  </div>
                </div>

                {selectedRecordForModal && (
                  <div className="bhoomi-doc-details">
                    <div className="bhoomi-doc-row">
                      <span style={{ color: '#6b7280' }}>Document File:</span>
                      <strong style={{ color: '#111827' }}>{selectedRecordForModal.documentName || 'land_record.pdf'}</strong>
                    </div>
                    <div className="bhoomi-doc-row">
                      <span style={{ color: '#6b7280' }}>Owner Name:</span>
                      <strong style={{ color: '#111827' }}>{selectedRecordForModal.ownerName}</strong>
                    </div>
                    <div className="bhoomi-doc-row">
                      <span style={{ color: '#6b7280' }}>Parcel ID:</span>
                      <strong style={{ color: '#111827' }}>{selectedRecordForModal.parcelId}</strong>
                    </div>
                    <div className="bhoomi-doc-row">
                      <span style={{ color: '#6b7280' }}>Khasra / Plot No:</span>
                      <strong style={{ color: '#111827' }}>{selectedRecordForModal.khasraNo}</strong>
                    </div>
                    <div className="bhoomi-doc-row">
                      <span style={{ color: '#6b7280' }}>Location:</span>
                      <strong style={{ color: '#111827' }}>
                        {selectedRecordForModal.district}, {selectedRecordForModal.state}
                      </strong>
                    </div>
                    <div className="bhoomi-doc-row">
                      <span style={{ color: '#6b7280' }}>Total Area:</span>
                      <strong style={{ color: '#111827' }}>{selectedRecordForModal.area}</strong>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn-upload-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => {
                      alert(`Verified Digital Certificate (${selectedRecordForModal?.parcelId}) downloaded!`)
                      setShowModal(false)
                    }}
                  >
                    Download Certificate
                  </button>
                  <button
                    className="btn-how-it-works-downward"
                    onClick={() => {
                      setShowModal(false)
                      setActiveNav('My Records')
                    }}
                  >
                    Go to My Records
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
