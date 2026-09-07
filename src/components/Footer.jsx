// Footer: Modern BhoomIntelli portal footer
export default function Footer() {
  return (
    <footer className="bhoomi-footer">
      <div className="bhoomi-footer-container">
        <div className="bhoomi-footer-left">
          <div className="bhoomi-footer-brand-wrap">
            <img
              src="/bhoomintelli-icon.png"
              alt="BhoomIntelli Icon"
              className="bhoomi-footer-icon"
            />
            <img
              src="/bhoomintelli-wordmark.png"
              alt="BhoomIntelli"
              className="bhoomi-footer-wordmark"
            />
          </div>
          <span className="bhoomi-footer-sep">·</span>
          <span className="bhoomi-footer-desc">Intelligent Land Record Digitization &amp; Validation System</span>
        </div>
        <div className="bhoomi-footer-right">
          <span>Digital India Initiative</span>
          <span className="bhoomi-footer-sep">·</span>
          <span>Security &amp; Spatial Alignment</span>
        </div>
      </div>
    </footer>
  )
}
