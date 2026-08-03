import { useState, useEffect } from 'react'
import { getJsonFile, getRecentActivity } from '../github'

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function Dashboard({ token, onNavigate }) {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getJsonFile(token, 'src/data/projects.json'),
      getJsonFile(token, 'src/data/testimonials.json'),
      getJsonFile(token, 'src/data/services.json'),
    ])
      .then(([projects, testimonials, services]) => {
        setStats({
          projects: projects.json.projects.length,
          testimonials: testimonials.json.testimonials.length,
          services: services.json.services.length,
        })
      })
      .catch(err => setError(err.message))

    getRecentActivity(token, 8).then(setActivity)
  }, [token])

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Dashboard</h2>
      <p className="admin-section-subtitle">Overview of your site's content</p>

      {error && <p className="admin-status admin-status-error">{error}</p>}

      <div className="admin-stats-grid">
        <button className="admin-stat-card" onClick={() => onNavigate('projects')}>
          <span className="admin-stat-number">{stats ? stats.projects : '—'}</span>
          <span className="admin-stat-label">Projects</span>
        </button>
        <button className="admin-stat-card" onClick={() => onNavigate('testimonials')}>
          <span className="admin-stat-number">{stats ? stats.testimonials : '—'}</span>
          <span className="admin-stat-label">Testimonials</span>
        </button>
        <button className="admin-stat-card" onClick={() => onNavigate('services')}>
          <span className="admin-stat-number">{stats ? stats.services : '—'}</span>
          <span className="admin-stat-label">Services</span>
        </button>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Recent Activity</h3>
        {activity === null && <p className="admin-hint">Loading recent changes…</p>}
        {activity && activity.length === 0 && (
          <p className="admin-hint">No content changes yet.</p>
        )}
        {activity && activity.length > 0 && (
          <ul className="admin-activity-list">
            {activity.map(item => (
              <li className="admin-activity-item" key={item.sha}>
                <span className="admin-activity-message">
                  {item.message.split('\n')[0]}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-activity-time"
                  title="View this change on GitHub"
                >
                  {timeAgo(item.date)}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-quick-actions">
        <a href="/" target="_blank" rel="noreferrer" className="btn btn-secondary">
          View Live Site &#8599;
        </a>
        <button className="btn btn-secondary" onClick={() => onNavigate('image-guide')}>
          Image Size Guide
        </button>
      </div>
    </div>
  )
}

export default Dashboard
