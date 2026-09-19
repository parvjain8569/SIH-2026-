import { useState } from 'react'
import RecordAuditStudio from '../components/RecordAuditStudio.jsx'

const INITIAL_RECORDS = [
  {
    id: 'REC-28452',
    owner: 'Parv Jain',
    parcel: 'HR-40222',
    khasra: '128/3',
    district: 'Gurugram',
    state: 'Haryana',
    area: '2.40 Hectares',
    date: '19 Sep 2026',
    status: 'High Risk', // Starts as Flagged/High Risk because of citizen area alteration
    documentType: 'Deed of Conveyance & Title Transfer (Form 7/12)',
    ocrConfidence: '91.8%',
    adminNotes: 'Citizen Parv Jain amended plot area from 2.10 Ha to 2.40 Ha during self-verification. Discrepancy flag active.',
    docDetails: {
      vendor: 'Suresh Kumar',
      rawArea: '2.10 Hectares',
      date: '12/05/2023',
      mutationId: 'MUT-2023-4421'
    },
    fields: [
      {
        id: 'owner',
        label: 'Owner / Claimant Name',
        ocrValue: 'Parv Jain',
        citizenValue: 'Parv Jain',
        citizenAction: 'ACCEPTED',
        confidence: 97,
        bbox: 'x:50, y:130, w:280, h:35',
        hasDiscrepancy: false,
        adminDecision: 'PASS'
      },
      {
        id: 'khasra',
        label: 'Khasra / Survey No',
        ocrValue: '128/3',
        citizenValue: '128/3',
        citizenAction: 'ACCEPTED',
        confidence: 95,
        bbox: 'x:50, y:210, w:190, h:30',
        hasDiscrepancy: false,
        adminDecision: 'PASS'
      },
      {
        id: 'area',
        label: 'Plot Area (Hectares)',
        ocrValue: '2.10 Hectares',
        citizenValue: '2.40 Hectares',
        citizenAction: 'MODIFIED',
        confidence: 88,
        bbox: 'x:260, y:210, w:180, h:30',
        hasDiscrepancy: true,
        citizenRemarks: 'Physical survey carried out on 14 Aug shows 2.40 Ha boundary including access canal.',
        ocrWarning: 'OCR extracted 2.10 Hectares from printed deed clause 3.',
        adminDecision: 'FLAG'
      },
      {
        id: 'date',
        label: 'Deed Registration Date',
        ocrValue: '12/05/2023',
        citizenValue: '12/05/2023',
        citizenAction: 'ACCEPTED',
        confidence: 96,
        bbox: 'x:310, y:95, w:140, h:25',
        hasDiscrepancy: false,
        adminDecision: 'PASS'
      },
      {
        id: 'mutation',
        label: 'Mutation Request ID',
        ocrValue: 'MUT-2023-4421',
        citizenValue: 'MUT-2023-4421',
        citizenAction: 'ACCEPTED',
        confidence: 92,
        bbox: 'x:260, y:250, w:210, h:30',
        hasDiscrepancy: false,
        adminDecision: 'PASS'
      }
    ]
  },
  {
    id: 'REC-28451',
    owner: 'Ravi Sharma',
    parcel: 'HR-40221',
    khasra: '45/2',
    district: 'Faridabad',
    state: 'Haryana',
    area: '1.45 Hectares',
    date: '18 Sep 2026',
    status: 'Good',
    documentType: 'Registered Sale Deed (Deed-141)',
    ocrConfidence: '97.5%',
    adminNotes: 'All records clean. Digitally verified with Haryana Jamabandi portal.',
    docDetails: {
      vendor: 'Satish Narang',
      rawArea: '1.45 Hectares',
      date: '10/04/2024',
      mutationId: 'MUT-2024-1102'
    },
    fields: [
      { id: 'owner', label: 'Owner Name', ocrValue: 'Ravi Sharma', citizenValue: 'Ravi Sharma', citizenAction: 'ACCEPTED', confidence: 99, adminDecision: 'PASS' },
      { id: 'khasra', label: 'Khasra Number', ocrValue: '45/2', citizenValue: '45/2', citizenAction: 'ACCEPTED', confidence: 96, adminDecision: 'PASS' },
      { id: 'area', label: 'Plot Area', ocrValue: '1.45 Hectares', citizenValue: '1.45 Hectares', citizenAction: 'ACCEPTED', confidence: 98, adminDecision: 'PASS' }
    ]
  },
  {
    id: 'REC-28450',
    owner: 'Sunita Devi',
    parcel: 'UP-31090',
    khasra: '12/1',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    area: '0.80 Hectares',
    date: '18 Sep 2026',
    status: 'Under Review',
    documentType: 'Khatauni Record 1359 Fasli',
    ocrConfidence: '82.0%',
    adminNotes: 'Awaiting Sub-Registrar stamp verification.',
    docDetails: {
      vendor: 'State Govt Allocation',
      rawArea: '0.80 Hectares',
      date: '05/01/2022',
      mutationId: 'MUT-2022-8921'
    },
    fields: [
      { id: 'owner', label: 'Owner Name', ocrValue: 'Sunita Devi', citizenValue: 'Sunita Devi', citizenAction: 'ACCEPTED', confidence: 84, adminDecision: 'PASS' },
      { id: 'khasra', label: 'Khasra Number', ocrValue: '12/1', citizenValue: '12/1', citizenAction: 'ACCEPTED', confidence: 80, adminDecision: 'PASS' },
      { id: 'area', label: 'Plot Area', ocrValue: '0.80 Hectares', citizenValue: '0.80 Hectares', citizenAction: 'ACCEPTED', confidence: 82, adminDecision: 'PASS' }
    ]
  },
  {
    id: 'REC-28448',
    owner: 'Priya Patel',
    parcel: 'GJ-15032',
    khasra: '22/5',
    district: 'Ahmedabad',
    state: 'Gujarat',
    area: '1.20 Hectares',
    date: '17 Sep 2026',
    status: 'High Risk',
    documentType: 'Gift Deed (Bakshishnama)',
    ocrConfidence: '72.4%',
    adminNotes: 'Duplicate survey number claimed against ongoing civil suit.',
    docDetails: {
      vendor: 'Kishore Patel',
      rawArea: '1.20 Hectares',
      date: '11/11/2021',
      mutationId: 'MUT-2021-0021'
    },
    fields: [
      { id: 'owner', label: 'Owner Name', ocrValue: 'Priya Patel', citizenValue: 'Priya Patel', citizenAction: 'ACCEPTED', confidence: 78, adminDecision: 'PASS' },
      { id: 'khasra', label: 'Khasra Number', ocrValue: '22/5', citizenValue: '22/5-B', citizenAction: 'MODIFIED', confidence: 66, hasDiscrepancy: true, ocrWarning: 'Disputed sub-division indicator detected in registry.', adminDecision: 'FLAG' }
    ]
  },
  {
    id: 'REC-28447',
    owner: 'Arjun Singh',
    parcel: 'RJ-22145',
    khasra: '55/1',
    district: 'Jaipur',
    state: 'Rajasthan',
    area: '3.50 Hectares',
    date: '16 Sep 2026',
    status: 'Good',
    documentType: 'Agricultural Land Title',
    ocrConfidence: '95.0%',
    docDetails: { vendor: 'Ram Lal', rawArea: '3.50 Hectares', date: '04/09/2023', mutationId: 'MUT-2023-7711' },
    fields: [
      { id: 'owner', label: 'Owner Name', ocrValue: 'Arjun Singh', citizenValue: 'Arjun Singh', citizenAction: 'ACCEPTED', confidence: 96, adminDecision: 'PASS' },
      { id: 'khasra', label: 'Khasra Number', ocrValue: '55/1', citizenValue: '55/1', citizenAction: 'ACCEPTED', confidence: 94, adminDecision: 'PASS' }
    ]
  },
  {
    id: 'REC-28446',
    owner: 'Lakshmi Nair',
    parcel: 'KL-10098',
    khasra: '33/2',
    district: 'Kochi',
    state: 'Kerala',
    area: '0.65 Hectares',
    date: '16 Sep 2026',
    status: 'Pending',
    documentType: 'Partition Deed',
    ocrConfidence: '89.2%',
    docDetails: { vendor: 'Nair Family Trust', rawArea: '0.65 Hectares', date: '19/02/2024', mutationId: 'MUT-2024-5501' },
    fields: [
      { id: 'owner', label: 'Owner Name', ocrValue: 'Lakshmi Nair', citizenValue: 'Lakshmi Nair', citizenAction: 'ACCEPTED', confidence: 90, adminDecision: 'PASS' },
      { id: 'khasra', label: 'Khasra Number', ocrValue: '33/2', citizenValue: '33/2', citizenAction: 'ACCEPTED', confidence: 88, adminDecision: 'PASS' }
    ]
  }
]

export default function RecordsPage() {
  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [auditingRecord, setAuditingRecord] = useState(null)

  // Update a single record after audit studio verdict
  const handleUpdateRecord = (updated) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r))
    setAuditingRecord(updated)
  }

  // Filter records
  const filtered = records.filter(r => {
    const matchesSearch = (
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase()) ||
      r.district.toLowerCase().includes(search.toLowerCase()) ||
      r.state.toLowerCase().includes(search.toLowerCase()) ||
      r.parcel.toLowerCase().includes(search.toLowerCase())
    )

    if (!matchesSearch) return false

    if (statusFilter === 'ALL') return true
    if (statusFilter === 'GOOD') return r.status === 'Good' || r.status === 'Verified'
    if (statusFilter === 'FLAGGED') return r.status === 'High Risk' || r.status === 'Rejected'
    if (statusFilter === 'REVIEW') return r.status === 'Under Review'
    if (statusFilter === 'PENDING') return r.status === 'Pending'
    return true
  })

  // If user is currently auditing a record, display the Tri-Pane Audit Studio
  if (auditingRecord) {
    return (
      <RecordAuditStudio 
        record={auditingRecord}
        onBack={() => setAuditingRecord(null)}
        onUpdateRecord={handleUpdateRecord}
      />
    )
  }

  return (
    <div className="admin-section-card">
      {/* ── Page Header & Context Banner ── */}
      <div className="admin-records-header-row">
        <div>
          <h2 className="admin-records-heading">Citizen Land Record Verification Registry</h2>
          <p className="admin-records-sub">
            Review uploaded land deeds, cross-verify AI OCR extractions with citizen submissions, and issue official approvals or discrepancy flags.
          </p>
        </div>

        <div className="admin-records-stats-summary">
          <span className="stat-pill green">
            <span className="dot" /> {records.filter(r => r.status === 'Good' || r.status === 'Verified').length} Good (Green)
          </span>
          <span className="stat-pill yellow">
            <span className="dot" /> {records.filter(r => r.status === 'Under Review').length} Needs Review
          </span>
          <span className="stat-pill red">
            <span className="dot" /> {records.filter(r => r.status === 'High Risk' || r.status === 'Rejected').length} Flagged (Red)
          </span>
        </div>
      </div>

      {/* ── Filter Tabs & Search Toolbar ── */}
      <div className="admin-filter-tabs-row">
        <div className="admin-tab-group">
          <button 
            className={`admin-tab-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Records ({records.length})
          </button>
          <button 
            className={`admin-tab-pill tab-flagged ${statusFilter === 'FLAGGED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('FLAGGED')}
          >
            🔴 Flagged / Needs Action ({records.filter(r => r.status === 'High Risk' || r.status === 'Rejected').length})
          </button>
          <button 
            className={`admin-tab-pill tab-review ${statusFilter === 'REVIEW' ? 'active' : ''}`}
            onClick={() => setStatusFilter('REVIEW')}
          >
            🟡 Under Review ({records.filter(r => r.status === 'Under Review').length})
          </button>
          <button 
            className={`admin-tab-pill tab-good ${statusFilter === 'GOOD' ? 'active' : ''}`}
            onClick={() => setStatusFilter('GOOD')}
          >
            🟢 Good / Verified ({records.filter(r => r.status === 'Good' || r.status === 'Verified').length})
          </button>
          <button 
            className={`admin-tab-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            🔵 Pending Queue ({records.filter(r => r.status === 'Pending').length})
          </button>
        </div>

        <div className="admin-search-wrap">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search by ID, citizen name (e.g. Parv), parcel…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Citizen / Owner</th>
              <th>Parcel ID</th>
              <th>Khasra No</th>
              <th>District & State</th>
              <th>Registered Area</th>
              <th>Submission Date</th>
              <th>Classification Grade</th>
              <th>Audit Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="admin-table-empty">
                  No land records found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(r => {
                const isGood = r.status === 'Good' || r.status === 'Verified'
                const isFlagged = r.status === 'High Risk' || r.status === 'Rejected'
                const isReview = r.status === 'Under Review'

                return (
                  <tr key={r.id} className={r.owner === 'Parv Jain' ? 'admin-tr-highlight' : ''}>
                    <td>
                      <span className="admin-record-id-badge">{r.id}</span>
                      {r.noticeSent && <span className="admin-notice-tag">Notice Sent</span>}
                    </td>
                    <td>
                      <div className="admin-owner-cell">
                        <strong>{r.owner}</strong>
                        {r.owner === 'Parv Jain' && (
                          <span className="admin-demo-tag">Sample Uploader</span>
                        )}
                      </div>
                    </td>
                    <td><code>{r.parcel}</code></td>
                    <td>{r.khasra}</td>
                    <td>{r.district}, {r.state}</td>
                    <td>{r.area}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className={`admin-badge ${
                        isGood ? 'verified' : isFlagged ? 'rejected' : isReview ? 'pending' : 'default'
                      }`}>
                        <span className="admin-badge-dot" />
                        {isGood ? 'Good (Green)' :
                         isFlagged ? 'Flagged (Red)' :
                         isReview ? 'Needs Review (Yellow)' : r.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`admin-audit-launch-btn ${isFlagged ? 'btn-priority' : ''}`}
                        onClick={() => setAuditingRecord(r)}
                        title="Open 3-Column Split View Audit Studio"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Review & Audit
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
