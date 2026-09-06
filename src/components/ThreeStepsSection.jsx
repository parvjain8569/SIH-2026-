import { forwardRef } from 'react'

// ThreeStepsSection: Displayed after the hero when the user scrolls down or clicks "How It Works"
// Uses forwardRef so the parent can scrollIntoView() this section
const ThreeStepsSection = forwardRef(function ThreeStepsSection(_, ref) {
  return (
    <section className="bhoomi-steps-section" ref={ref} id="three-steps">
      <div className="bhoomi-steps-wrapper">
        <h2 className="bhoomi-steps-heading">Three Simple Steps</h2>

        <div className="bhoomi-steps-grid">

          {/* Step 01: Upload */}
          <div className="bhoomi-step-card">
            <div className="bhoomi-step-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m8 16 4-4 4 4"></path>
              </svg>
            </div>
            <span className="bhoomi-step-number">01</span>
            <h3 className="bhoomi-step-title">Upload</h3>
            <p className="bhoomi-step-desc">Upload your document.</p>
          </div>

          {/* Step 02: Verify */}
          <div className="bhoomi-step-card">
            <div className="bhoomi-step-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <span className="bhoomi-step-number">02</span>
            <h3 className="bhoomi-step-title">Verify</h3>
            <p className="bhoomi-step-desc">Information is extracted and validated.</p>
          </div>

          {/* Step 03: Get Digital Record */}
          <div className="bhoomi-step-card">
            <div className="bhoomi-step-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <span className="bhoomi-step-number">03</span>
            <h3 className="bhoomi-step-title">Get Digital Record</h3>
            <p className="bhoomi-step-desc">Receive your verified digital record.</p>
          </div>

        </div>
      </div>
    </section>
  )
})

export default ThreeStepsSection
