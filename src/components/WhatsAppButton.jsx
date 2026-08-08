import { FaWhatsapp } from 'react-icons/fa'
import { contact } from '../data/site'

function WhatsAppButton() {
  return (
    <a
      href={contact.whatsappFloatLink}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  )
}

export default WhatsAppButton
