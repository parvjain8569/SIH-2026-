import { useState } from 'react'

// ProfileTab: Minimal, high-contrast landholder profile with integrated mobile OTP verification
// Modeled after clean real-world portals (WhatsApp / Flipkart / DigiLocker)
export default function ProfileTab({
  profileData,
  onProfileSave,
  verificationAlert = false
}) {
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    username: profileData.username || '',
    email: profileData.email || '',
    contact: profileData.contact || '',
    isPhoneVerified: !!profileData.isPhoneVerified,
    gender: profileData.gender || '',
    dob: profileData.dob || '',
    address: profileData.address || '',
    district: profileData.district || '',
    state: profileData.state || 'Haryana',
  })

  // OTP Verification state
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (saveSuccess) setSaveSuccess('')
  }

  // Handle triggering Phone OTP
  const handleSendPhoneOtp = (e) => {
    e.preventDefault()
    setOtpError('')
    if (!formData.contact || formData.contact.replace(/\D/g, '').length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.')
      return
    }
    setShowOtpInput(true)
  }

  // Handle confirming Phone OTP
  const handleVerifyPhoneOtp = (e) => {
    e.preventDefault()
    const entered = otpDigits.join('')
    if (entered.length < 6) {
      setOtpError('Please enter the 6-digit OTP code.')
      return
    }
    // Accept demo OTP or any 6 digits for testing
    setFormData((prev) => ({ ...prev, isPhoneVerified: true }))
    setShowOtpInput(false)
    setOtpError('')
    setSaveSuccess('Mobile number verified successfully!')

    // Auto update parent state with verified phone
    onProfileSave({
      ...formData,
      isPhoneVerified: true,
      contact: formData.contact,
    })
  }

  // Handle saving full profile
  const handleSaveAll = (e) => {
    e.preventDefault()
    onProfileSave(formData)
    setSaveSuccess('Profile details saved successfully!')
    setTimeout(() => setSaveSuccess(''), 4000)
  }

  return (
    <div className="profile-tab-clean">

      {/* Upload Gating Alert Banner */}
      {(!formData.isPhoneVerified || verificationAlert) && (
        <div className="profile-verification-alert">
          <div className="alert-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="alert-title">Identity Verification Required</div>
            <div className="alert-sub">
              To upload and digitize land records, please update your profile and verify your 10-digit mobile number with OTP.
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="profile-alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4">
            <path d="m5 12 5 5L20 7" />
          </svg>
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-initial">
          {((formData.username || formData.name)?.[0] || 'U').toUpperCase()}
        </div>
        <div className="profile-header-meta">
          <h3 className="profile-display-name">{formData.name || 'Landholder Account'}</h3>
          <div className="profile-handle-row">
            {formData.username && <span className="profile-handle">@{formData.username}</span>}
            <span className={`profile-status-badge ${formData.isPhoneVerified ? 'verified' : 'unverified'}`}>
              {formData.isPhoneVerified ? '✓ Verified Account' : '● Verification Pending'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="profile-form-clean">

        {/* ── SECTION 1: Account & Verification ── */}
        <div className="profile-form-section">
          <h4 className="section-title">Account &amp; Security</h4>

          {/* Email (Derived from login, verified) */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-email">
              Registered Email
            </label>
            <div className="input-with-badge">
              <input
                id="prof-email"
                type="email"
                className="clean-input disabled"
                value={formData.email}
                disabled
              />
              <span className="input-side-badge">✓ Login Account</span>
            </div>
          </div>

          {/* Mobile Number & OTP Verification */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-contact">
              Mobile Number
            </label>
            <div className="phone-verify-row">
              <input
                id="prof-contact"
                type="tel"
                className={`clean-input ${formData.isPhoneVerified ? 'phone-verified' : ''}`}
                placeholder="Enter 10-digit mobile number"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                required
              />

              {!formData.isPhoneVerified ? (
                <button
                  type="button"
                  className="btn-send-phone-otp"
                  onClick={handleSendPhoneOtp}
                >
                  {showOtpInput ? 'Resend OTP' : 'Verify via OTP'}
                </button>
              ) : (
                <div className="phone-verified-tag">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <span>Verified</span>
                </div>
              )}
            </div>

            {otpError && <div className="field-error-text">{otpError}</div>}

            {/* OTP Input Box */}
            {showOtpInput && !formData.isPhoneVerified && (
              <div className="profile-otp-box">
                <div className="otp-box-header">
                  <span>Enter 6-Digit Verification Code:</span>
                  <span className="demo-code-pill">Demo OTP: <strong>482910</strong></span>
                </div>

                <div className="otp-inputs-grid">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`prof-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className="clean-otp-input"
                      value={otpDigits[idx]}
                      onChange={(e) => {
                        const val = e.target.value.slice(-1)
                        const arr = [...otpDigits]
                        arr[idx] = val
                        setOtpDigits(arr)
                        if (val && idx < 5) {
                          document.getElementById(`prof-otp-${idx + 1}`)?.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                          document.getElementById(`prof-otp-${idx - 1}`)?.focus()
                        }
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-verify-otp-submit"
                  onClick={handleVerifyPhoneOtp}
                >
                  Confirm &amp; Verify Mobile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 2: Landholder Identity ── */}
        <div className="profile-form-section">
          <h4 className="section-title">Landholder Details</h4>

          {/* Full Name */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-name">
              Full Legal Name (as per Land Registry)
            </label>
            <input
              id="prof-name"
              type="text"
              className="clean-input"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-two-cols">
            {/* Gender */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-gender">
                Gender
              </label>
              <select
                id="prof-gender"
                className="clean-input select"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-dob">
                Date of Birth (DOB)
              </label>
              <input
                id="prof-dob"
                type="date"
                className="clean-input"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-address">
              Village / Residential Address
            </label>
            <input
              id="prof-address"
              type="text"
              className="clean-input"
              placeholder="House/Plot No., Village/Ward, Tehsil"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="form-two-cols">
            {/* District */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-district">
                District
              </label>
              <input
                id="prof-district"
                type="text"
                className="clean-input"
                placeholder="e.g. Gurugram / Mohali"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
              />
            </div>

            {/* State */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-state">
                State / UT
              </label>
              <input
                id="prof-state"
                type="text"
                className="clean-input"
                placeholder="e.g. Haryana / Punjab"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="profile-form-footer">
          <button type="submit" className="bhoomi-btn-save-profile">
            Save Profile Details
          </button>
        </div>

      </form>
    </div>
  )
}
