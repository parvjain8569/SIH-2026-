export default function RecordDetailsModal({
  isOpen,
  onClose,
  isProcessing,
  lastUploadedDoc,
  selectedRecord,
  onNavigateToRecords,
}) {
  if (!isOpen) return null

  return (
    <div className="bhoomi-modal-overlay" onClick={() => !isProcessing && onClose()}>
      <div className="bhoomi-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bhoomi-modal-header">
          <h3 className="bhoomi-modal-title">
            {isProcessing ? 'Validating Land Record...' : 'Record Digitized & Verified'}
          </h3>
          {!isProcessing && (
            <button className="bhoomi-modal-close" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          )}
        </div>

        {isProcessing ? (
          <div className="bhoomi-upload-status">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#111827' }}>
                Reading {lastUploadedDoc?.name}
              </div>
              <div style={{ fontSize: '13px', color: '#4b5563' }}>
                Extracting cadastral survey map & registry seal...
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="bhoomi-upload-status"
              style={{
                backgroundColor: selectedRecord?.status === 'Verified' ? '#ecfdf5' : '#fffbeb',
                borderColor: selectedRecord?.status === 'Verified' ? '#a7f3d0' : '#fde68a',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={selectedRecord?.status === 'Verified' ? '#16a34a' : '#d97706'}
                strokeWidth="2.5"
              >
                {selectedRecord?.status === 'Verified' ? (
                  <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </>
                ) : (
                  <>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </>
                )}
              </svg>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '14.5px',
                    color: selectedRecord?.status === 'Verified' ? '#166534' : '#92400e',
                  }}
                >
                  {selectedRecord?.status === 'Verified'
                    ? 'Official Registry Verified'
                    : 'Manual Review Pending'}
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: selectedRecord?.status === 'Verified' ? '#15803d' : '#b45309',
                  }}
                >
                  {selectedRecord?.status === 'Verified'
                    ? 'Cryptographic digital hash verified against state land records database.'
                    : 'Discrepancy detected in boundary survey. Scheduled for officer review.'}
                </div>
              </div>
            </div>

            {selectedRecord && (
              <div className="bhoomi-doc-details">
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Document File:</span>
                  <strong style={{ color: '#111827' }}>
                    {selectedRecord.documentName || 'land_record.pdf'}
                  </strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Owner Name:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.ownerName}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Parcel ID:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.parcelId}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Khasra / Plot No:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.khasraNo}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Location:</span>
                  <strong style={{ color: '#111827' }}>
                    {selectedRecord.district}, {selectedRecord.state}
                  </strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Total Area:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.area}</strong>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-upload-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  alert(`Verified Digital Certificate (${selectedRecord?.parcelId}) downloaded!`)
                  onClose()
                }}
              >
                Download Certificate
              </button>
              <button
                className="btn-how-it-works-downward"
                onClick={() => {
                  onClose()
                  if (onNavigateToRecords) onNavigateToRecords()
                }}
              >
                Go to My Records
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
