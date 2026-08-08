import { useState, useEffect } from 'react'
import { getRecentActivity } from '../github'
import { useJsonFile } from '../useJsonFile'

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
  const {
    data: projects,
    error: projectsError,
  } = useJsonFile(token, 'src/data/projects.json')
  const {
    data: testimonials,
    error: testimonialsError,
  } = useJsonFile(token, 'src/data/testimonials.json')
  const {
    data: services,
    error: servicesError,
  } = useJsonFile(token, 'src/data/services.json')
  const [activity, setActivity] = useState(null)

  useEffect(() => {
    getRecentActivity(token, 8).then(setActivity)
  }, [token])

  const stats = {
    projects: projects ? projects.projects.length : null,
    testimonials: testimonials ? testimonials.testimonials.length : null,
    services: services ? services.services.length : null,
  }
  const loadError = projectsError || testimonialsError || servicesError

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Dashboard</h2>
      <p className="admin-section-subtitle">Overview of your site's content</p>

      {loadError && <p className="admin-status admin-status-error">{loadError}</p>}

      <div className="admin-stats-grid">
        <button className="admin-stat-card" onClick={() => onNavigate('projects')}>
          <span className="admin-stat-number">
            {stats.projects !== null ? stats.projects : '—'}
          </span>
          <span className="admin-stat-label">Projects</span>
        </button>
        <button className="admin-stat-card" onClick={() => onNavigate('testimonials')}>
          <span className="admin-stat-number">
            {stats.testimonials !== null ? stats.testimonials : '—'}
          </span>
          <span className="admin-stat-label">Testimonials</span>
        </button>
        <button className="admin-stat-card" onClick={() => onNavigate('services')}>
          <span className="admin-stat-number">
            {stats.services !== null ? stats.services : '—'}
          </span>
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
