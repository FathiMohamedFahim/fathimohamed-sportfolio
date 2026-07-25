import { FaQuoteLeft } from 'react-icons/fa'
import { testimonials } from '../data/projects'

function Testimonials() {
  return (
    <section className="clients section fade-in" id="clients">
      <div className="container">
        <span className="section-eyebrow">Trusted By</span>
        <h2 className="section-title">Client Feedback</h2>
        <p className="section-subtitle">
          What people I've worked with have to say
        </p>

        <div className="clients-grid">
          {testimonials.map(t => (
            <div className="client-card" key={t.id}>
              <FaQuoteLeft className="client-quote-icon" />
              <p className="client-quote">{t.quote}</p>
              <span className="client-name">— {t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
