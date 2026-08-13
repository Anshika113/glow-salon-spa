import { business, whatsappLink } from '../data.js'

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About us</span>
          <h1>Where beauty meets calm</h1>
          <p>{business.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about">
          <div className="about__text">
            <h2>Our story</h2>
            <p>
              {business.name} began with a simple idea: make great grooming feel effortless and
              relaxing. What started as a small neighbourhood studio has grown into a favourite spot
              for hair, skin, beauty and spa care in Bandra.
            </p>
            <p>
              Every treatment is delivered by trained professionals using quality products, in a
              spotless, welcoming space. Whether you’re here for a quick trim or a full day of
              pampering, we treat every guest like family.
            </p>

            <h2>Why clients choose us</h2>
            <ul className="ticks">
              <li>Experienced, friendly stylists and therapists</li>
              <li>Hygienic, sanitised tools and a clean environment</li>
              <li>Honest advice — no upselling</li>
              <li>Easy WhatsApp booking and flexible timings</li>
              <li>Premium, skin-friendly products</li>
            </ul>

            <div className="hero__actions">
              <a className="btn btn--primary" href={whatsappLink()} target="_blank" rel="noreferrer">
                Book on WhatsApp
              </a>
            </div>
          </div>

          <aside className="about__side card">
            <h3>At a glance</h3>
            <dl className="stats">
              <div><dt>15+</dt><dd>years of experience</dd></div>
              <div><dt>500+</dt><dd>happy clients</dd></div>
              <div><dt>4.9★</dt><dd>average rating</dd></div>
              <div><dt>7 days</dt><dd>open every week</dd></div>
            </dl>
            <p className="footer__muted">{business.hours}</p>
            <p className="footer__muted">{business.address}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
