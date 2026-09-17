import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो' },
];

export default function LanguageSelectModal({ onClose, forceShow }) {
  const { currentLang, setLanguage, t } = useLanguage();

  // If we already have a language and aren't forcing the modal open, hide it
  if (currentLang && !forceShow) return null;

  return (
    <div className="bhoomi-modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="bhoomi-modal" 
        style={{ 
          maxWidth: '800px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#ecfdf5', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#16a34a'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            {t('langSelect.title')} / Select Your Language
          </h2>
          <p style={{ color: '#64748b' }}>
            {t('langSelect.subtitle')} / Choose your preferred language to continue.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                if (onClose) onClose();
              }}
              style={{
                padding: '16px 12px',
                borderRadius: '12px',
                border: currentLang === lang.code ? '2px solid #16a34a' : '1px solid #e2e8f0',
                backgroundColor: currentLang === lang.code ? '#ecfdf5' : 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (currentLang !== lang.code) {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLang !== lang.code) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
                {lang.native}
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {lang.name}
              </span>
            </button>
          ))}
        </div>

        {forceShow && (
          <div style={{ textAlign: 'center' }}>
            <button 
              className="btn-upload-primary" 
              onClick={onClose}
              style={{ padding: '12px 32px' }}
            >
              {t('langSelect.save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
