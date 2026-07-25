import { about } from '../data/site'

function About() {
  return (
    <section className="about section fade-in" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            <img src={about.image} alt="Fathi Mohamed design work" loading="lazy" />
          </div>
          <div className="about-content">
            <span className="section-eyebrow" style={{ textAlign: 'left' }}>
              About Me
            </span>
            <h2 className="about-title">{about.title}</h2>
            <p className="about-text">{about.bio1}</p>
            <p className="about-text">{about.bio2}</p>
            <div className="about-stats">
              {about.stats.map(stat => (
                <div className="about-stat" key={stat.label}>
                  <span className="about-stat-number">{stat.number}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
