import { useScrollToSection } from '../hooks/useScrollToSection'
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
  const scrollToSection = useScrollToSection()

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
            <span className="hero-title-typed">Fathi Mohamed</span>
          </h1>
          <h2 className="hero-subtitle">{hero.subtitle}</h2>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-cta">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={e => {
                e.preventDefault()
                scrollToSection('projects')
              }}
            >
              {hero.primaryCtaText}
            </a>
            <a
              href="#contact"
              className="btn btn-secondary"
              onClick={e => {
                e.preventDefault()
                scrollToSection('contact')
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
            scrollToSection('services')
          }}
        >
          <FaChevronDown />
        </a>
      </div>
    </section>
  )
}

export default Hero
