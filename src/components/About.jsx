function About() {
  return (
    <section className="about section fade-in" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            <img src="/designs-img/0007-Spero Spathis/0001-Social media design.png" alt="Fathi Mohamed design work" loading="lazy" />
          </div>
          <div className="about-content">
            <span className="section-eyebrow" style={{ textAlign: 'left' }}>
              About Me
            </span>
            <h2 className="about-title">
              Hi, I'm Fathi — I turn briefs into visuals people stop for.
            </h2>
            {/*
              PLACEHOLDER COPY — replace with your real story: how you got into
              design, what you focus on, and what kind of projects you enjoy most.
            */}
            <p className="about-text">
              I'm a graphic designer based in Kafr El-Sheikh, Egypt, working across
              advertising design, social media content, book covers and photo
              manipulation. I care about getting a design to feel finished — clean
              typography, a clear hierarchy, and a visual idea that actually fits the
              brief, not just a template with new colors.
            </p>
            <p className="about-text">
              Add a sentence or two here about the kind of clients or industries
              you'd like to work with next.
            </p>
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-number">5+</span>
                <span className="about-stat-label">Projects Delivered</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">2</span>
                <span className="about-stat-label">Design Categories</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">100%</span>
                <span className="about-stat-label">Client Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
