// API helper for the contact form.
// In dev, Vite proxies /api -> http://localhost:5000 (see vite.config.js).
// For a separate production host, set VITE_API_URL when building.
const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function submitContact(payload) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong. Please try again.')
    err.fieldErrors = data.errors || {}
    throw err
  }
  return data
}
