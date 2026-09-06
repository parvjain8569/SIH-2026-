import ProfileTab from './ProfileTab'
import NotificationsTab from './NotificationsTab'
import SettingsTab from './SettingsTab'
import HelpCenterTab from './HelpCenterTab'
import AboutUsTab from './AboutUsTab'

const TABS = [
  { id: 'profile', label: '👤 Profile' },
  { id: 'notification', label: '🔔 Notification' },
  { id: 'settings', label: '⚙️ Setting' },
  { id: 'help', label: '❓ Help Center' },
  { id: 'about', label: 'ℹ️ About Us' },
]

export default function MenuDrawer({
  activeTab,
  onTabChange,
  onClose,
  profileData,
  onProfileSave,
  onProfileUpdate,
  notifications,
  onMarkAllRead,
  unreadCount,
}) {
  return (
    <div className="bhoomi-drawer-overlay" onClick={onClose}>
      <div className="bhoomi-drawer" onClick={(e) => e.stopPropagation()}>

        {/* Top Bar */}
        <div className="bhoomi-drawer-top">
          <div className="bhoomi-drawer-brand">
            <div className="bhoomi-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <polyline points="9 15 11 17 15 13"></polyline>
              </svg>
            </div>
            <h2 className="bhoomi-drawer-title">BhoomiSetu Workspace</h2>
          </div>
          <button className="bhoomi-drawer-close" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bhoomi-drawer-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`bhoomi-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
              {tab.id === 'notification' && unreadCount > 0 && (
                <span className="bhoomi-tab-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bhoomi-drawer-body">
          {activeTab === 'profile' && (
            <ProfileTab profileData={profileData} onProfileSave={onProfileSave} />
          )}
          {activeTab === 'notification' && (
            <NotificationsTab notifications={notifications} onMarkAllRead={onMarkAllRead} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab profileData={profileData} onProfileUpdate={onProfileUpdate} />
          )}
          {activeTab === 'help' && <HelpCenterTab />}
          {activeTab === 'about' && <AboutUsTab />}
        </div>

      </div>
    </div>
  )
}
