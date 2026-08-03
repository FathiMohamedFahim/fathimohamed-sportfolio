import { useEffect } from 'react'

function Toast({ id, message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <span>{message}</span>
      <button className="admin-toast-close" onClick={() => onDismiss(id)} aria-label="Dismiss">
        &times;
      </button>
    </div>
  )
}

function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="admin-toast-stack">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default ToastStack
