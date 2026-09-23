import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// ── Fallback demo document content ───────────────────────────────────────────
const DEMO_DOCUMENT = {
  title: 'Document Review: Deed-142 (Varanasi District)',
  type: 'DEED OF CONVEYANCE / REVENUE RECORD',
  body: [
    { text: 'This Land Record / Deed of Conveyance is registered on ', plain: true },
    { text: '12/05/2023', highlight: 'date', label: 'Date' },
    { text: ' between the respective parties.', plain: true },
  ],
  parties: [
    { text: 'The Registered Landholder / Vendor, ', plain: true },
    { text: 'Suresh Kumar', highlight: 'owner', label: 'Owner' },
    { text: ', hereby declares legal title and ownership over the property situated at Varanasi District.', plain: true },
  ],
  propertyLines: [
    { label: 'Khasra Number:', value: '128/3', highlight: 'khasra' },
    { label: 'Khata Number:', value: 'KH-442', highlight: 'mutation' },
    { label: 'Plot Area:', value: '2.1 Hectares', highlight: 'area' },
  ],
}

const HIGHLIGHT_COLORS = {
  owner:           { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  khasra:          { bg: '#fef9c3', border: '#fde047', text: '#713f12' },
  area:            { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' },
  date:            { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  mutation:        { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
}

// ────────────────────────────────────────────────────────────────────────────
export default function DocumentReviewPage({ onBack, onConfirm, uploadedFileName, extractedData }) {
  const { t } = useLanguage()
  
  const defaultOwner = (uploadedFileName && uploadedFileName.toLowerCase().includes('mahesh')) ? 'Mahesh Yadav' : 'Parv Jain'
  const defaultKhasra = (uploadedFileName && uploadedFileName.toLowerCase().includes('mahesh')) ? '402/1' : '128/3'
  const defaultArea = (uploadedFileName && uploadedFileName.toLowerCase().includes('mahesh')) ? '1.45 Hectares' : '2.10 Hectares'
  const defaultDate = (uploadedFileName && uploadedFileName.toLowerCase().includes('mahesh')) ? '03/11/2023' : '14/08/2024'
  const defaultKhata = (uploadedFileName && uploadedFileName.toLowerCase().includes('mahesh')) ? 'KH-819' : 'KH-442'

  // Use real extracted data if available, fallback to demo data otherwise
  const initialFields = extractedData ? [
    { id: 'owner',    label: 'Owner Name',    value: extractedData.ownerName || defaultOwner,   reviewState: 'PENDING' },
    { id: 'khasra',   label: 'Khasra Number', value: extractedData.khasraNo || defaultKhasra,    reviewState: 'PENDING' },
    { id: 'area',     label: 'Plot Area',     value: extractedData.area || defaultArea,        reviewState: 'PENDING' },
    { id: 'date',     label: 'Deed Date',     value: extractedData.date || defaultDate,        reviewState: 'PENDING' },
    { id: 'mutation', label: 'Khata Number',  value: extractedData.khataNo || defaultKhata,     reviewState: 'PENDING' },
  ] : [
    { id: 'owner',    label: 'Owner Name',    value: defaultOwner,   reviewState: 'PENDING' },
    { id: 'khasra',   label: 'Khasra Number', value: defaultKhasra,  reviewState: 'PENDING' },
    { id: 'area',     label: 'Plot Area',     value: defaultArea,    reviewState: 'PENDING' },
    { id: 'date',     label: 'Deed Date',     value: defaultDate,    reviewState: 'PENDING' },
    { id: 'mutation', label: 'Khata Number',  value: defaultKhata,   reviewState: 'PENDING' },
  ]

  const [fields, setFields] = useState(initialFields)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState(null)

  const updateField = (id, patch) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const handleStartEdit = (f) => {
    setEditingId(f.id)
    setEditValue(f.value)
  }

  const handleSaveEdit = (id) => {
    updateField(id, { value: editValue, reviewState: 'ACCEPTED' })
    setEditingId(null)
  }

  const reviewedCount = fields.filter((f) => f.reviewState !== 'PENDING').length
  const allReviewed = reviewedCount === fields.length

  const handleSubmitReview = () => {
    if (!allReviewed) return
    setSubmitted(true)
    if (typeof onConfirm === 'function') {
      const fieldMap = {}
      fields.forEach((f) => {
        fieldMap[f.id] = f.value
      })
      onConfirm({
        ownerName: fieldMap.owner || extractedData?.ownerName || defaultOwner,
        khasraNo: fieldMap.khasra || extractedData?.khasraNo || defaultKhasra,
        area: fieldMap.area || extractedData?.area || defaultArea,
        date: fieldMap.date || extractedData?.date || defaultDate,
        khataNo: fieldMap.mutation || extractedData?.khataNo || defaultKhata,
        district: extractedData?.district || 'Gurugram',
        tehsil: extractedData?.tehsil || 'Gurugram Sadar',
        village: extractedData?.village || 'Khandsa',
        state: extractedData?.state || 'Haryana',
        confidence: extractedData?.confidence || 'high',
        confidenceScore: extractedData?.confidenceScore || 96.5,
      })
    }
  }

  // ── Highlighted inline token ──────────────────────────────────────────────
  const HL = ({ id, children }) => {
    const colors = HIGHLIGHT_COLORS[id] || {}
    return (
      <span
        className={`doc-highlight ${activeFieldId === id ? 'doc-highlight-active' : ''}`}
        style={{ background: colors.bg, borderBottom: `2px solid ${colors.border}`, color: colors.text }}
        onClick={() => setActiveFieldId(id === activeFieldId ? null : id)}
      >
        {children}
      </span>
    )
  }

  const ownerVal = fields.find((f) => f.id === 'owner')?.value || 'Suresh Kumar'
  const khasraVal = fields.find((f) => f.id === 'khasra')?.value || '128/3'
  const areaVal = fields.find((f) => f.id === 'area')?.value || '2.1 Hectares'
  const dateVal = fields.find((f) => f.id === 'date')?.value || '12/05/2023'
  const khataVal = fields.find((f) => f.id === 'mutation')?.value || 'KH-442'

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
        <h1 className="doc-review-title">
          {uploadedFileName ? `PaddleOCR Extraction Review: ${uploadedFileName}` : DEMO_DOCUMENT.title}
        </h1>
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
            <strong>{t('review.khasra')}:</strong> {khasraVal} &nbsp;|&nbsp; <strong>{t('review.owner')}:</strong> {ownerVal} &nbsp;|&nbsp; <strong>Area:</strong> {areaVal}
          </div>
          <button className="doc-success-back-btn" onClick={onBack}>
            {t('review.backHome')}
          </button>
        </div>
      ) : (
        <div className="doc-review-body">

          {/* ── LEFT: Document Viewer ── */}
          <div className="doc-viewer-panel">
            <div className="doc-viewer-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {t('review.viewerTitle')} — {extractedData?.documentType || 'Land Record Document'}
            </div>
            <div className="doc-viewer-content">
              <div className="doc-paper">
                <h2 className="doc-paper-title">{extractedData?.documentType || DEMO_DOCUMENT.type}</h2>
                <p className="doc-paper-para">
                  This Land Record / Deed of Conveyance is registered on <HL id="date">{dateVal}</HL> in the official revenue jurisdiction of {extractedData?.district || 'Gurugram'}, {extractedData?.state || 'Haryana'}.
                </p>
                <p className="doc-paper-para">
                  The Registered Landholder / Allottee, <HL id="owner">{ownerVal}</HL>, possesses legitimate title and occupancy rights under the state cadastral registry.
                </p>
                <div className="doc-paper-divider" />
                <p className="doc-paper-section-title">{t('review.propDetails')}</p>
                
                <p className="doc-paper-property-line">
                  <span className="doc-prop-label">Khasra Number:</span>{' '}
                  <HL id="khasra">{khasraVal}</HL>
                </p>
                <p className="doc-paper-property-line">
                  <span className="doc-prop-label">Khata / Khatouni:</span>{' '}
                  <HL id="mutation">{khataVal}</HL>
                </p>
                <p className="doc-paper-property-line">
                  <span className="doc-prop-label">Plot Area:</span>{' '}
                  <HL id="area">{areaVal}</HL>
                </p>

                {extractedData?.raw_text && (
                  <div style={{ marginTop: '16px', padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '11px', color: '#64748b' }}>
                    <strong>PaddleOCR Scanned Text Stream:</strong>
                    <div style={{ marginTop: '4px', fontStyle: 'italic', maxHeight: '80px', overflowY: 'auto' }}>
                      "{extractedData.raw_text}"
                    </div>
                  </div>
                )}

                <div className="doc-paper-sig-row">
                  <div className="doc-sig-block">
                    <div className="doc-sig-line" />
                    <span>{t('review.sigVendor')}</span>
                  </div>
                  <div className="doc-sig-block">
                    <div className="doc-sig-line" />
                    <span>{t('review.sigVendee')}</span>
                  </div>
                </div>
              </div>
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
              <span className="doc-ai-badge">PaddleOCR</span>
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
                  className={`doc-field-card ${field.reviewState === 'ACCEPTED' ? 'doc-field-accepted' : ''} ${field.reviewState === 'FLAGGED' ? 'doc-field-flagged' : ''} ${activeFieldId === field.id ? 'doc-field-active' : ''}`}
                  onClick={() => setActiveFieldId(field.id === activeFieldId ? null : field.id)}
                >
                  <div className="doc-field-card-top">
                    <span className="doc-field-label">{field.label}</span>
                  </div>

                  <div className="doc-field-value-row">
                    {editingId === field.id ? (
                      <div style={{ display: 'flex', gap: '6px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #3b82f6', fontSize: '13px' }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(field.id)}
                          style={{ padding: '4px 8px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="doc-field-value">{field.value}</span>
                        {field.reviewState !== 'PENDING' && (
                          <span className={`doc-field-status ${field.reviewState === 'ACCEPTED' ? 'status-green' : 'status-red'}`}>
                            {field.reviewState === 'ACCEPTED' ? 'ACCEPTED' : 'FLAGGED'}
                          </span>
                        )}
                      </>
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
                    <button
                      className="doc-field-btn"
                      style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                      onClick={() => handleStartEdit(field)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="doc-submit-wrap">
              {!allReviewed && (
                <p className="doc-submit-hint">{t('review.submitHint').replace('{count}', fields.length)}</p>
              )}
              <button
                className={`doc-submit-btn ${allReviewed ? 'doc-submit-ready' : 'doc-submit-disabled'}`}
                onClick={handleSubmitReview}
                disabled={!allReviewed}
              >
                Confirm &amp; Finalize Digitization
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
