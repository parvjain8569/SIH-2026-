// AboutUsTab: Project overview, core tech pillars, and dynamic changelog
// ⚠️  Always update VERSION and CHANGELOG when new features are added
const VERSION = 'v2.4.0'
const RELEASE_DATE = 'SIH 2026 Edition'

const TECH_PILLARS = [
  {
    icon: '🧠',
    title: 'Multilingual OCR',
    desc: 'Parses regional Khasra, Khatauni, and Jamabandi scripts with high accuracy.',
  },
  {
    icon: '🗺️',
    title: 'Cadastral GIS Alignment',
    desc: 'Instantly maps extracted polygon coordinates directly onto village survey plans.',
  },
  {
    icon: '🔒',
    title: 'Cryptographic Seal',
    desc: 'Digital certificate timestamping prevents duplicate registry tampering.',
  },
  {
    icon: '⚡',
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
    desc: 'Full registry ledger matching BhoomiSetu portal specifications with instant certificate viewer.',
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
        <h3 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>
          BhoomiSetu: Intelligent Land Record Digitization & Validation System
        </h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
          BhoomiSetu is a national-scale digital infrastructure platform designed to bridge
          traditional paper land registries with modern, tamper-proof digital property
          ecosystems through AI OCR extraction, GIS spatial boundary alignment, and
          blockchain cryptographic auditing.
        </p>
      </div>

      {/* Core Tech Pillars */}
      <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>
        Core Technology Pillars
      </h4>
      <div className="about-features-grid">
        {TECH_PILLARS.map((p) => (
          <div key={p.title} className="about-feature-card">
            <strong style={{ display: 'block', fontSize: '14.5px', marginBottom: '4px' }}>
              {p.icon} {p.title}
            </strong>
            <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              {p.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Changelog — update CHANGELOG array above when features are added */}
      <div className="changelog-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <strong style={{ fontSize: '15px', color: '#0f172a' }}>
            🚀 Project Release History & Updates
          </strong>
          <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            Current Release: {VERSION}
          </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13.5px', color: '#4b5563', lineHeight: '1.8' }}>
          {CHANGELOG.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong> {item.desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
