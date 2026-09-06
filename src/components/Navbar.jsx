// Navbar: Top header bar
// Left  → Logo + ☰ hamburger (opens MenuDrawer)
// Right → Notification bell, User avatar pill, Login/Sign Out button
export default function Navbar({ user, unreadCount, onOpenDrawer, onOpenNotifications, onOpenProfile, onOpenLogin, onLogout }) {
  return (
    <header className="bhoomi-navbar">

      {/* Logo + hamburger — clicking opens the full MenuDrawer */}
      <div
        className="bhoomi-logo-trigger"
        onClick={onOpenDrawer}
        title="Click to open Profile, Notifications, Settings, Help & About"
      >
        <div className="bhoomi-hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bhoomi-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <polyline points="9 15 11 17 15 13"></polyline>
          </svg>
        </div>
        <span className="bhoomi-logo-text">BhoomiSetu</span>
      </div>

      {/* Right side controls */}
      <div className="bhoomi-nav-right">

        {/* Notification bell — opens drawer directly on Notifications tab */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px' }}
          onClick={onOpenNotifications}
          title="View Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
              }}
            />
          )}
        </button>

        {/* Auth state: logged in → avatar pill + Sign Out; logged out → Login button */}
        {user ? (
          <>
            <div
              className="bhoomi-user-pill"
              onClick={onOpenProfile}
              style={{ cursor: 'pointer' }}
              title="Click to view Profile"
            >
              <div className="bhoomi-user-avatar">
                {(user.name?.[0] || 'U').toUpperCase()}
              </div>
              <span>{user.name.split(' ')[0]}</span>
            </div>
            <button className="bhoomi-login-btn" onClick={onLogout} title="Sign out of account">
              Sign Out
            </button>
          </>
        ) : (
          <button
            className="bhoomi-login-btn"
            onClick={() => onOpenLogin && onOpenLogin('signin')}
            title="Sign in to your account"
          >
            Login
          </button>
        )}

      </div>
    </header>
  )
}
