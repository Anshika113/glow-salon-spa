import { Link } from 'react-router-dom'
import { business } from '../data.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">
            <span className="nav__logo">G</span>
            <span>{business.name}</span>
          </div>
          <p className="footer__muted">{business.tagline}</p>
          <p className="footer__muted">{business.hours}</p>
        </div>

        <div>
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Visit us</h4>
          <p className="footer__muted">{business.address}</p>
          <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <div className="footer__social">
            <a href={business.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={business.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>

      <div className="footer__bar">
        <div className="container">
          <span>© {year} {business.name}. All rights reserved.</span>
          <span className="footer__muted">Starter demo · Website by Your Studio</span>
        </div>
      </div>
    </footer>
  )
}
