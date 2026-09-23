import { useState, useEffect } from 'react'
import { fetchAllCitizenUsers } from '../lib/adminAuthService.js'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchAllCitizenUsers()
        setUsers(data || [])
      } catch (err) {
        console.error('Failed to load citizen users:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.district || '').toLowerCase().includes(search.toLowerCase())
  )

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Super Admin':
      case 'Admin': return 'admin-role'
      case 'Reviewer':
      case 'Revenue Inspector': return 'reviewer-role'
      default: return 'user-role'
    }
  }

  return (
    <div className="admin-section-card">
      {/* Toolbar */}
      <div className="admin-table-toolbar">
        <div className="admin-search-wrap">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search citizens by name, email, or district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="admin-table-count">{filtered.length} registered citizen{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Citizen Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District / State</th>
              <th>Aadhaar KYC</th>
              <th>Role</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="admin-table-empty">
                  Loading citizen directory from database…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-table-empty">
                  No citizen users found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id || u.email}>
                  <td>
                    <strong>{u.name}</strong>
                    {u.id && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{u.id}</div>}
                  </td>
                  <td style={{ color: '#64748b' }}>{u.email}</td>
                  <td style={{ color: '#64748b' }}>{u.phone || '—'}</td>
                  <td>{u.district ? `${u.district}, ${u.state || 'Haryana'}` : '—'}</td>
                  <td>
                    {u.aadhaarVerified ? (
                      <span style={{ fontSize: '11.5px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        ✓ {u.aadhaarNumber || 'Verified'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge ${getRoleBadgeClass(u.role)}`}>
                      {u.role || 'Citizen'}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'Recent'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
