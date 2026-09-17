import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// Navbar: Header bar with BhoomIntelli sprout branding, middle nav links & auth controls
export default function Navbar({
  user,
  unreadCount,
  onOpenDrawer: _onOpenDrawer,
  onOpenNotifications,
  onOpenProfile,
  onOpenAbout,
  onOpenSupport,
  onOpenLogin,
  onLogout,
  onScrollToSection,
  onOpenLanguage
}) {
  const { t } = useLanguage()

  return (
    <header className="bhoomi-navbar">
      <div className="bhoomi-navbar-inner">

        {/* ── Brand Logo & Name (Official Project Logo) ── */}
        <div
          className="bhoomi-logo-trigger"
          onClick={() => onScrollToSection && onScrollToSection('top')}
          title="BhoomIntelli Home"
        >
          <img
            src="/bhoomintelli-icon.png"
            alt="BhoomIntelli Icon"
            className="bhoomi-brand-icon"
          />
          <img
            src="/bhoomintelli-wordmark.png"
            alt="BhoomIntelli"
            className="bhoomi-brand-wordmark"
          />
        </div>

        {/* ── Middle Navigation Links (from screenshot) ── */}
        <nav className="bhoomi-nav-center" aria-label="Main Navigation">
          <button
            className="bhoomi-nav-link active"
            onClick={() => onScrollToSection && onScrollToSection('top')}
          >
            {t('nav.home')}
          </button>
          <button
            className="bhoomi-nav-link"
            onClick={() => onScrollToSection && onScrollToSection('about')}
          >
            {t('nav.about')}
          </button>
          <button
            className="bhoomi-nav-link"
            onClick={() => onScrollToSection && onScrollToSection('features')}
          >
            {t('nav.features')}
          </button>
          <button
            className="bhoomi-nav-link"
            onClick={() => onScrollToSection && onScrollToSection('three-steps')}
          >
            {t('nav.howItWorks')}
          </button>
          <button
            className="bhoomi-nav-link"
            onClick={onOpenSupport}
          >
            {t('nav.support')}
          </button>
        </nav>

        {/* ── Right side controls ── */}
        <div className="bhoomi-nav-right">

          <button
            className="bhoomi-nav-icon-btn"
            onClick={onOpenLanguage}
            title="Change Language"
            aria-label="Change Language"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>

          {/* Notification bell (or About info if guest) */}
          {user ? (
            <button
              className="bhoomi-nav-icon-btn"
              onClick={onOpenNotifications}
              title="View Notifications"
              aria-label="View Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && <span className="bhoomi-bell-dot" />}
            </button>
          ) : (
            <button
              className="bhoomi-nav-icon-btn"
              onClick={onOpenAbout}
              title="About BhoomIntelli"
              aria-label="About Us"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          )}

          {/* Auth state: Logged In -> User Pill + Sign Out; Logged Out -> Login Button */}
          {user ? (
            <div className="bhoomi-auth-group">
              <div
                className="bhoomi-user-pill"
                onClick={onOpenProfile}
                title={`Logged in as ${user.username || user.name} - View Profile`}
              >
                <div className="bhoomi-user-avatar">
                  {((user.username || user.name)?.[0] || 'U').toUpperCase()}
                </div>
                <span className="bhoomi-user-name">{user.username || user.name}</span>
              </div>
              <button
                className="bhoomi-logout-btn"
                onClick={onLogout}
                title="Sign out of account"
              >
                {t('nav.signOut')}
              </button>
            </div>
          ) : (
            <button
              className="bhoomi-login-btn"
              onClick={() => onOpenLogin && onOpenLogin('signin')}
              title="Sign in to your BhoomIntelli workspace"
            >
              {t('nav.login')}
            </button>
          )}

        </div>

      </div>
    </header>
  )
}
