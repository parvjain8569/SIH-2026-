import { useState } from 'react'

export default function NotificationsTab({ notifications, onMarkAllRead }) {
  const [filter, setFilter] = useState('all') // 'all' | 'processing' | 'status' | 'decision'

  const filtered = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  )

  return (
    <div>
      {/* Filter Pills */}
      <div className="notif-filter-bar">
        <button
          className={`notif-filter-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`notif-filter-pill ${filter === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          📄 Document Processing
        </button>
        <button
          className={`notif-filter-pill ${filter === 'status' ? 'active' : ''}`}
          onClick={() => setFilter('status')}
        >
          🔍 Verification Status
        </button>
        <button
          className={`notif-filter-pill ${filter === 'decision' ? 'active' : ''}`}
          onClick={() => setFilter('decision')}
        >
          ⚖️ Accept / Reject
        </button>
      </div>

      {/* Notification List */}
      <div className="notif-list">
        {filtered.map((n) => (
          <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
            <div
              className="notif-icon-circle"
              style={{
                backgroundColor:
                  n.type === 'decision' ? '#fef3c7' : n.type === 'status' ? '#dcfce7' : '#e0e7ff',
                color:
                  n.type === 'decision' ? '#d97706' : n.type === 'status' ? '#15803d' : '#4338ca',
              }}
            >
              {n.type === 'decision' ? '⚖️' : n.type === 'status' ? '✓' : '📄'}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div className="notif-title-row">
                <h4 className="notif-title">{n.title}</h4>
                <span className="notif-time">{n.time}</span>
              </div>
              <p className="notif-message">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="btn-view-record" onClick={onMarkAllRead}>
          ✓ Mark all as read
        </button>
      </div>
    </div>
  )
}
