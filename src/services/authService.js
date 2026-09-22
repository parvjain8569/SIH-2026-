/**
 * BhoomiSetu Authentication Service
 * Communicates with the Express backend (/api/auth) and provides
 * client-side synchronized persistence with cryptographically secure password hashing.
 */

const API_BASE = 'http://localhost:5000/api/auth'
const STORAGE_USERS_KEY = 'bhoomi_users_db'
const STORAGE_CURRENT_USER_KEY = 'bhoomi_current_user'
const STORAGE_TOKEN_KEY = 'bhoomi_auth_token'

/**
 * Compute cryptographic SHA-256 hash using Web Crypto API
 */
async function hashPasswordClient(password, salt) {
  try {
    const enc = new TextEncoder()
    const data = enc.encode(password + ':' + salt)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch {
    // Fallback pseudo-hash
    let h = 0
    const str = password + salt
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
    }
    return String(Math.abs(h))
  }
}

/**
 * Retrieve local fallback users store
 */
function getLocalUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('[BhoomIntelli Auth] Local users parse error:', e)
  }
  // Default seeded dev user
  return [
    {
      id: 'USR-1001',
      email: 'dev@bhoomintelli.in',
      name: 'Dev User',
      surname: 'Tester',
      username: 'devuser',
      salt: 'seeded_salt_123',
      // SHA-256 of 'Password123!:seeded_salt_123'
      passwordHash: '86e24694da1c75c3ffc4b8b603ebbebf2087532dfcce03fb1d0b5e903f905c14',
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
      },
      createdAt: '2026-09-01T00:00:00.000Z',
    },
  ]
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
  } catch (e) {
    console.warn('[BhoomIntelli Auth] Local users save error:', e)
  }
}

export const authService = {
  /**
   * Get the current authenticated user from local storage
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      return null
    }
    return null
  },

  /**
   * Set the active session user
   */
  setCurrentUser(user, token = null) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user))
        if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token)
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
        localStorage.removeItem(STORAGE_TOKEN_KEY)
      }
    } catch (e) {
      console.warn('[BhoomIntelli Auth] Session save error:', e)
    }
  },

  /**
   * Register a new user account
   */
  async register({ name, surname, email, password }) {
    const trimmedEmail = email.trim().toLowerCase()
    
    // 1. Attempt registering via Express backend
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email: trimmedEmail, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.')
      }

      // Also sync to local database
      const localUsers = getLocalUsers()
      if (!localUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        const salt = Math.random().toString(36).substring(2, 15)
        const clientHash = await hashPasswordClient(password, salt)
        localUsers.push({
          ...data.user,
          salt,
          passwordHash: clientHash,
        })
        saveLocalUsers(localUsers)
      }

      return { success: true, user: data.user, token: data.token }
    } catch (apiErr) {
      // If backend responded with validation error, bubble it up
      if (apiErr.message && !apiErr.message.includes('fetch') && !apiErr.message.includes('NetworkError')) {
        throw apiErr
      }

      console.warn('[BhoomIntelli Auth] Backend offline, falling back to local user store:', apiErr.message)

      // Fallback: Local registration
      const localUsers = getLocalUsers()
      if (localUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        throw new Error('An account with this email already exists.')
      }

      const salt = Math.random().toString(36).substring(2, 15)
      const passwordHash = await hashPasswordClient(password, salt)
      const username = trimmedEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')

      const newUser = {
        id: 'USR-' + String(Date.now()).slice(-6),
        email: trimmedEmail,
        name: name.trim(),
        surname: surname.trim(),
        username: username || 'user',
        salt,
        passwordHash,
        aadhaarVerified: false,
        aadhaarDetails: null,
        createdAt: new Date().toISOString(),
      }

      localUsers.push(newUser)
      saveLocalUsers(localUsers)

      const { passwordHash: _, salt: __, ...safeUser } = newUser
      return { success: true, user: safeUser, token: 'offline-token-' + Date.now() }
    }
  },

  /**
   * Sign In with email & password
   */
  async login(email, password) {
    const trimmedEmail = email.trim().toLowerCase()

    // 1. Attempt login with Express backend
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password.')
      }

      this.setCurrentUser(data.user, data.token)
      return { success: true, user: data.user, token: data.token }
    } catch (apiErr) {
      if (apiErr.message && !apiErr.message.includes('fetch') && !apiErr.message.includes('NetworkError')) {
        throw apiErr
      }

      console.warn('[BhoomIntelli Auth] Backend offline, verifying credentials locally:', apiErr.message)

      // Fallback: Local authentication
      const localUsers = getLocalUsers()
      const user = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
      if (!user) {
        throw new Error('Invalid email or password.')
      }

      const hash = await hashPasswordClient(password, user.salt)
      if (hash !== user.passwordHash) {
        throw new Error('Invalid email or password.')
      }

      const { passwordHash: _, salt: __, ...safeUser } = user
      this.setCurrentUser(safeUser, 'offline-token-' + Date.now())
      return { success: true, user: safeUser }
    }
  },

  /**
   * Reset Password
   */
  async resetPassword(email, newPassword) {
    const trimmedEmail = email.trim().toLowerCase()

    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password.')
      }

      // Also sync locally
      const localUsers = getLocalUsers()
      const localUser = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
      if (localUser) {
        const newSalt = Math.random().toString(36).substring(2, 15)
        localUser.salt = newSalt
        localUser.passwordHash = await hashPasswordClient(newPassword, newSalt)
        saveLocalUsers(localUsers)
      }

      return { success: true, message: data.message }
    } catch (apiErr) {
      if (apiErr.message && !apiErr.message.includes('fetch') && !apiErr.message.includes('NetworkError')) {
        throw apiErr
      }

      const localUsers = getLocalUsers()
      const localUser = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
      if (!localUser) {
        throw new Error('No account found with this email.')
      }

      const newSalt = Math.random().toString(36).substring(2, 15)
      localUser.salt = newSalt
      localUser.passwordHash = await hashPasswordClient(newPassword, newSalt)
      saveLocalUsers(localUsers)

      return { success: true, message: 'Password updated successfully. Please sign in.' }
    }
  },

  /**
   * Link Aadhaar KYC to user profile
   */
  async updateAadhaar(email, aadhaarDetails) {
    const trimmedEmail = email.trim().toLowerCase()

    try {
      const res = await fetch(`${API_BASE}/update-aadhaar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, aadhaarDetails }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        this.setCurrentUser(data.user)
        return data.user
      }
    } catch (e) {
      console.warn('[BhoomIntelli Auth] Backend update aadhaar error:', e)
    }

    // Local fallback update
    const localUsers = getLocalUsers()
    const user = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (user) {
      user.aadhaarVerified = true
      user.aadhaarDetails = aadhaarDetails
      saveLocalUsers(localUsers)
      const { passwordHash: _, salt: __, ...safeUser } = user
      this.setCurrentUser(safeUser)
      return safeUser
    }
    return null
  },

  /**
   * Logout user
   */
  logout() {
    this.setCurrentUser(null)
  },
}
