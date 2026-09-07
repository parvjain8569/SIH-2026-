import { useState } from 'react'

// SettingsTab handles: Change Email / Phone / Password, each with 3-step OTP verification
export default function SettingsTab({ profileData, onProfileUpdate }) {
  const [subTab, setSubTab] = useState('email') // 'email' | 'phone' | 'password'
  const [step, setStep] = useState(1)           // 1: input, 2: verify OTP, 3: success

  const [newEmail, setNewEmail]         = useState('')
  const [newPhone, setNewPhone]         = useState('')
  const [currentPass, setCurrentPass]   = useState('')
  const [newPass, setNewPass]           = useState('')
  const [otpTarget, setOtpTarget]       = useState('')
  const [otpValue, setOtpValue]         = useState(['', '', '', '', '', ''])
  const [errorMsg, setErrorMsg]         = useState('')
  const [successMsg, setSuccessMsg]     = useState('')

  const resetForm = () => {
    setStep(1)
    setNewEmail('')
    setNewPhone('')
    setCurrentPass('')
    setNewPass('')
    setErrorMsg('')
    setSuccessMsg('')
    setOtpValue(['', '', '', '', '', ''])
  }

  const switchSubTab = (tab) => {
    setSubTab(tab)
    resetForm()
  }

  const handleSendOtp = () => {
    setErrorMsg('')
    setSuccessMsg('')

    if (subTab === 'email') {
      if (!newEmail || !newEmail.includes('@')) {
        setErrorMsg('Please enter a valid new email address.')
        return
      }
      setOtpTarget(newEmail)
    } else if (subTab === 'phone') {
      if (!newPhone || newPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.')
        return
      }
      setOtpTarget(newPhone)
    } else if (subTab === 'password') {
      if (!currentPass || !newPass) {
        setErrorMsg('Please enter your current and new password.')
        return
      }
      if (newPass.length < 6) {
        setErrorMsg('New password must be at least 6 characters.')
        return
      }
      setOtpTarget(profileData.email)
    }

    setStep(2)
    setOtpValue(['', '', '', '', '', ''])
  }

  const handleVerifyOtp = () => {
    const fullOtp = otpValue.join('')
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP.')
      return
    }

    // Apply the update and notify parent
    if (subTab === 'email') {
      onProfileUpdate({ email: otpTarget })
      setSuccessMsg(`Email address successfully updated to ${otpTarget}!`)
    } else if (subTab === 'phone') {
      onProfileUpdate({ contact: otpTarget })
      setSuccessMsg(`Phone number successfully updated to ${otpTarget}!`)
    } else if (subTab === 'password') {
      setSuccessMsg('Password updated successfully!')
    }

    setStep(3)
  }

  return (
    <div>
      {/* Sub-tab Navigation with realistic SVGs */}
      <div className="settings-subtabs">
        <button
          className={`settings-subtab-btn ${subTab === 'email' ? 'active' : ''}`}
          onClick={() => switchSubTab('email')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>Change Email</span>
        </button>

        <button
          className={`settings-subtab-btn ${subTab === 'phone' ? 'active' : ''}`}
          onClick={() => switchSubTab('phone')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
          <span>Change Number</span>
        </button>

        <button
          className={`settings-subtab-btn ${subTab === 'password' ? 'active' : ''}`}
          onClick={() => switchSubTab('password')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="M12 11l8-8" />
            <path d="M17 3l4 4" />
            <path d="M14 6l2 2" />
          </svg>
          <span>Change Password</span>
        </button>
      </div>

      <div className="settings-card">
        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="auth-alert auth-alert-success" style={{ marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {/* STEP 1: Input Form */}
        {step === 1 && (
          <div>
            {subTab === 'email' && (
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
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  className="btn-upload-primary"
                  style={{ marginTop: '18px' }}
                  onClick={handleSendOtp}
                >
                  Send Verification OTP to New Email
                </button>
              </div>
            )}

            {subTab === 'phone' && (
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
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <button
                  className="btn-upload-primary"
                  style={{ marginTop: '18px' }}
                  onClick={handleSendOtp}
                >
                  Send SMS OTP to New Number
                </button>
              </div>
            )}

            {subTab === 'password' && (
              <div className="settings-form-group">
                <label className="settings-label">Current Password</label>
                <input
                  type="password"
                  className="profile-input"
                  placeholder="Enter current password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
                <label className="settings-label" style={{ marginTop: '14px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="profile-input"
                  placeholder="At least 6 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <button
                  className="btn-upload-primary"
                  style={{ marginTop: '18px' }}
                  onClick={handleSendOtp}
                >
                  Send OTP to Confirm Password Change
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111827' }}>
              Enter Verification OTP
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
              A 6-digit one-time code was sent to <strong>{otpTarget}</strong>
            </p>

            <div className="demo-otp-pill">
              💡 Demo Testing Code: <strong>482910</strong> (or enter any 6 digits)
            </div>

            <div className="otp-box-row">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`settings-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  className="otp-digit-input"
                  value={otpValue[idx]}
                  onChange={(e) => {
                    const val = e.target.value.slice(-1)
                    const next = [...otpValue]
                    next[idx] = val
                    setOtpValue(next)
                    if (val && idx < 5) {
                      document.getElementById(`settings-otp-${idx + 1}`)?.focus()
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpValue[idx] && idx > 0) {
                      document.getElementById(`settings-otp-${idx - 1}`)?.focus()
                    }
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-how-it-works-downward" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-upload-primary" onClick={handleVerifyOtp}>
                Verify OTP &amp; Update
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#15803d', fontWeight: 800 }}>
              Verification Successful!
            </h4>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
              Your updated details have been securely recorded.
            </p>
            <button className="btn-upload-primary" onClick={resetForm}>
              Update Another Setting
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
