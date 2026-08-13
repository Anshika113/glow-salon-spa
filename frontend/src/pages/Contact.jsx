import { useState } from 'react'
import { business, services, whatsappLink } from '../data.js'
import { submitContact } from '../api.js'

const empty = { name: '', email: '', phone: '', service: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const [errors, setErrors] = useState({})

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ state: 'loading', msg: '' })
    setErrors({})
    try {
      const res = await submitContact(form)
      setStatus({ state: 'success', msg: res.message })
      setForm(empty)
    } catch (err) {
      setErrors(err.fieldErrors || {})
      setStatus({ state: 'error', msg: err.message })
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Get in touch</span>
          <h1>Contact & Booking</h1>
          <p>Send us an enquiry, message us on WhatsApp, or just drop by — we’d love to see you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact">
          {/* Form */}
          <div className="card contact__form">
            <h2>Send an enquiry</h2>

            {status.state === 'success' && (
              <div className="alert alert--ok">{status.msg}</div>
            )}
            {status.state === 'error' && (
              <div className="alert alert--err">{status.msg}</div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Name *</label>
                <input id="name" name="name" value={form.name} onChange={update} placeholder="Your name" />
                {errors.name && <small className="err">{errors.name}</small>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="phone">Phone *</label>
                  <input id="phone" name="phone" value={form.phone} onChange={update} placeholder="e.g. 98765 43210" />
                  {errors.phone && <small className="err">{errors.phone}</small>}
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" />
                  {errors.email && <small className="err">{errors.email}</small>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="service">Service</label>
                <select id="service" name="service" value={form.service} onChange={update}>
                  <option value="">Select a service (optional)</option>
                  {services.map((s) => (
                    <option key={s.title} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" rows="4" value={form.message} onChange={update} placeholder="How can we help?" />
                {errors.message && <small className="err">{errors.message}</small>}
              </div>

              <button className="btn btn--primary" type="submit" disabled={status.state === 'loading'}>
                {status.state === 'loading' ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          </div>

          {/* Details + map */}
          <aside className="contact__info">
            <div className="card">
              <h3>Visit us</h3>
              <p className="footer__muted">{business.address}</p>
              <ul className="contact__list">
                <li><a href={`tel:${business.phone}`}>📞 {business.phoneDisplay}</a></li>
                <li><a href={whatsappLink()} target="_blank" rel="noreferrer">💬 Chat on WhatsApp</a></li>
                <li><a href={`mailto:${business.email}`}>✉️ {business.email}</a></li>
                <li>🕒 {business.hours}</li>
              </ul>
            </div>

            <div className="card map-card">
              <iframe
                title="Map to Glow Salon & Spa"
                src={business.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a className="btn btn--sm btn--ghost" href={business.mapLink} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
