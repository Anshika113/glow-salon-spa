import { Link } from 'react-router-dom'
import { business, serviceCategories, whatsappLink } from '../data.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer on-dark">
      <div className="container">
        <Link to="/" className="footer__word">
          <b>{business.wordmark}</b>
          <span>{business.wordmarkSub}</span>
        </Link>
      </div>

      <div className="container footer__grid">
        <div className="footer__col">
          <h4>Services</h4>
          {serviceCategories.map((c) => (
            <Link key={c.id} to={`/services#${c.id}`}>
              {c.label}
            </Link>
          ))}
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/services">All services</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/contact#book">Book</Link>
        </div>

        <div className="footer__col">
          <h4>Visit us</h4>
          <p>{business.address}</p>
          <p>{business.hours}</p>
          <a
            href={business.mapLink}
            target="_blank"
            rel="noreferrer"
            className="alink"
            style={{ marginTop: '.4rem' }}
          >
            Get directions <span className="arw" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="footer__col">
          <h4>Get in touch</h4>
          <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
          {business.social.instagram && (
            <a href={business.social.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {business.social.facebook && (
            <a href={business.social.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
        </div>
      </div>

      <div className="footer__bar">
        <div className="container">
          <span>
            © {year} {business.name}. All rights reserved.
          </span>
          <span>
            Design &amp; Developed by <a href="tel:8604438328">Anshika</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
