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

// --- Abuse controls ---------------------------------------------------------

// Max submissions allowed from one IP inside a rolling window.
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 10 * 60;

// Hash the IP so the throttle table never holds a raw address.
async function bucketFor(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fixed-window throttle backed by D1. Returns true when the caller is over the
 * limit. Fails open: if the rate_limit table is missing (an older database that
 * hasn't had schema.sql re-applied) we let the request through rather than
 * block real bookings.
 */
async function isRateLimited(request, env) {
  try {
    const bucket = await bucketFor(request);
    const nowSec = Math.floor(Date.now() / 1000);
    const row = await env.DB.prepare('SELECT hits, window_start FROM rate_limit WHERE bucket = ?')
      .bind(bucket)
      .first();

    if (!row || nowSec - row.window_start >= RATE_WINDOW_SECONDS) {
      await env.DB.prepare(
        `INSERT INTO rate_limit (bucket, hits, window_start) VALUES (?, 1, ?)
         ON CONFLICT(bucket) DO UPDATE SET hits = 1, window_start = excluded.window_start`
      )
        .bind(bucket, nowSec)
        .run();
      return false;
    }

    if (row.hits >= RATE_LIMIT) return true;

    await env.DB.prepare('UPDATE rate_limit SET hits = hits + 1 WHERE bucket = ?').bind(bucket).run();
    return false;
  } catch (err) {
    console.error('rate limit check skipped:', err && err.message ? err.message : err);
    return false;
  }
}

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

  // Honeypot: a field hidden from people but attractive to form-filling bots.
  // Answer 201 so the bot believes it succeeded and doesn't retry differently.
  if (s(b.company)) {
    return json({ ok: true, message: "Thanks! We've received your enquiry and will get back to you shortly." }, 201);
  }

  if (await isRateLimited(request, env)) {
    return json(
      {
        ok: false,
        message:
          "You've sent a few requests already — please give us a little while, or message us on WhatsApp.",
      },
      429
    );
  }

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
