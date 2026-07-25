import { useState, useMemo } from 'react'
import { FaExternalLinkAlt, FaSearchPlus } from 'react-icons/fa'
import { projects } from '../data/projects'
import Lightbox from './Lightbox'

function Projects() {
  const filters = useMemo(() => {
    const seen = new Map()
    seen.set('all', 'All')
    projects.forEach(p => {
      if (!seen.has(p.category)) seen.set(p.category, p.categoryLabel)
    })
    return Array.from(seen, ([value, label]) => ({ value, label }))
  }, [])

  const [activeFilter, setActiveFilter] = useState('all')
  const [hidingCards, setHidingCards] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)

  function handleFilter(value) {
    if (value === activeFilter) return

    const toHide = projects
      .filter(p => value !== 'all' && p.category !== value)
      .map(p => p.id)

    setHidingCards(toHide)

    setTimeout(() => {
      setActiveFilter(value)
      setHidingCards([])
    }, 300)
  }

  const visibleProjects = projects.filter(
    p => activeFilter === 'all' || p.category === activeFilter
  )

  function openLightbox(project) {
    const idx = visibleProjects.findIndex(p => p.id === project.id)
    setActiveIndex(idx)
  }

  function closeLightbox() {
    setActiveIndex(null)
  }

  function showPrev() {
    setActiveIndex(i => (i - 1 + visibleProjects.length) % visibleProjects.length)
  }

  function showNext() {
    setActiveIndex(i => (i + 1) % visibleProjects.length)
  }

  return (
    <section className="projects section fade-in" id="projects">
      <div className="container">
        <span className="section-eyebrow">Selected Work</span>
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Recent design work — click any piece to view it full-size</p>

        <div className="project-filters">
          {filters.map(f => (
            <button
              key={f.value}
              className={`filter-btn${activeFilter === f.value ? ' active' : ''}`}
              data-filter={f.value}
              onClick={() => handleFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {projects.map(project => {
            const isHiding = hidingCards.includes(project.id)
            const isHidden =
              activeFilter !== 'all' && project.category !== activeFilter && !isHiding

            if (isHidden) return null

            return (
              <div
                key={project.id}
                className="project-card"
                data-category={project.category}
                style={{
                  opacity: isHiding ? 0 : 1,
                  transform: isHiding ? 'translateY(20px)' : 'translateY(0)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                <div className="project-image" onClick={() => openLightbox(project)}>
                  <img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" />
                  {project.images.length > 1 && (
                    <span className="project-image-count">1 / {project.images.length}</span>
                  )}
                  <div className="project-image-overlay">
                    <span>
                      <FaSearchPlus /> View
                    </span>
                  </div>
                </div>
                <div className="project-content">
                  <span className="project-category">{project.categoryLabel}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  {project.tools && (
                    <div className="project-tools">
                      {project.tools.map(tool => (
                        <span className="project-tool-tag" key={tool}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && project.link !== '#' && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                    >
                      View on Behance <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="projects-cta">
          <p>Working on something similar?</p>
          <a
            href="#contact"
            className="btn btn-primary"
            onClick={e => {
              e.preventDefault()
              const target = document.querySelector('#contact')
              const headerHeight = document.querySelector('header').offsetHeight
              window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' })
            }}
          >
            Let's Talk
          </a>
        </div>

        <div className="projects-cta">
          <p>Working on something similar?</p>
          <a
            href="#contact"
            className="btn btn-primary"
            onClick={e => {
              e.preventDefault()
              const target = document.querySelector('#contact')
              const headerHeight = document.querySelector('header').offsetHeight
              window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' })
            }}
          >
            Let's Talk
          </a>
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox
          project={visibleProjects[activeIndex]}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </section>
  )
}

export default Projects
