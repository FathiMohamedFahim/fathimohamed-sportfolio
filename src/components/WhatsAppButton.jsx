import { contact } from '../data/site'

function WhatsAppButton() {
  return (
    <a
      href={contact.whatsappFloatLink}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
      />
    </a>
  )
}

export default WhatsAppButton
