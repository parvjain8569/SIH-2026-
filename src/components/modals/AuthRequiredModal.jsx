export default function AuthRequiredModal({ onClose, onProceedToLogin }) {
  return (
    <div className="bhoomi-modal-overlay" onClick={onClose}>
      <div
        className="bhoomi-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', textAlign: 'center' }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            color: '#166534',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
          }}
        >
          🔒
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          Sign In Required
        </h3>
        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          To upload, digitize, and verify your land records, please sign in or create an account first.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-upload-primary"
            style={{ justifyContent: 'center', width: '100%' }}
            onClick={onProceedToLogin}
          >
            Create Account / Sign In →
          </button>
          <button
            className="btn-how-it-works-downward"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
