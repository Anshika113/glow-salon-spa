import { Link } from 'react-router-dom'
import { business, whatsappLink } from '../data.js'

const WhatsAppIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.8.9 3.8 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.9.9.9-4.8-.2-.4C5.5 18 5 16.5 5 15c0-6 4.9-10.9 11-10.9S27 9 27 15s-4.9 10.8-11 10.8zm6.1-8.1c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1 1.3c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6s-.8-1.9-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-1.2 1.3-1.6 2.6-1.5 4.2.4 3.9 3.8 6.5 5.3 7.2 2.3 1 3.2.9 4.2.8.9-.1 2-.9 2.3-1.7.3-.9.3-1.6.2-1.7-.1-.2-.3-.2-.6-.4z" />
  </svg>
)

const PhoneIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
  </svg>
)

const CalendarIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M7 2v2H5.5A2.5 2.5 0 0 0 3 6.5v13A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 18.5 4H17V2h-2v2H9V2H7zM5 9h14v10.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V9z" />
  </svg>
)

/**
 * Two conversion surfaces, each on the viewport where it belongs:
 *
 *   • Desktop / tablet — a single WhatsApp button, bottom right, with a
 *     hover tooltip offering help choosing a service.
 *   • Mobile — a fixed Call · WhatsApp · Book bar. `body` reserves matching
 *     bottom padding in styles.css so it never covers page content.
 */
export default function FloatingButtons() {
  const chatLink = whatsappLink(
    "Hi Glow Salon & Spa, I'd like some help choosing a service.",
  )

  return (
    <>
      <a
        className="fab"
        href={chatLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon />
        <span>WhatsApp</span>
        <span className="fab__tip" role="tooltip">
          Need help choosing a service?
        </span>
      </a>

      <nav className="mbar" aria-label="Quick actions">
        <a href={`tel:${business.phone}`}>
          <PhoneIcon />
          Call
        </a>
        <a href={whatsappLink()} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
        <Link to="/contact#book">
          <CalendarIcon />
          Book
        </Link>
      </nav>
    </>
  )
}
