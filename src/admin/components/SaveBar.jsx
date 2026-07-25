function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ago`
}

function SaveBar({ saving, error, savedAt, onSave }) {
  return (
    <div className="admin-save-bar">
      <button className="btn btn-primary" onClick={onSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
      {error && <span className="admin-save-status admin-save-error">{error}</span>}
      {!error && savedAt && (
        <span className="admin-save-status admin-save-success">
          Saved and pushed to GitHub — live site will update shortly ({timeAgo(savedAt)})
        </span>
      )}
    </div>
  )
}

export default SaveBar
