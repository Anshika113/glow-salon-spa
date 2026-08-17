import { business, whatsappLink } from '../data.js'
import Reveal from './Reveal.jsx'

/**
 * Address, phone, hours and map — everything needed to actually turn up.
 * Shared by the home page and the contact page.
 */
export default function FindUs({ no = '08' }) {
  return (
    <section className="section" id="find">
      <div className="container">
        <div className="shead">
          <div>
            <p className="shead__no">{no}</p>
            <h2>Find your Glow.</h2>
          </div>
          <div className="shead__aside">
            <p>{business.area} — open every day of the week.</p>
          </div>
        </div>

        <div className="find">
          <Reveal>
            <dl className="dl">
              <div className="dl__row">
                <dt>Address</dt>
                <dd>{business.address}</dd>
              </div>
              <div className="dl__row">
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
                </dd>
              </div>
              <div className="dl__row">
                <dt>WhatsApp</dt>
                <dd>
                  <a href={whatsappLink()} target="_blank" rel="noreferrer">
                    Message us
                  </a>
                </dd>
              </div>
              <div className="dl__row">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </dd>
              </div>
              <div className="dl__row">
                <dt>Opening hours</dt>
                <dd>{business.hours}</dd>
              </div>
            </dl>

            <a
              className="btn btn--ghost"
              href={business.mapLink}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: '1.8rem' }}
            >
              Get directions <span className="arw" aria-hidden="true">→</span>
            </a>
          </Reveal>

          <Reveal className="map" delay={80}>
            <iframe
              title={`Map to ${business.name}`}
              src={business.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
