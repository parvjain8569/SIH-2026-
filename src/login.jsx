import { useState } from 'react'
import './login.css'

export default function Login({ onLoginSuccess, onBackToWebsite, initialView = 'create' }) {
  // Views: 'create' | 'otp' | 'signin'
  const [view, setView] = useState(initialView)

  // Form states (NO confirm password as requested!)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  })

  // 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [generatedOtp] = useState('482910') // Demo helper code

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
  }

  // Handle "Create Account" submission -> Leads to OTP page
  const handleCreateAccount = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { name, surname, email, password } = formData

    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // Move to OTP verification step
    setSuccess(`Verification code sent to ${email}`)
    setView('otp')
  }

  // Handle OTP verification -> Leads to "Sign In"
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')

    const enteredOtp = otpDigits.join('')
    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP code.')
      return
    }

    // Accept mock OTP or any 6 digits for testing
    setSuccess('Email verified successfully! Please sign in with your password.')
    setView('signin')
  }

  // Handle "Sign In" submission -> Leads back to main website as authenticated user
  const handleSignIn = (e) => {
    e.preventDefault()
    setError('')

    const { email, password } = formData

    if (!email.trim() || !password) {
      setError('Please enter both email address and password.')
      return
    }

    if (onLoginSuccess) {
      onLoginSuccess({
        name: formData.name ? `${formData.name} ${formData.surname || ''}`.trim() : 'Ramesh Kumar',
        email: formData.email,
      })
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Back to main website link */}
        {onBackToWebsite && (
          <button type="button" className="auth-back-link" onClick={onBackToWebsite}>
            ← Back to BhoomiSetu Website
          </button>
        )}

        {/* ============================================================
            VIEW 1: CREATE AN ACCOUNT (No confirm password!)
            ============================================================ */}
        {view === 'create' && (
          <div>
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Set up your workspace to get started.</p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <form className="auth-form" onSubmit={handleCreateAccount}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="auth-input"
                  placeholder="e.g. Ramesh"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="surname">
                  Surname
                </label>
                <input
                  id="surname"
                  type="text"
                  name="surname"
                  className="auth-input"
                  placeholder="e.g. Kumar"
                  value={formData.surname}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* ONLY PASSWORD (Confirm Password REMOVED as requested!) */}
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="auth-input"
                  placeholder="Enter password (min 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button type="submit" className="auth-btn-primary">
                Create Account & Send OTP
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('signin')
                }}
              >
                Log in
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 2: EMAIL OTP VERIFICATION PAGE
            ============================================================ */}
        {view === 'otp' && (
          <div>
            <div className="auth-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>

            <h1 className="auth-title">Verify Your Email</h1>
            <p className="auth-subtitle">
              We have sent a 6-digit OTP verification code to{' '}
              <strong style={{ color: '#0f172a' }}>{formData.email || 'your email'}</strong>.
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <div className="auth-demo-otp-pill">
              💡 Demo Verification OTP: <strong>{generatedOtp}</strong>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div className="auth-otp-row">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`auth-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className="auth-otp-input"
                    value={otpDigits[idx]}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1)
                      const newArr = [...otpDigits]
                      newArr[idx] = val
                      setOtpDigits(newArr)
                      if (val && idx < 5) {
                        document.getElementById(`auth-otp-${idx + 1}`)?.focus()
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                        document.getElementById(`auth-otp-${idx - 1}`)?.focus()
                      }
                    }}
                    required
                  />
                ))}
              </div>

              <button type="submit" className="auth-btn-primary">
                Verify OTP & Continue to Sign In
              </button>
            </form>

            <div className="auth-footer">
              Didn&apos;t receive code?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => setSuccess(`New OTP code sent to ${formData.email}`)}
              >
                Resend OTP
              </button>
              <br />
              <button
                type="button"
                className="auth-link"
                style={{ marginTop: '8px', display: 'inline-block' }}
                onClick={() => setView('create')}
              >
                ← Edit email address
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 3: SIGN IN SCREEN (White and Green theme with B Badge)
            ============================================================ */}
        {view === 'signin' && (
          <div>
            {/* Green "B" Logo Badge matching BhoomiSetu */}
            <div className="auth-badge" aria-label="BhoomiSetu Badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <polyline points="9 15 11 17 15 13"></polyline>
              </svg>
            </div>

            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">
              Welcome back. Please sign in to your
              <br />
              BhoomiSetu workspace.
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <form className="auth-form" onSubmit={handleSignIn}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="signin-email">
                  Email Address
                </label>
                <input
                  id="signin-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="signin-password">
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  name="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="auth-btn-primary">
                Sign In to Workspace
              </button>
            </form>

            <div className="auth-footer">
              Need an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('create')
                }}
              >
                Create a new account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
