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
import { hero, social } from '../data/site'

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
          <span className="hero-eyebrow">{hero.eyebrow}</span>
          {hero.availableForWork && (
            <span className="availability-badge">
              <span className="availability-dot"></span>
              {hero.availabilityText}
            </span>
          )}
          <h1 className="hero-title">
            <span ref={typedRef}></span>
          </h1>
          <h2 className="hero-subtitle">{hero.subtitle}</h2>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-cta">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={e => {
                e.preventDefault()
                scrollToId('projects')
              }}
            >
              {hero.primaryCtaText}
            </a>
            <a
              href="#contact"
              className="btn btn-secondary"
              onClick={e => {
                e.preventDefault()
                scrollToId('contact')
              }}
            >
              {hero.secondaryCtaText}
            </a>
          </div>

          <div className="social-icons">
            <a href={social.behance} target="_blank" rel="noreferrer" aria-label="Behance Profile">
              <FaBehance />
            </a>
            <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram Profile">
              <FaInstagram />
            </a>
            <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
              <FaLinkedin />
            </a>
            <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Profile">
              <FaFacebook />
            </a>
            <a href={social.github} target="_blank" rel="noreferrer" aria-label="GitHub Profile">
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
