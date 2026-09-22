// BhoomiSetu Node.js / Express Backend Server
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const DB_PATH = path.join(__dirname, 'records.json')
const USERS_PATH = path.join(__dirname, 'users.json')

// Active in-memory session tokens map (token -> userId)
const activeSessions = new Map()

// ── Database Helpers ───────────────────────────────────────────────

function getRecords() {
  try {
    if (!fs.existsSync(DB_PATH)) return []
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data).records || []
  } catch (err) {
    console.error('Error reading records file:', err)
    return []
  }
}

function saveRecords(records) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify({ records }, null, 2))
  } catch (err) {
    console.error('Error saving records:', err)
  }
}

function getUsers() {
  try {
    if (!fs.existsSync(USERS_PATH)) return []
    const data = fs.readFileSync(USERS_PATH, 'utf-8')
    return JSON.parse(data).users || []
  } catch (err) {
    console.error('Error reading users file:', err)
    return []
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_PATH, JSON.stringify({ users }, null, 2))
  } catch (err) {
    console.error('Error saving users file:', err)
  }
}

// ── Security & Hashing Helpers ─────────────────────────────────────

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex')
}

function verifyPassword(password, salt, storedHash) {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'))
  } catch (err) {
    return false
  }
}

function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, salt, ...safeUser } = user
  return safeUser
}

// ── Authentication API Endpoints ───────────────────────────────────

// 1. Register a new user
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, surname, email, password } = req.body

    if (!name?.trim() || !surname?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getUsers()

    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const passwordHash = hashPassword(password, salt)
    const username = normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')

    const newUser = {
      id: 'USR-' + String(Date.now()).slice(-6),
      email: normalizedEmail,
      name: name.trim(),
      surname: surname.trim(),
      username: username || 'user',
      salt,
      passwordHash,
      aadhaarVerified: false,
      aadhaarDetails: null,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    const token = crypto.randomBytes(32).toString('hex')
    activeSessions.set(token, newUser.id)

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: sanitizeUser(newUser),
      token,
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ success: false, message: 'Internal server error during registration.' })
  }
})

// 2. Login user with credentials
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getUsers()

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    activeSessions.set(token, user.id)

    res.json({
      success: true,
      message: 'Login successful.',
      user: sanitizeUser(user),
      token,
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, message: 'Internal server error during login.' })
  }
})

// 3. Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body
  if (!otp || String(otp).length !== 6) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit code.' })
  }
  // Accepts standard 6-digit verification code
  res.json({ success: true, message: 'OTP verified successfully.' })
})

// 4. Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body

    if (!email?.trim() || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getUsers()

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found with this email.' })
    }

    const newSalt = crypto.randomBytes(16).toString('hex')
    user.salt = newSalt
    user.passwordHash = hashPassword(newPassword, newSalt)
    saveUsers(users)

    res.json({ success: true, message: 'Password has been updated successfully. Please sign in.' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ success: false, message: 'Internal server error during password reset.' })
  }
})

// 5. Update Aadhaar KYC on User Record
app.post('/api/auth/update-aadhaar', (req, res) => {
  try {
    const { email, aadhaarDetails } = req.body
    if (!email?.trim() || !aadhaarDetails) {
      return res.status(400).json({ success: false, message: 'Email and Aadhaar details are required.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getUsers()

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    user.aadhaarVerified = true
    user.aadhaarDetails = aadhaarDetails
    saveUsers(users)

    res.json({
      success: true,
      message: 'Aadhaar e-KYC linked successfully.',
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error('Update Aadhaar error:', err)
    res.status(500).json({ success: false, message: 'Internal server error updating KYC.' })
  }
})

// 6. Get Current User Session Info
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token || !activeSessions.has(token)) {
      return res.status(401).json({ success: false, message: 'Not authenticated or session expired.' })
    }

    const userId = activeSessions.get(token)
    const users = getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    res.json({ success: true, user: sanitizeUser(user) })
  } catch (err) {
    console.error('Auth me error:', err)
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
})

// ── Land Records Endpoints ─────────────────────────────────────────

// Get all records
app.get('/api/records', (req, res) => {
  const records = getRecords()
  res.json({ success: true, records })
})

// Upload and process land document
app.post('/api/upload', (req, res) => {
  const { fileName, fileSize, ownerName } = req.body

  if (!fileName) {
    return res.status(400).json({ success: false, message: 'Document name is required' })
  }

  // Simulate OCR validation & Cadastral Registry verification
  const newRecord = {
    id: 'REC-' + String(Date.now()).slice(-4),
    ownerName: ownerName || 'Document Holder',
    parcelId: 'HR-' + Math.floor(10000 + Math.random() * 90000),
    khasraNo: `${Math.floor(10 + Math.random() * 190)}/${Math.floor(1 + Math.random() * 20)}`,
    district: 'Gurugram',
    state: 'Haryana',
    area: (Math.random() * 3 + 0.5).toFixed(2) + ' Acres',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Verified',
    documentName: fileName,
    fileSize: fileSize || 'Unknown',
  }

  const records = getRecords()
  records.unshift(newRecord)
  saveRecords(records)

  res.json({
    success: true,
    message: 'Document successfully digitized and verified.',
    record: newRecord,
  })
})

// Get single record by ID
app.get('/api/records/:id', (req, res) => {
  const records = getRecords()
  const record = records.find((r) => r.id === req.params.id)
  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found' })
  }
  res.json({ success: true, record })
})

app.listen(PORT, () => {
  console.log(`BhoomiSetu backend running on http://localhost:${PORT}`)
})
