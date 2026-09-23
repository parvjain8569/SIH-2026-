import { supabase, isSupabaseConfigured } from './supabase.js'

function getApiBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  return 'http://localhost:3001'
}

/**
 * Generate cryptographic random hex salt
 */
function generateSalt(length = 16) {
  const bytes = new Uint8Array(length)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Compute SHA-256 hash of text with salt using Web Crypto API
 */
export async function computeSha256(text, salt) {
  const enc = new TextEncoder()
  const data = enc.encode(text + salt)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const LOCAL_USERS_KEY = 'bhoomintelli_citizen_users'
const ACTIVE_USER_KEY = 'bhoomintelli_active_user'

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return [
    {
      id: 'USR-10001',
      name: 'Dev User',
      email: 'dev@bhoomintelli.in',
      salt: '5ff15af9b08bf45ff5ab069f1717dec9',
      passwordHash: '816acdbc55f568e33fff13e3845724591eda4450bae5d619a6d3550b44448b9f',
      phone: '+91 98765 43210',
      isPhoneVerified: true,
      gender: 'Male',
      dob: '15/06/1995',
      address: 'Village Khandsa, Gurugram',
      district: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      aadhaarVerified: true,
      aadhaarNumber: 'XXXX XXXX 1234',
      status: 'Active',
      role: 'Citizen',
    }
  ]
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
  } catch {}
}

/**
 * Citizen Registration with Hashed Password
 */
export async function citizenSignUp({ name, email, password, phone, aadhaarNumber, aadhaarVerified, district, state }) {
  const normalizedEmail = (email || '').trim().toLowerCase()
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.')
  }

  // 1. Try Backend API first
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/citizen/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: normalizedEmail,
        password,
        phone,
        aadhaarNumber,
        aadhaarVerified,
        district,
        state
      })
    })

    if (res.ok) {
      const data = await res.json()
      if (data.user) {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(data.user))
        return data.user
      }
    } else {
      const errData = await res.json().catch(() => ({}))
      if (res.status === 409) {
        throw new Error(errData.detail || 'An account with this email already exists.')
      }
    }
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      throw err
    }
    console.warn('[AuthService] Backend unreachable, falling back to local secure storage:', err)
  }

  // 2. Offline / Local Fallback with Web Crypto SHA-256 Hashing
  const users = getLocalUsers()
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const salt = generateSalt(16)
  const passwordHash = await computeSha256(password, salt)
  const newUser = {
    id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
    name: name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    salt,
    passwordHash,
    phone: phone || '',
    isPhoneVerified: Boolean(phone),
    district: district || 'Gurugram',
    state: state || 'Haryana',
    aadhaarVerified: Boolean(aadhaarVerified),
    aadhaarNumber: aadhaarNumber ? `XXXX XXXX ${aadhaarNumber.slice(-4)}` : null,
    status: 'Active',
    role: 'Citizen',
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveLocalUsers(users)

  const safeUser = { ...newUser }
  delete safeUser.salt
  delete safeUser.passwordHash
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser))
  return safeUser
}

/**
 * Citizen Sign In with Hash Verification
 */
export async function citizenSignIn({ email, password }) {
  const normalizedEmail = (email || '').trim().toLowerCase()
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.')
  }

  // 1. Try Backend API
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/citizen/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password })
    })

    if (res.ok) {
      const data = await res.json()
      if (data.user) {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(data.user))
        return data.user
      }
    } else if (res.status === 401) {
      throw new Error('Invalid email or password.')
    }
  } catch (err) {
    if (err.message === 'Invalid email or password.') {
      throw err
    }
    console.warn('[AuthService] Backend login unreachable, checking local credentials:', err)
  }

  // 2. Offline / Local Fallback
  const users = getLocalUsers()
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail)
  if (!found) {
    throw new Error('Invalid email or password.')
  }

  const computedHash = await computeSha256(password, found.salt)
  if (computedHash !== found.passwordHash) {
    throw new Error('Invalid email or password.')
  }

  const safeUser = { ...found }
  delete safeUser.salt
  delete safeUser.passwordHash
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser))
  return safeUser
}

/**
 * Get currently logged-in citizen
 */
export function getCurrentCitizen() {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

/**
 * Sign out citizen
 */
export function citizenSignOut() {
  localStorage.removeItem(ACTIVE_USER_KEY)
}

/**
 * Update citizen profile
 */
export async function updateCitizenProfile(updates) {
  const current = getCurrentCitizen()
  if (!current) return null

  const merged = { ...current, ...updates }
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(merged))

  try {
    const baseUrl = getApiBaseUrl()
    await fetch(`${baseUrl}/api/auth/citizen/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged)
    })
  } catch {}

  return merged
}
