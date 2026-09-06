import { useState } from 'react'

export default function ProfileTab({ profileData, onProfileSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...profileData })

  const handleSave = () => {
    onProfileSave({
      name: editForm.name,
      age: editForm.age,
      gender: editForm.gender,
      address: editForm.address,
      dob: editForm.dob,
      // email & contact remain locked - only changed via Settings OTP
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({ ...profileData })
    setIsEditing(false)
  }

  return (
    <div>
      {/* Avatar + Name + Edit Button */}
      <div className="profile-card-header">
        <div className="profile-avatar-row">
          <div className="profile-large-avatar">
            {(profileData.name?.[0] || 'R').toUpperCase()}
          </div>
          <div>
            <h3 className="profile-name-text">{profileData.name}</h3>
            <span className="profile-verified-tag">✓ Aadhaar Verified Landholder</span>
          </div>
        </div>

        {!isEditing ? (
          <button
            className="btn-edit-profile"
            onClick={() => {
              setEditForm({ ...profileData })
              setIsEditing(true)
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

      {/* Profile Fields Grid */}
      <div className="profile-fields-grid">

        {/* Name */}
        <div className="profile-field-box">
          <div className="profile-field-label">Name</div>
          {isEditing ? (
            <input
              type="text"
              className="profile-input"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          ) : (
            <div className="profile-field-val">{profileData.name}</div>
          )}
        </div>

        {/* Age */}
        <div className="profile-field-box">
          <div className="profile-field-label">Age</div>
          {isEditing ? (
            <input
              type="number"
              className="profile-input"
              value={editForm.age}
              onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
            />
          ) : (
            <div className="profile-field-val">{profileData.age} Years</div>
          )}
        </div>

        {/* Gender */}
        <div className="profile-field-box">
          <div className="profile-field-label">Gender</div>
          {isEditing ? (
            <select
              className="profile-input"
              value={editForm.gender}
              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <div className="profile-field-val">{profileData.gender}</div>
          )}
        </div>

        {/* Date of Birth */}
        <div className="profile-field-box">
          <div className="profile-field-label">Date of Birth (DOB)</div>
          {isEditing ? (
            <input
              type="date"
              className="profile-input"
              value={editForm.dob}
              onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
            />
          ) : (
            <div className="profile-field-val">{profileData.dob}</div>
          )}
        </div>

        {/* Address - Full Width */}
        <div className="profile-field-box profile-field-full">
          <div className="profile-field-label">Address</div>
          {isEditing ? (
            <input
              type="text"
              className="profile-input"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
          ) : (
            <div className="profile-field-val">{profileData.address}</div>
          )}
        </div>

        {/* Contact - Locked (only via Settings OTP) */}
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

        {/* Email - Locked (only via Settings OTP) */}
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
        {isEditing && (
          <div className="profile-edit-actions">
            <button className="btn-how-it-works-downward" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-upload-primary" onClick={handleSave}>
              Save Profile Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
