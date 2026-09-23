function getApiBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  return 'http://localhost:3001'
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

const LOCAL_ADMINS_KEY = 'bhoomintelli_admin_users'
const ACTIVE_ADMIN_KEY = 'adminUser'

const DEFAULT_ADMINS = [
  {
    id: 'ADM-001',
    name: 'Super Admin',
    email: 'admin@bhoomintelli.in',
    salt: '8e1ef4b35d7296191c016a95c950f872',
    passwordHash: '583692550228ef46408998ca2bcd3c655b12814e4c92ed6938dd1aba2e7674b0',
    role: 'Super Admin',
    department: 'Land Records Division',
    district: 'New Delhi',
    state: 'Delhi',
    phone: '+91 98765 43210',
    status: 'Active',
  },
  {
    id: 'ADM-002',
    name: 'Sanjay Verma',
    email: 'inspector@bhoomintelli.in',
    salt: '8ff774253a809ebdb5fefc2708c917a8',
    passwordHash: '220e2c4b4fcc18fddeb3b1d3460981dca0fbf616a6a4ef799fb97793c950470d',
    role: 'Revenue Inspector',
    department: 'Tehsil Cadastral Audit',
    district: 'Gurugram',
    state: 'Haryana',
    phone: '+91 98123 45678',
    status: 'Active',
  },
  {
    id: 'ADM-003',
    name: 'Anil Tehsildar',
    email: 'tehsildar@bhoomintelli.in',
    salt: '2dc4ab934ffffe8962707c22ab57ecd3',
    passwordHash: '58ccb0bd5865d29fb0ce598047c0bd63f4308ee87f57bd9dba37e34761af9f22',
    role: 'Tehsildar',
    department: 'Tehsil Revenue Registry',
    district: 'Gurugram',
    state: 'Haryana',
    phone: '+91 98987 65432',
    status: 'Active',
  }
]

function getLocalAdmins() {
  try {
    const raw = localStorage.getItem(LOCAL_ADMINS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_ADMINS
}

/**
 * Administrative Sign In with SHA-256 Hash Verification
 */
export async function adminSignIn({ email, password }) {
  const normalizedEmail = (email || '').trim().toLowerCase()
  if (!normalizedEmail || !password) {
    throw new Error('Please enter both administrative email and password.')
  }

  // 1. Try Backend API
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password: password.trim() })
    })

    if (res.ok) {
      const data = await res.json()
      if (data.user) {
        localStorage.setItem(ACTIVE_ADMIN_KEY, JSON.stringify(data.user))
        return data.user
      }
    } else if (res.status === 401) {
      throw new Error('Invalid administrative credentials.')
    }
  } catch (err) {
    if (err.message === 'Invalid administrative credentials.') {
      throw err
    }
    console.warn('[AdminAuth] Backend unreachable, checking local encrypted admin store:', err)
  }

  // 2. Offline / Local Fallback with SHA-256 Hash Verification
  const admins = getLocalAdmins()
  const found = admins.find(a => a.email.toLowerCase() === normalizedEmail)
  if (!found) {
    throw new Error('Invalid administrative credentials.')
  }

  const computedHash = await computeSha256(password.trim(), found.salt)
  if (computedHash !== found.passwordHash) {
    throw new Error('Invalid administrative credentials.')
  }

  const safeAdmin = { ...found }
  delete safeAdmin.salt
  delete safeAdmin.passwordHash
  localStorage.setItem(ACTIVE_ADMIN_KEY, JSON.stringify(safeAdmin))
  return safeAdmin
}

export function getCurrentAdmin() {
  try {
    const raw = localStorage.getItem(ACTIVE_ADMIN_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function adminSignOut() {
  localStorage.removeItem(ACTIVE_ADMIN_KEY)
}

/**
 * Fetch all registered citizens from the Citizen DB for the Admin User Directory
 */
export async function fetchAllCitizenUsers() {
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/citizen/users`)
    if (res.ok) {
      return await res.json()
    }
  } catch (e) {
    console.warn('[AdminAuth] Could not fetch citizens from backend:', e)
  }
  
  // Fallback to local citizen database store if backend is offline
  try {
    const raw = localStorage.getItem('bhoomintelli_citizen_users')
    if (raw) {
      const users = JSON.parse(raw)
      return users.map(u => {
        const safe = { ...u }
        delete safe.salt
        delete safe.passwordHash
        return safe
      })
    }
  } catch {}

  return [
    { id: 'USR-10001', name: 'Dev User', email: 'dev@bhoomintelli.in', phone: '+91 98765 43210', district: 'Gurugram', state: 'Haryana', role: 'Citizen', status: 'Active', createdAt: '2026-01-15' },
    { id: 'USR-10002', name: 'Ramesh Kumar', email: 'ramesh.kumar@gov.in', phone: '+91 98112 34567', district: 'Gurugram', state: 'Haryana', role: 'Citizen', status: 'Active', createdAt: '2026-02-10' },
    { id: 'USR-10003', name: 'Sunita Devi', email: 'sunita.devi@gov.in', phone: '+91 97234 56789', district: 'Karnal', state: 'Haryana', role: 'Citizen', status: 'Active', createdAt: '2026-03-05' },
  ]
}
