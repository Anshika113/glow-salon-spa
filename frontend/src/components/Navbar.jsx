import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { business, serviceCategories } from '../data.js'

const links = [
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  // Transparent over the home hero, solid everywhere else and once scrolled.
  const solid = scrolled || open || pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the sheet on navigation, and lock the page behind it while it's open.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={`nav ${solid ? 'is-solid' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="brand" aria-label={`${business.name} — home`}>
            <span className="brand__mark">{business.wordmark}</span>
            <span className="brand__sub">{business.wordmarkSub}</span>
          </Link>

          <nav className="nav__primary" aria-label="Primary">
            <ul className="nav__links">
              <li className="nav__item">
                <NavLink
                  to="/services"
                  className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                >
                  Services
                  <svg
                    className="nav__caret"
                    viewBox="0 0 10 6"
                    width="8"
                    height="5"
                    aria-hidden="true"
                  >
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </NavLink>
                <ul className="nav__panel">
                  {serviceCategories.map((c) => (
                    <li key={c.id}>
                      <Link to={`/services#${c.id}`}>
                        <strong>{c.label}</strong>
                        <span>{c.blurb}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {links.slice(1).map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__right">
            <Link className="btn btn--sm btn--primary" to="/contact#book">
              Book appointment <span className="arw" aria-hidden="true">→</span>
            </Link>
          </div>

          <button
            className={`nav__toggle ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="menu-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div id="menu-sheet" className={`sheet ${open ? 'is-open' : ''}`} hidden={!open}>
        <ul className="sheet__links">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>
                {l.label}
                <span className="arw" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
          {serviceCategories.map((c) => (
            <li className="is-sub" key={c.id}>
              <Link to={`/services#${c.id}`}>{c.label}</Link>
            </li>
          ))}
        </ul>

        <div className="sheet__foot">
          <Link className="btn btn--primary" to="/contact#book">
            Book appointment <span className="arw" aria-hidden="true">→</span>
          </Link>
          <div className="sheet__meta">
            <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
            <span>{business.area}</span>
            <span>{business.hours}</span>
          </div>
        </div>
      </div>
    </>
  )
}
