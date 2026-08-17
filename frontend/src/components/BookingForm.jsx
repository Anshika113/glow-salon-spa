import { useState } from 'react'
import { services, timePreferences, whatsappLink, appointmentMessage } from '../data.js'
import { submitContact } from '../api.js'

const empty = { name: '', phone: '', email: '', service: '', date: '', time: '', message: '' }

// Today in the YYYY-MM-DD shape <input type="date"> expects, in local time.
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/**
 * Appointment request form.
 *
 * The salon has no real-time availability system, so this deliberately asks for
 * a *preferred* date and time and is labelled "Request an appointment" — no slot
 * is ever shown as confirmed or available. The request is POSTed to the existing
 * /api/contact endpoint (unchanged): the date, time and notes are folded into
 * the `message` field that the Worker and D1 schema already store, so nothing on
 * the backend had to change.
 *
 * `initialService` lets a "Book this service" link arrive with the menu preset.
 */
export default function BookingForm({ initialService = '' }) {
  const [form, setForm] = useState({ ...empty, service: initialService })
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const [errors, setErrors] = useState({})

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const composed = () => {
    const parts = []
    if (form.service) parts.push(`Service: ${form.service}`)
    if (form.date) parts.push(`Preferred date: ${form.date}`)
    if (form.time) parts.push(`Preferred time: ${form.time}`)
    if (form.message) parts.push(`Notes: ${form.message}`)
    return parts.length
      ? `Appointment request.\n${parts.join('\n')}`
      : 'Appointment request — please get in touch to confirm a time.'
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ state: 'loading', msg: '' })
    setErrors({})
    try {
      const res = await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        message: composed(),
      })
      setStatus({ state: 'success', msg: res.message })
      setForm({ ...empty, service: initialService })
    } catch (err) {
      setErrors(err.fieldErrors || {})
      setStatus({ state: 'error', msg: err.message })
    }
  }

  const busy = status.state === 'loading'
  const err = (field) =>
    errors[field] ? { 'aria-invalid': 'true', 'aria-describedby': `${field}-err` } : {}

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {status.state === 'success' && (
        <p className="alert alert--ok" role="status">
          {status.msg}
        </p>
      )}
      {status.state === 'error' && (
        <p className="alert alert--err" role="alert">
          {status.msg}
        </p>
      )}

      <div className="form__grid">
        <div className="field field--wide">
          <label htmlFor="bf-service">Service</label>
          <select id="bf-service" name="service" value={form.service} onChange={update}>
            <option value="">Choose a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title} — {s.price}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="bf-date">Preferred date</label>
          <input id="bf-date" name="date" type="date" min={today()} value={form.date} onChange={update} />
        </div>

        <div className="field">
          <label htmlFor="bf-time">Preferred time</label>
          <select id="bf-time" name="time" value={form.time} onChange={update}>
            <option value="">No preference</option>
            {timePreferences.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="bf-name">Name *</label>
          <input
            id="bf-name"
            name="name"
            value={form.name}
            onChange={update}
            autoComplete="name"
            {...err('name')}
          />
          {errors.name && (
            <small className="err" id="name-err">
              {errors.name}
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="bf-phone">Phone *</label>
          <input
            id="bf-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={update}
            autoComplete="tel"
            placeholder="98765 43210"
            {...err('phone')}
          />
          {errors.phone && (
            <small className="err" id="phone-err">
              {errors.phone}
            </small>
          )}
        </div>

        <div className="field field--wide">
          <label htmlFor="bf-email">Email (optional)</label>
          <input
            id="bf-email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            autoComplete="email"
            placeholder="you@example.com"
            {...err('email')}
          />
          {errors.email && (
            <small className="err" id="email-err">
              {errors.email}
            </small>
          )}
        </div>

        <div className="field field--wide">
          <label htmlFor="bf-message">Anything we should know?</label>
          <textarea
            id="bf-message"
            name="message"
            rows="3"
            value={form.message}
            onChange={update}
            placeholder="Hair length, occasion, a stylist you've seen before…"
          />
          {errors.message && (
            <small className="err" id="message-err">
              {errors.message}
            </small>
          )}
        </div>
      </div>

      <div className="form__foot">
        <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Request an appointment'}
          {!busy && (
            <span className="arw" aria-hidden="true">
              →
            </span>
          )}
        </button>
        <a
          className="btn btn--ghost btn--block"
          href={whatsappLink(appointmentMessage(form))}
          target="_blank"
          rel="noreferrer"
        >
          Send on WhatsApp instead
        </a>
        <p className="form__note">
          We’ll confirm your slot on WhatsApp or by phone — a request doesn’t reserve the time yet.
        </p>
      </div>
    </form>
  )
}
