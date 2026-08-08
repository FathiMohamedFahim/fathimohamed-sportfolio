import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useScrollToSection } from '../hooks/useScrollToSection'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('theme') || 'dark'
  })
  const scrollToSection = useScrollToSection()
  const { lock, unlock } = useBodyScrollLock()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function toggleMenu() {
    setMenuOpen(prev => {
      const next = !prev
      if (next) {
        lock()
      } else {
        unlock()
      }
      return next
    })
  }

  function closeMenu() {
    setMenuOpen(open => {
      if (open) unlock()
      return false
    })
  }

  function handleNavClick(e, href) {
    if (href.startsWith('#')) {
      e.preventDefault()
      scrollToSection(href.slice(1))
      closeMenu()
    } else {
      closeMenu()
    }
  }

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container no-fade">
        <div className="logo">
          <a href="/" aria-label="Fathi Mohamed Logo">
            <img src="/images/logo.png" alt="Fathi Mohamed Logo" />
          </a>
        </div>

        <div className="header-actions">
          <nav className={`navigation${menuOpen ? ' show-menu' : ''}`}>
            <ul className="nav-list">
              <li>
                <a href="#about" className="nav-link" onClick={e => handleNavClick(e, '#about')}>
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="nav-link" onClick={e => handleNavClick(e, '#services')}>
                  Services
                </a>
              </li>
              <li>
                <a href="#projects" className="nav-link" onClick={e => handleNavClick(e, '#projects')}>
                  Projects
                </a>
              </li>
              <li>
                <a href="#clients" className="nav-link" onClick={e => handleNavClick(e, '#clients')}>
                  Clients
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link" onClick={e => handleNavClick(e, '#contact')}>
                  Contact
                </a>
              </li>
              <li>
                <a href="/Fathi Mohamed Fahim.pdf" className="nav-link cv-link" download onClick={closeMenu}>
                  CV
                </a>
              </li>
            </ul>
          </nav>

          <button
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          <button
            className={`nav-toggle${menuOpen ? ' active' : ''}`}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
