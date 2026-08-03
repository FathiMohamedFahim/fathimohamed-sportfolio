import { useState, useEffect, useRef, useCallback } from 'react'
import { getAuthenticatedUser } from './github'
import Dashboard from './sections/Dashboard'
import SiteEditor from './sections/SiteEditor'
import ProjectsEditor from './sections/ProjectsEditor'
import TestimonialsEditor from './sections/TestimonialsEditor'
import ServicesEditor from './sections/ServicesEditor'
import ImageGuide from './sections/ImageGuide'
import ToastStack from './components/Toast'
import ConfirmModal from './components/ConfirmModal'

const TOKEN_KEY = 'admin_github_token'
let toastCounter = 0

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'site', label: 'Site Settings' },
  { id: 'projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'services', label: 'Services' },
  { id: 'image-guide', label: 'Image Guide' },
]

function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dirtyMap, setDirtyMap] = useState({})
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null)
  const popupRef = useRef(null)
  const saveHandlersRef = useRef({})

  const anyDirty = Object.values(dirtyMap).some(Boolean)

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastCounter
    setToasts(t => [...t, { id, message, type }])
  }, [])

  const dismissToast = useCallback(id => {
    setToasts(t => t.filter(toast => toast.id !== id))
  }, [])

  const confirmAction = useCallback((message, confirmLabel) => {
    return new Promise(resolve => {
      setConfirmState({
        message,
        confirmLabel,
        resolveCallback: value => {
          setConfirmState(null)
          resolve(value)
        },
      })
    })
  }, [])

  function registerSaveHandler(tabId, fn) {
    saveHandlersRef.current[tabId] = fn
  }

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (!anyDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [anyDirty])

  useEffect(() => {
    function handleKeyDown(e) {
      const isSaveShortcut = (e.metaKey || e.ctrlKey) && e.key === 's'
      if (!isSaveShortcut) return
      e.preventDefault()
      const handler = saveHandlersRef.current[activeTab]
      if (handler) handler()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab])

  const handleMessage = useCallback(event => {
    if (typeof event.data !== 'string') return

    if (event.data === 'authorizing:github') {
      popupRef.current?.postMessage('authorizing:github', event.origin)
      return
    }

    if (event.data.startsWith('authorization:github:success:')) {
      try {
        const payload = JSON.parse(
          event.data.replace('authorization:github:success:', '')
        )
        localStorage.setItem(TOKEN_KEY, payload.token)
        setToken(payload.token)
        popupRef.current?.close()
      } catch {
        setAuthError('Login succeeded but the response could not be read. Try again.')
      }
    }

    if (event.data.startsWith('authorization:github:error:')) {
      const message = event.data.replace('authorization:github:error:', '')
      setAuthError(`GitHub login failed: ${message}`)
      popupRef.current?.close()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false)
      return
    }
    getAuthenticatedUser(token)
      .then(u => {
        setUser(u)
        setCheckingAuth(false)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setCheckingAuth(false)
      })
  }, [token])

  function login() {
    setAuthError(null)
    const width = 600
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    popupRef.current = window.open(
      '/api/auth',
      'github-oauth',
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  if (checkingAuth) {
    return (
      <div className="admin-loading">
        <div className="admin-logo-mark">FM</div>
        <p>Loading…</p>
      </div>
    )
  }

  if (!token || !user) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <img src="/images/logo.png" alt="Fathi Mohamed" className="admin-login-logo" />
          <h1 className="admin-login-title">Content Manager</h1>
          <p className="admin-login-subtitle">
            Sign in with GitHub to edit your portfolio.
          </p>
          <button className="btn btn-primary admin-login-btn" onClick={login}>
            Login with GitHub
          </button>
          {authError && <p className="admin-error">{authError}</p>}
        </div>
      </div>
    )
  }

  const sharedProps = { token, showToast, confirmAction }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <img src="/images/logo.png" alt="" className="admin-brand-logo" />
            <span>Content Manager</span>
          </div>
          <nav className="admin-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`admin-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {dirtyMap[tab.id] && <span className="admin-dirty-dot" title="Unsaved changes" />}
              </button>
            ))}
          </nav>
          <div className="admin-user">
            <a href="/" target="_blank" rel="noreferrer" className="admin-view-site-link">
              View Live Site &#8599;
            </a>
            <img src={user.avatar_url} alt="" className="admin-user-avatar" />
            <span>{user.login}</span>
            <button className="btn btn-secondary admin-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
          <Dashboard token={token} onNavigate={setActiveTab} />
        </div>
        <div style={{ display: activeTab === 'site' ? 'block' : 'none' }}>
          <SiteEditor
            {...sharedProps}
            onDirtyChange={dirty => setDirtyMap(m => ({ ...m, site: dirty }))}
            registerSave={fn => registerSaveHandler('site', fn)}
          />
        </div>
        <div style={{ display: activeTab === 'projects' ? 'block' : 'none' }}>
          <ProjectsEditor
            {...sharedProps}
            onDirtyChange={dirty => setDirtyMap(m => ({ ...m, projects: dirty }))}
            registerSave={fn => registerSaveHandler('projects', fn)}
          />
        </div>
        <div style={{ display: activeTab === 'testimonials' ? 'block' : 'none' }}>
          <TestimonialsEditor
            {...sharedProps}
            onDirtyChange={dirty => setDirtyMap(m => ({ ...m, testimonials: dirty }))}
            registerSave={fn => registerSaveHandler('testimonials', fn)}
          />
        </div>
        <div style={{ display: activeTab === 'services' ? 'block' : 'none' }}>
          <ServicesEditor
            {...sharedProps}
            onDirtyChange={dirty => setDirtyMap(m => ({ ...m, services: dirty }))}
            registerSave={fn => registerSaveHandler('services', fn)}
          />
        </div>
        <div style={{ display: activeTab === 'image-guide' ? 'block' : 'none' }}>
          <ImageGuide />
        </div>
      </main>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        state={confirmState}
        onResolve={value => confirmState?.resolveCallback(value)}
      />
    </div>
  )
}

export default AdminApp
