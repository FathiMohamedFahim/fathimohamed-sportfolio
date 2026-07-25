import { FaLinkedin, FaBehance, FaInstagram, FaGithub, FaFacebook } from 'react-icons/fa'

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
              href="https://www.instagram.com/fathi.mohamed.fahim"
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
            <a
              href="https://www.facebook.com/fathi.mohamed.fahim"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Profile"
            >
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
