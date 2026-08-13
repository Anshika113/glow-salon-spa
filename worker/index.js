/**
 * Glow Salon & Spa — API Worker.
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

async function contact(request, env) {
  const b = await readJson(request);
  const f = {
    name: s(b.name),
    email: s(b.email),
    phone: s(b.phone),
    service: s(b.service),
    message: s(b.message),
  };

  const errors = {};
  if (!f.name) errors.name = 'Please enter your name.';
  if (!f.phone) errors.phone = 'Please enter a phone number.';
  else if (f.phone.replace(/\D/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
  if (f.email && !EMAIL_RE.test(f.email)) errors.email = 'Please enter a valid email address.';
  if (!f.message) errors.message = 'Please tell us how we can help.';

  if (Object.keys(errors).length) {
    return json({ ok: false, errors, message: 'Please check the highlighted fields.' }, 400);
  }

  const res = await env.DB.prepare(
    `INSERT INTO enquiries (name, email, phone, service, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(f.name, f.email, f.phone, f.service, f.message, now())
    .run();

  return json(
    {
      ok: true,
      id: res.meta.last_row_id,
      message: "Thanks! We've received your enquiry and will get back to you shortly.",
    },
    201
  );
}

async function listEnquiries(request, env) {
  // Returns every captured enquiry — gate it behind ADMIN_TOKEN if the secret is set.
  if (env.ADMIN_TOKEN) {
    const auth = request.headers.get('Authorization') || '';
    if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
      return json({ ok: false, message: 'Unauthorized' }, 401);
    }
  }
  const { results } = await env.DB.prepare(
    'SELECT * FROM enquiries ORDER BY id DESC LIMIT 200'
  ).all();
  return json({ count: results.length, enquiries: results });
}

// --- Entry point ------------------------------------------------------------

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const method = request.method.toUpperCase();

    try {
      if (pathname === '/api/health' && method === 'GET') {
        return json({ status: 'ok', service: 'glow-salon-spa', time: now() });
      }
      if (pathname === '/api/contact' && method === 'POST') return contact(request, env);
      if (pathname === '/api/enquiries' && method === 'GET') return listEnquiries(request, env);

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
