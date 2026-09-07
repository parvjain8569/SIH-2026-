import ProfileTab from './ProfileTab'
import NotificationsTab from './NotificationsTab'
import SettingsTab from './SettingsTab'
import HelpCenterTab from './HelpCenterTab'
import AboutUsTab from './AboutUsTab'

// Clean professional tab definitions with SVG icons (no emojis)
const AUTH_TABS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    id: 'notification',
    label: 'Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    )
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  {
    id: 'about',
    label: 'About',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  },
]

// Tabs available for guests
const GUEST_TABS = [
  {
    id: 'help',
    label: 'Help Center',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  {
    id: 'about',
    label: 'About BhoomIntelli',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  },
]

export default function MenuDrawer({
  user,
  activeTab,
  onTabChange,
  onClose,
  profileData,
  onProfileSave,
  onProfileUpdate,
  notifications,
  onMarkAllRead,
  unreadCount,
  verificationAlert = false
}) {
  const isGuest = !user
  const visibleTabs = isGuest ? GUEST_TABS : AUTH_TABS

  // Header Title based on active tab
  const getDrawerTitle = () => {
    if (activeTab === 'help') return 'Help Center & Support'
    if (activeTab === 'about') return 'About BhoomIntelli'
    if (activeTab === 'profile') return 'Landholder Profile'
    if (activeTab === 'notification') return 'Notifications'
    if (activeTab === 'settings') return 'Settings'
    return isGuest ? 'About BhoomIntelli' : 'BhoomIntelli Workspace'
  }

  return (
    <div className="bhoomi-drawer-overlay" onClick={onClose}>
      <div className="bhoomi-drawer" onClick={(e) => e.stopPropagation()}>

        {/* Top Bar */}
        <div className="bhoomi-drawer-top">
          <div className="bhoomi-drawer-brand">
            <img
              src="/bhoomintelli-icon.png"
              alt="BhoomIntelli Icon"
              className="bhoomi-drawer-icon"
            />
            <img
              src="/bhoomintelli-wordmark.png"
              alt="BhoomIntelli"
              className="bhoomi-drawer-wordmark"
            />
            <span className="bhoomi-drawer-divider">|</span>
            <h2 className="bhoomi-drawer-title">{getDrawerTitle()}</h2>
          </div>
          <button className="bhoomi-drawer-close" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bhoomi-drawer-tabs">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`bhoomi-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon-wrap">{tab.icon}</span>
              <span className="tab-label-text">{tab.label}</span>
              {tab.id === 'notification' && unreadCount > 0 && (
                <span className="bhoomi-tab-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bhoomi-drawer-body">
          {/* If guest or user, correctly render the selected tab */}
          {activeTab === 'help' && <HelpCenterTab />}
          {activeTab === 'about' && <AboutUsTab />}

          {/* Authenticated-only tabs */}
          {!isGuest && activeTab === 'profile' && (
            <ProfileTab
              profileData={profileData}
              onProfileSave={onProfileSave}
              verificationAlert={verificationAlert}
            />
          )}
          {!isGuest && activeTab === 'notification' && (
            <NotificationsTab
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
            />
          )}
          {!isGuest && activeTab === 'settings' && (
            <SettingsTab
              profileData={profileData}
              onProfileUpdate={onProfileUpdate}
            />
          )}
        </div>

      </div>
    </div>
  )
}
