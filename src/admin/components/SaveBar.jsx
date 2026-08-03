function SaveBar({ saving, error, onSave }) {
  return (
    <div className="admin-save-bar">
      <button className="btn btn-primary" onClick={onSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
      <span className="admin-save-hint">Tip: Ctrl/Cmd + S also saves</span>
      {error && <span className="admin-save-status admin-save-error">{error}</span>}
    </div>
  )
}

export default SaveBar
