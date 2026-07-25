import { useState } from 'react'
import {
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaLinkedin,
  FaBehance,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(false)

    try {
      const fd = new FormData(e.target)
      const response = await fetch('https://formspree.io/f/xanbjkkb', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitted(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
  }

  return (
    <section className="contact section fade-in" id="contact">
      <div className="container">
        <span className="section-eyebrow">Get In Touch</span>
        <h2 className="section-title">Contact Me</h2>
        <p className="section-subtitle">Let's work together</p>

        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-method">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div>
                <h3>Email</h3>
                <p>
                  <a href="mailto:fathimohamedfahim@gmail.com">
                    <div className="Mail-Large">fathimohamedfahim@gmail.com</div>
                    <div className="Mail-Small">Mail-Me</div>
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <FaWhatsapp />
              </div>
              <div>
                <h3>Whatsapp</h3>
                <p>
                  <a href="https://wa.me/201032622074">+20 103 262 2074</a>
                </p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3>Location</h3>
                <p>Kafr El-Shaikh, Egypt</p>
              </div>
            </div>

            <div className="social-icons contact-social">
              <a
                href="https://www.linkedin.com/in/fathi-mohamed-fahim-15a593313/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.behance.net/fathimohamedfahim"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance Profile"
              >
                <FaBehance />
              </a>
              <a
                href="https://www.instagram.com/fathi_mohamed_fahim"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
              >
                <FaInstagram />
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

          <div className="contact-form-container">
            <form
              id="contactForm"
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="Project Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Tell me about your project or inquiry"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>

              {submitted && (
                <p style={{ color: '#00ffb2', marginTop: '10px' }}>
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {error && (
                <p style={{ color: '#ff8a8a', marginTop: '10px' }}>
                  حصلت مشكلة، حاول تاني 🙁
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
