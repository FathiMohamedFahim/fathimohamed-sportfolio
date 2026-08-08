import { useEffect, useCallback } from 'react'

function ConfirmModal({ state, onResolve }) {
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') onResolve(false)
    },
    [onResolve]
  )

  useEffect(() => {
    if (!state) return
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [state, handleKeyDown])

  if (!state) return null

  return (
    <div className="admin-modal-overlay" onClick={() => onResolve(false)}>
      <div
        className="admin-modal"
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label={state.message}
      >
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
