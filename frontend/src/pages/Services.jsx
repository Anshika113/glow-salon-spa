import { Link } from 'react-router-dom'
import { services, whatsappLink } from '../data.js'

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Our menu</span>
          <h1>Services &amp; Pricing</h1>
          <p>
            Indicative starting prices — final pricing depends on hair length, products and the
            treatment chosen. Ask us on WhatsApp for a quick, no-obligation quote.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {services.map((s, i) => (
              <article className="card service" key={s.title}>
                <span className="service__no">{String(i + 1).padStart(2, '0')}</span>
                <div className="service__icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service__foot">
                  <span className="service__price">{s.price}</span>
                  <a
                    className="btn btn--sm btn--primary"
                    href={whatsappLink(`Hi, I'd like to book: ${s.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Book
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="section__cta">
            <p className="section__lead">Have something specific in mind?</p>
            <Link className="btn btn--dark" to="/contact">Send us an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  )
}
