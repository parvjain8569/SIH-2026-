import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// ── Fallback AI-extracted fields (used when no OCR data available) ─────────
const INITIAL_FIELDS = [
  { id: 'owner',    label: 'Owner Name',    value: 'Suresh Kumar',   reviewState: 'PENDING' },
  { id: 'khasra',  label: 'Khasra Number', value: '128/3',          reviewState: 'PENDING' },
  { id: 'area',    label: 'Plot Area',     value: '2.1 Hectares',   reviewState: 'PENDING' },
  { id: 'date',    label: 'Deed Date',     value: '12/05/2023',     reviewState: 'PENDING' },
  { id: 'mutation',label: 'Mutation ID',   value: 'MUT-2023-4421',  reviewState: 'PENDING' },
]

// ────────────────────────────────────────────────────────────────────────────
export default function DocumentReviewPage({ onBack, onAccept, onReject, uploadedFileName, extractedData, filePreviewUrl, fileType }) {
  const { t } = useLanguage()
  
  // Use real extracted data if available, fallback to demo data otherwise
  const initialFields = extractedData ? [
    { id: 'owner',    label: 'Owner Name',    value: extractedData.ownerName || 'Not Found', reviewState: 'PENDING' },
    { id: 'khasra',   label: 'Khasra Number', value: extractedData.khasraNo || 'Not Found',  reviewState: 'PENDING' },
    { id: 'area',     label: 'Plot Area',     value: extractedData.area || 'Not Found',      reviewState: 'PENDING' },
    { id: 'date',     label: 'Deed Date',     value: extractedData.date || 'Not Found',      reviewState: 'PENDING' },
    { id: 'mutation', label: 'Khata Number',  value: extractedData.khataNo || 'Not Found',   reviewState: 'PENDING' },
  ] : INITIAL_FIELDS

  const [fields, setFields] = useState(initialFields)
  const [submitted, setSubmitted] = useState(false)

  const updateField = (id, patch) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const reviewedCount = fields.filter((f) => f.reviewState !== 'PENDING').length
  const allReviewed = reviewedCount === fields.length

  const handleSubmitReview = () => {
    if (!allReviewed) return
    setSubmitted(true)
    if (onAccept) onAccept(fields)
  }

  const handleRejectReview = () => {
    if (onReject) onReject()
  }

  // Determine if the uploaded file is a PDF or an image
  const isPdf = fileType === 'application/pdf' || uploadedFileName?.toLowerCase().endsWith('.pdf')

  return (
    <div className="doc-review-page">
      {/* ── Top bar ── */}
      <div className="doc-review-topbar">
        <button className="doc-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t('review.backBtn')}
        </button>
        <h1 className="doc-review-title">Document Review: {uploadedFileName || 'Uploaded Document'}</h1>
        {uploadedFileName && (
          <span className="doc-review-filename">📄 {uploadedFileName}</span>
        )}
      </div>

      {submitted ? (
        /* ── Success Screen ── */
        <div className="doc-review-success">
          <div className="doc-success-icon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <h2 className="doc-success-heading">{t('review.successHeading')}</h2>
          <p className="doc-success-sub">{t('review.successSub').replace('{count}', fields.length)}</p>
          <div className="doc-success-badge">
            <strong>Document:</strong> {uploadedFileName} &nbsp;|&nbsp;
            <strong>{t('review.khasra')}:</strong> {fields.find(f => f.id === 'khasra')?.value || 'N/A'} &nbsp;|&nbsp;
            <strong>{t('review.owner')}:</strong> {fields.find(f => f.id === 'owner')?.value || 'N/A'}
          </div>
          <button className="doc-success-back-btn" onClick={onBack}>
            {t('review.backHome')}
          </button>
        </div>
      ) : (
        <div className="doc-review-body">

          {/* ── LEFT: Actual Document Viewer ── */}
          <div className="doc-viewer-panel">
            <div className="doc-viewer-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {t('review.viewerTitle')} — {uploadedFileName}
            </div>
            <div className="doc-viewer-content" style={{ padding: 0, display: 'flex', alignItems: 'stretch', justifyContent: 'center', minHeight: '500px' }}>
              {filePreviewUrl ? (
                isPdf ? (
                  /* PDF: Show in an iframe */
                  <iframe
                    src={filePreviewUrl}
                    title="Uploaded Document Preview"
                    style={{
                      width: '100%', height: '100%', minHeight: '600px',
                      border: 'none', borderRadius: '8px',
                    }}
                  />
                ) : (
                  /* Image: Show as an img tag */
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded Document Preview"
                    style={{
                      maxWidth: '100%', maxHeight: '700px',
                      objectFit: 'contain', borderRadius: '8px',
                      margin: '12px auto', display: 'block',
                    }}
                  />
                )
              ) : (
                /* Fallback: No preview available */
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '12px', padding: '40px', color: '#94a3b8',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span style={{ fontSize: '14px' }}>Document preview not available</span>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: AI Extracted Fields Panel ── */}
          <div className="doc-fields-panel">
            <div className="doc-fields-header">
              <div className="doc-fields-header-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span className="doc-fields-title">{t('review.extractedTitle')}</span>
              </div>
              <span className="doc-ai-badge">{t('review.actionAi')}</span>
            </div>

            <div className="doc-fields-progress">
              <span className="doc-fields-progress-text">{reviewedCount}/{fields.length} {t('review.fieldsAccepted')}</span>
              <div className="doc-fields-progress-bar">
                <div
                  className="doc-fields-progress-fill"
                  style={{ width: `${(reviewedCount / fields.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="doc-fields-list">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`doc-field-card ${field.reviewState === 'ACCEPTED' ? 'doc-field-accepted' : ''} ${field.reviewState === 'FLAGGED' ? 'doc-field-flagged' : ''}`}
                >
                  <div className="doc-field-card-top">
                    <span className="doc-field-label">{field.label}</span>
                  </div>

                  <div className="doc-field-value-row">
                    <span className="doc-field-value">{field.value}</span>
                    {field.reviewState !== 'PENDING' && (
                      <span className={`doc-field-status ${field.reviewState === 'ACCEPTED' ? 'status-green' : 'status-red'}`}>
                        {field.reviewState === 'ACCEPTED' ? 'ACCEPTED' : 'FLAGGED'}
                      </span>
                    )}
                  </div>

                  {field.reviewState !== 'PENDING' && (
                    <div className="doc-field-status-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={field.reviewState === 'ACCEPTED' ? '#16a34a' : '#dc2626'} stroke="none">
                        <rect width="24" height="24" rx="3" />
                      </svg>
                      <span style={{ fontSize: '11.5px', color: field.reviewState === 'ACCEPTED' ? '#15803d' : '#991b1b', fontWeight: 500 }}>
                        {field.reviewState === 'ACCEPTED' ? t('review.statusGreen', 'Validated') : t('review.statusRed', 'Flagged')}
                      </span>
                    </div>
                  )}

                  <div className="doc-field-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="doc-field-btn doc-btn-accept"
                      onClick={() => updateField(field.id, { reviewState: 'ACCEPTED' })}
                    >
                      {t('review.accept')}
                    </button>
                    <button
                      className="doc-field-btn doc-btn-flag"
                      onClick={() => updateField(field.id, { reviewState: 'FLAGGED' })}
                    >
                      {t('review.flag')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="doc-submit-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!allReviewed && (
                <p className="doc-submit-hint">{t('review.submitHint').replace('{count}', fields.length)}</p>
              )}
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button
                  className="doc-submit-btn"
                  style={{ background: '#dc2626', color: 'white', flex: 1, opacity: 1, cursor: 'pointer' }}
                  onClick={handleRejectReview}
                >
                  Reject & Retry
                </button>
                <button
                  className={`doc-submit-btn ${allReviewed ? 'doc-submit-ready' : 'doc-submit-disabled'}`}
                  style={{ flex: 1 }}
                  onClick={handleSubmitReview}
                  disabled={!allReviewed}
                >
                  {t('review.submitBtn')}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
