import {
  FaBullhorn,
  FaShareAlt,
  FaObjectUngroup,
  FaLightbulb,
  FaShapes,
  FaCameraRetro,
} from 'react-icons/fa'
import { services } from '../data/projects'

const iconMap = {
  bullhorn: <FaBullhorn />,
  'share-alt': <FaShareAlt />,
  'object-ungroup': <FaObjectUngroup />,
  lightbulb: <FaLightbulb />,
  shapes: <FaShapes />,
  'camera-retro': <FaCameraRetro />,
}

function Services() {
  return (
    <section className="services section fade-in" id="services">
      <div className="container">
        <span className="section-eyebrow">What I Do</span>
        <h2 className="section-title">Services</h2>
        <p className="section-subtitle">What I can do for you</p>
        <div className="services-grid">
          {services.map(service => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{iconMap[service.iconClass] || <FaShapes />}</div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
