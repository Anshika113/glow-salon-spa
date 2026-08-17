import { business, whatsappLink } from '../data.js'
import BookingForm from './BookingForm.jsx'
import Reveal from './Reveal.jsx'

/**
 * The conversion block, shared by the home page and the contact page so both
 * offer exactly the same booking flow.
 */
export default function BookingSection({
  no = '07',
  title = 'Ready for your glow?',
  lede = 'Tell us what you’d like and when suits you. We’ll come back to confirm your slot — usually within the hour we’re open.',
  initialService = '',
}) {
  return (
    <section className="section section--sand" id="book">
      <div className="container">
        <div className="book">
          <Reveal className="book__aside">
            <p className="shead__no">{no}</p>
            <h2>{title}</h2>
            <p className="lede">{lede}</p>

            <div className="book__alt">
              <div className="book__alt-row">
                <span>Prefer to talk</span>
                <a className="alink" href={`tel:${business.phone}`}>
                  {business.phoneDisplay}
                </a>
              </div>
              <div className="book__alt-row">
                <span>Quick questions</span>
                <a className="alink" href={whatsappLink()} target="_blank" rel="noreferrer">
                  WhatsApp us <span className="arw" aria-hidden="true">→</span>
                </a>
              </div>
              <div className="book__alt-row">
                <span>Opening hours</span>
                <span style={{ color: 'var(--ink)' }}>{business.hours}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <BookingForm initialService={initialService} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
