import { FaLinkedin, FaBehance, FaInstagram, FaGithub, FaFacebook } from 'react-icons/fa'
import { social } from '../data/site'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer no-fade">
      <div className="container no-fade">
        <div className="footer-content no-fade">
          <div className="footer-logo no-fade">
            <img src="/images/logo.png" alt="Fathi Mohamed Logo" />
          </div>

          <div className="footer-info no-fade">
            <p>
              &copy; <span id="currentYear">{currentYear}</span> Fathi Mohamed. All Rights Reserved.
            </p>
            <p className="no-fade">Graphic Designer</p>
          </div>

          <div className="footer-social no-fade">
            <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
              <FaLinkedin />
            </a>
            <a href={social.behance} target="_blank" rel="noreferrer" aria-label="Behance Profile">
              <FaBehance />
            </a>
            <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram Profile">
              <FaInstagram />
            </a>
            <a href={social.github} target="_blank" rel="noreferrer" aria-label="GitHub Profile">
              <FaGithub />
            </a>
            <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Profile">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
