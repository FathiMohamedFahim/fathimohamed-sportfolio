function ConfirmModal({ state, onResolve }) {
  if (!state) return null

  return (
    <div className="admin-modal-overlay" onClick={() => onResolve(false)}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <p className="admin-modal-message">{state.message}</p>
        <div className="admin-modal-actions">
          <button className="btn btn-secondary" onClick={() => onResolve(false)}>
            Cancel
          </button>
          <button className="admin-modal-confirm-btn" onClick={() => onResolve(true)}>
            {state.confirmLabel || 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
