import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import {
  FaBehance,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaGithub,
  FaChevronDown,
} from 'react-icons/fa'
import { projects } from '../data/projects'

// Flip this to false when you're not taking new projects.
const AVAILABLE_FOR_WORK = true

function Hero() {
  const typedRef = useRef(null)
  const typedInstanceRef = useRef(null)

  useEffect(() => {
    typedInstanceRef.current = new Typed(typedRef.current, {
      strings: ["Fathi Mohamed"],
      typeSpeed: 55,
      backSpeed: 20,
      showCursor: true,
      cursorChar: '|',
      loop: false,
    })
    return () => {
      typedInstanceRef.current.destroy()
    }
  }, [])

  function scrollToId(id) {
    const target = document.querySelector(`#${id}`)
    if (target) {
      const headerHeight = document.querySelector('header').offsetHeight
      window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' })
    }
  }

  const preview = projects.slice(0, 3)

  return (
    <section className="hero-section fade-in" id="home">
      <div className="container no-fade">
        <div className="hero-content">
          <span className="hero-eyebrow">Graphic Designer &middot; Egypt</span>
          {AVAILABLE_FOR_WORK && (
            <span className="availability-badge">
              <span className="availability-dot"></span>
              Available for new projects
            </span>
          )}
          <h1 className="hero-title">
            <span ref={typedRef}></span>
          </h1>
          <h2 className="hero-subtitle">Visual identity, social media &amp; print design</h2>
          <p className="hero-description">
            I design advertising campaigns, social media content, book covers and brand
            visuals that get noticed — turning a brief into something people actually stop
            and look at.
          </p>

          <div className="hero-cta">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={e => {
                e.preventDefault()
                scrollToId('projects')
              }}
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="btn btn-secondary"
              onClick={e => {
                e.preventDefault()
                scrollToId('contact')
              }}
            >
              Let's Connect
            </a>
          </div>

          <div className="social-icons">
            <a
              href="https://www.behance.net/fathimohamedfahim"
              target="_blank"
              rel="noreferrer"
              aria-label="Behance Profile"
            >
              <FaBehance />
            </a>
            <a
              href="https://www.instagram.com/fathi.mohamed.fahim"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Profile"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/fathi-mohamed-fahim-15a593313/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.facebook.com/fathi.mohamed.fahim"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Profile"
            >
              <FaFacebook />
            </a>
            <a
              href="https://github.com/FathiMohamedFahim"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          {preview.map((p, i) => (
            <div className={`hero-visual-card card-${i + 1}`} key={p.id}>
              <img src={p.images[0].src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-indicator">
        <a
          href="#services"
          aria-label="Scroll down to services section"
          onClick={e => {
            e.preventDefault()
            scrollToId('services')
          }}
        >
          <FaChevronDown />
        </a>
      </div>
    </section>
  )
}

export default Hero
