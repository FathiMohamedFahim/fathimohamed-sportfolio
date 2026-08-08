import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa'
import { testimonials } from '../data/projects'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

function Lightbox({ project, onClose, onPrev, onNext }) {
  const [imageIndex, setImageIndex] = useState(0)
  const { lock, unlock } = useBodyScrollLock()

  // Reset to the first image whenever a different project is opened.
  useEffect(() => {
    setImageIndex(0)
  }, [project])

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  // Locked once for the lifetime of the lightbox being open (mount to
  // unmount), deliberately independent of handleKeyDown's identity below —
  // that changes on every onPrev/onNext navigation since the parent doesn't
  // memoize those callbacks, and re-running a position:fixed lock/unlock on
  // every image change would visibly flash the page each time.
  useEffect(() => {
    lock()
    return unlock
  }, [lock, unlock])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  if (!project) return null

  const activeImage = project.images[imageIndex]
  const clientTestimonial = project.client
    ? testimonials.find(t => t.name === project.client)
    : null

  return createPortal(
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
        <button className="lightbox-nav prev" onClick={onPrev} aria-label="Previous project">
          <FaChevronLeft />
        </button>
        <img src={activeImage.src} alt={activeImage.alt} />
        <button className="lightbox-nav next" onClick={onNext} aria-label="Next project">
          <FaChevronRight />
        </button>

        {project.images.length > 1 && (
          <div className="lightbox-thumbs">
            {project.images.map((img, i) => (
              <button
                key={img.src}
                className={`lightbox-thumb${i === imageIndex ? ' active' : ''}`}
                onClick={() => setImageIndex(i)}
                aria-label={img.label}
              >
                <img src={img.src} alt="" />
              </button>
            ))}
          </div>
        )}

        <div className="lightbox-caption">
          <h3>{project.title}</h3>
          <p>{activeImage.label ? `${activeImage.label} — ` : ''}{project.description}</p>

          {(project.challenge || project.approach || project.result) && (
            <div className="lightbox-case-study">
              {project.challenge && (
                <div className="case-study-row">
                  <span className="case-study-label">The Ask</span>
                  <p>{project.challenge}</p>
                </div>
              )}
              {project.approach && (
                <div className="case-study-row">
                  <span className="case-study-label">The Approach</span>
                  <p>{project.approach}</p>
                </div>
              )}
              {project.result && (
                <div className="case-study-row">
                  <span className="case-study-label">The Result</span>
                  <p>{project.result}</p>
                </div>
              )}
            </div>
          )}

          {clientTestimonial && (
            <div className="lightbox-testimonial">
              <FaQuoteLeft className="lightbox-testimonial-icon" />
              <p>{clientTestimonial.quote}</p>
              <span>— {clientTestimonial.name}</span>
            </div>
          )}

          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              View full case on Behance &rarr;
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Lightbox
