// HeroSection: Main landing area
// Contains hero title, subtitle, uploaded doc banner,
// Upload button, "How It Works" secondary button, and bouncing scroll-down arrow
export default function HeroSection({ lastUploadedDoc, onUpload, onScrollToSteps, onViewRecords }) {
  return (
    <section className="bhoomi-hero">
      <h1 className="bhoomi-hero-title">
        Turn Your Land Documents Into
        <br />
        Verified Digital Records
      </h1>

      <p className="bhoomi-hero-subtitle">
        Upload your land document and let BhoomiSetu extract, validate and
        organize the information for you.
      </p>

      {/* Uploaded document banner — shows after a file has been picked */}
      {lastUploadedDoc && (
        <div className="bhoomi-uploaded-banner">
          <div className="bhoomi-uploaded-info">
            <div className="bhoomi-uploaded-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <polyline points="9 15 11 17 15 13"></polyline>
              </svg>
            </div>
            <div>
              <div className="bhoomi-uploaded-name">📄 {lastUploadedDoc.name}</div>
              <div className="bhoomi-uploaded-sub">
                {lastUploadedDoc.size} · Uploaded at {lastUploadedDoc.uploadTime} · Digitized
              </div>
            </div>
          </div>
          <button className="bhoomi-view-records-btn" onClick={onViewRecords}>
            View in My Records →
          </button>
        </div>
      )}

      {/* CTA Buttons: Upload (primary) + How It Works (secondary, below) */}
      <div className="bhoomi-hero-actions-column">
        <button className="btn-upload-primary" onClick={onUpload}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m8 16 4-4 4 4"></path>
          </svg>
          Upload Land Document
        </button>

        <button className="btn-how-it-works-downward" onClick={onScrollToSteps}>
          How It Works
        </button>
      </div>

      {/* Bouncing down arrow — scroll shortcut to Three Simple Steps */}
      <div
        className="bhoomi-down-arrow-container"
        onClick={onScrollToSteps}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to Three Simple Steps"
        onKeyDown={(e) => e.key === 'Enter' && onScrollToSteps()}
      >
        <div className="bhoomi-down-arrow-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </div>
        <span className="bhoomi-down-arrow-label">Explore Steps</span>
      </div>
    </section>
  )
}
