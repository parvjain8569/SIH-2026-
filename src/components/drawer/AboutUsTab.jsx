// AboutUsTab: Project overview, core tech pillars, and dynamic changelog
// ⚠️  Always update VERSION and CHANGELOG when new features are added
const VERSION = 'v2.4.0'
const RELEASE_DATE = 'SIH 2026 Edition'

const TECH_PILLARS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    iconBg: '#ecfdf5',
    title: 'Multilingual OCR',
    desc: 'Parses regional Khasra, Khatauni, and Jamabandi scripts with high accuracy.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    iconBg: '#eff6ff',
    title: 'Cadastral GIS Alignment',
    desc: 'Instantly maps extracted polygon coordinates directly onto village survey plans.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    iconBg: '#ecfdf5',
    title: 'Cryptographic Seal',
    desc: 'Digital certificate timestamping prevents duplicate registry tampering.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
        <path d="M9 10h6" />
      </svg>
    ),
    iconBg: '#fffbeb',
    title: 'Two-Factor OTP Security',
    desc: 'Protects landholder identity with multi-channel authentication.',
  },
]

const CHANGELOG = [
  {
    title: 'Modular Component Architecture:',
    desc: 'Codebase split into focused, single-responsibility components for maintainability.',
  },
  {
    title: 'Logo Drawer System:',
    desc: 'Integrated quick-access drawer for Profile, Notifications, Settings, Help Center, and About Us.',
  },
  {
    title: 'Secure Profile & OTP Engine:',
    desc: 'Lock protection on critical identifiers with interactive 6-digit OTP verification.',
  },
  {
    title: 'Real Folder Document Ingestion:',
    desc: 'Native file dialog integration with live file name badge & instant digitization.',
  },
  {
    title: 'My Records Portal:',
    desc: 'Full registry ledger matching BhoomIntelli portal specifications with instant certificate viewer.',
  },
  {
    title: 'Responsive UI Architecture:',
    desc: 'Clean contrast styling optimized for government portal accessibility standards.',
  },
]

export default function AboutUsTab() {
  return (
    <div>
      {/* Hero Box */}
      <div className="about-hero-box">
        <span className="about-version-tag">{VERSION} · {RELEASE_DATE}</span>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 800 }}>
          BhoomIntelli: Intelligent Land Record Digitization &amp; Validation System
        </h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
          BhoomIntelli is a national-scale digital infrastructure platform designed to bridge
          traditional paper land registries with modern, tamper-proof digital property
          ecosystems through AI OCR extraction, GIS spatial boundary alignment, and
          blockchain cryptographic auditing.
        </p>
      </div>

      {/* Core Tech Pillars */}
      <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
        Core Technology Pillars
      </h4>
      <div className="about-features-grid">
        {TECH_PILLARS.map((p) => (
          <div key={p.title} className="about-feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: p.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </div>
              <strong style={{ fontSize: '14.5px', color: '#0f172a' }}>{p.title}</strong>
            </div>
            <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', display: 'block', paddingLeft: '40px' }}>
              {p.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Changelog — update CHANGELOG array above when features are added */}
      <div className="changelog-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#ecfdf5',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <strong style={{ fontSize: '15px', color: '#0f172a' }}>
              Project Release History &amp; Updates
            </strong>
          </div>
          <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
            Current Release: {VERSION}
          </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13.5px', color: '#4b5563', lineHeight: '1.8' }}>
          {CHANGELOG.map((item) => (
            <li key={item.title}>
              <strong style={{ color: '#1e293b' }}>{item.title}</strong> {item.desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
