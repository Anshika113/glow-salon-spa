import { Link } from 'react-router-dom'
import { business, services, gallery, testimonials, whatsappLink, heroImages } from '../data.js'
import SmartImage from '../components/SmartImage.jsx'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="eyebrow">Bandra, Mumbai · Est. 2009</span>
            <h1>
              Look good.
              <br />
              <span className="accent">Feel better.</span>
            </h1>
            <p>{business.intro}</p>
            <div className="hero__actions">
              <a className="btn btn--primary" href={whatsappLink()} target="_blank" rel="noreferrer">
                Book on WhatsApp
              </a>
              <Link className="btn btn--ghost" to="/services">
                Explore Services
              </Link>
            </div>
            <div className="hero__meta">
              <div><strong>15+</strong><span>years of care</span></div>
              <div className="hero__meta-div" aria-hidden="true" />
              <div><strong>4.9★</strong><span>500+ reviews</span></div>
              <div className="hero__meta-div" aria-hidden="true" />
              <div><strong>7 days</strong><span>open weekly</span></div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__panel hero__panel--a">
              <SmartImage src={heroImages.main} alt="Inside Glow Salon & Spa" className="hero__img" />
              <span>The Studio</span>
            </div>
            <div className="hero__panel hero__panel--b">
              <SmartImage src={heroImages.secondary} alt="Spa treatment room" className="hero__img" />
              <span>Spa Rooms</span>
            </div>
            <div className="hero__chip">
              <strong>4.9 ★★★★★</strong>
              <span>Rated by 500+ clients</span>
            </div>
            <span className="hero__seal">Since<br />2009</span>
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="section section--tight">
        <div className="container features">
          <div className="feature">
            <span className="feature__ico">✦</span>
            <h3>Calm, clean space</h3>
            <p>A serene, hygienic salon designed entirely around your comfort.</p>
          </div>
          <div className="feature">
            <span className="feature__ico">✦</span>
            <h3>Expert stylists</h3>
            <p>Seasoned professionals who listen and perfect every detail.</p>
          </div>
          <div className="feature">
            <span className="feature__ico">✦</span>
            <h3>Effortless booking</h3>
            <p>One message on WhatsApp and your slot is reserved.</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">What we do</span>
            <h2>A menu made for you</h2>
            <p className="section__lead">
              From a quick refresh to a full day of pampering — every service is tailored to you.
            </p>
          </div>
          <div className="grid grid--3">
            {services.map((s, i) => (
              <article className="card service" key={s.title}>
                <span className="service__no">{String(i + 1).padStart(2, '0')}</span>
                <div className="service__icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service__price">{s.price}</span>
              </article>
            ))}
          </div>
          <div className="section__cta">
            <Link className="btn btn--dark" to="/services">See full price list</Link>
          </div>
        </div>
      </section>

      {/* Editorial band */}
      <section className="editorial">
        <div className="container editorial__inner">
          <span className="editorial__mark" aria-hidden="true">“</span>
          <blockquote>
            Beauty should feel like a pause in your day — unhurried, personal and calm.
          </blockquote>
          <cite>— The {business.name} team</cite>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">A peek inside</span>
            <h2>Our space & work</h2>
          </div>
          <div className="masonry">
            {gallery.slice(0, 6).map((g, i) => (
              <figure
                className={`shot shot--${(i % 3) + 1}`}
                key={g.label}
                style={{ background: `linear-gradient(150deg, ${g.tone[0]}, ${g.tone[1]})` }}
              >
                <SmartImage src={g.img} alt={g.label} className="shot__img" />
                <figcaption>{g.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="section__cta">
            <Link className="btn btn--ghost" to="/gallery">View full gallery</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Kind words</span>
            <h2>Loved by our clients</h2>
          </div>
          <div className="grid grid--3">
            {testimonials.map((t) => (
              <blockquote className="card quote" key={t.name}>
                <span className="quote__stars">★★★★★</span>
                <p>“{t.text}”</p>
                <cite>— {t.name}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container cta-band__inner">
          <span className="eyebrow eyebrow--gold">Your moment awaits</span>
          <h2>Ready for a fresh new look?</h2>
          <p>Book today — we can’t wait to pamper you.</p>
          <div className="hero__actions">
            <a className="btn btn--gold" href={whatsappLink()} target="_blank" rel="noreferrer">
              Book on WhatsApp
            </a>
            <a className="btn btn--outline-light" href={`tel:${business.phone}`}>
              Call {business.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
