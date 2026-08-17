import { useSearchParams } from 'react-router-dom'
import { services } from '../data.js'
import BookingSection from '../components/BookingSection.jsx'
import FindUs from '../components/FindUs.jsx'

export default function Contact() {
  const [params] = useSearchParams()

  // "Book this service →" links arrive as ?service=…; only accept a value that
  // matches a real service on the menu.
  const requested = params.get('service') || ''
  const preset = services.some((s) => s.title === requested) ? requested : ''

  return (
    <>
      <section className="phead">
        <div className="container phead__inner">
          <div>
            <p className="eyebrow">Contact &amp; booking</p>
            <h1>
              Let’s get you <span className="serif-em">booked in.</span>
            </h1>
          </div>
          <p className="lede">
            Request an appointment below, message us on WhatsApp, or just drop by — we’d love to
            see you.
          </p>
        </div>
      </section>

      <BookingSection
        no="01"
        title="Request an appointment."
        lede="Choose a service and the date and time you’d prefer. We’ll confirm the slot with you on WhatsApp or by phone."
        initialService={preset}
      />

      <FindUs no="02" />
    </>
  )
}
