/**
 * Evara Events & Weddings — API Worker.
 *
 * Replaces backend/app.py. Same routes and response shapes, so the React
 * frontend works unchanged (api.js falls back to API_BASE = '/api').
 *
 * Storage is D1 (binding: DB) instead of a local SQLite file.
 * Static assets are served by Cloudflare directly; this Worker only runs for
 * /api/* (see run_worker_first in wrangler.jsonc).
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const now = () => new Date().toISOString();

const s = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());

async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

// --- Route handlers ---------------------------------------------------------

async function enquiry(request, env) {
  const b = await readJson(request);
  const f = {
    name: s(b.name),
    email: s(b.email),
    phone: s(b.phone),
    event_type: s(b.event_type),
    event_date: s(b.event_date),
    guests: s(b.guests),
    budget: s(b.budget),
    message: s(b.message),
    source: s(b.source) || 'website',
  };

  const errors = {};
  if (!f.name) errors.name = 'Please enter your name.';
  if (!f.phone) errors.phone = 'Please enter a phone number.';
  else if (f.phone.replace(/\D/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
  if (f.email && !EMAIL_RE.test(f.email)) errors.email = 'Please enter a valid email address.';
  if (!f.message) errors.message = 'Please tell us a little about your event.';

  if (Object.keys(errors).length) {
    return json({ ok: false, errors, message: 'Please check the highlighted fields.' }, 400);
  }

  const res = await env.DB.prepare(
    `INSERT INTO leads
       (name, email, phone, event_type, event_date, guests, budget, message, source, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      f.name, f.email, f.phone, f.event_type, f.event_date,
      f.guests, f.budget, f.message, f.source, now()
    )
    .run();

  return json(
    {
      ok: true,
      id: res.meta.last_row_id,
      message: 'Thank you! Our events team will get back to you within 24 hours.',
    },
    201
  );
}

async function subscribe(request, env) {
  const email = s((await readJson(request)).email);
  if (!EMAIL_RE.test(email)) {
    return json(
      { ok: false, errors: { email: 'Please enter a valid email.' }, message: 'Please enter a valid email.' },
      400
    );
  }

  // INSERT OR IGNORE => re-subscribing is a no-op, not an error.
  await env.DB.prepare('INSERT OR IGNORE INTO subscribers (email, created_at) VALUES (?, ?)')
    .bind(email, now())
    .run();

  return json({ ok: true, message: "You're subscribed — thank you!" });
}

async function listLeads(request, env) {
  // Returns every captured lead — gate it behind ADMIN_TOKEN if the secret is set.
  if (env.ADMIN_TOKEN) {
    const auth = request.headers.get('Authorization') || '';
    if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
      return json({ ok: false, message: 'Unauthorized' }, 401);
    }
  }
  const { results } = await env.DB.prepare(
    'SELECT * FROM leads ORDER BY id DESC LIMIT 200'
  ).all();
  return json({ count: results.length, leads: results });
}

// --- Entry point ------------------------------------------------------------

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const method = request.method.toUpperCase();

    try {
      if (pathname === '/api/health' && method === 'GET') {
        return json({ status: 'ok', service: 'evara-events', time: now() });
      }
      if (pathname === '/api/enquiry' && method === 'POST') return enquiry(request, env);
      if (pathname === '/api/subscribe' && method === 'POST') return subscribe(request, env);
      if (pathname === '/api/leads' && method === 'GET') return listLeads(request, env);

      if (pathname.startsWith('/api/')) {
        return json({ ok: false, message: 'Not found' }, 404);
      }

      return env.ASSETS.fetch(request);
    } catch (err) {
      console.error('API error:', err && err.stack ? err.stack : err);
      return json({ ok: false, message: 'Something went wrong. Please try again.' }, 500);
    }
  },
};