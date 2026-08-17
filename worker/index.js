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

import { notifyNewEnquiry } from './notify.js';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const now = () => new Date().toISOString();

const s = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());

// Human-quotable reference for requests that never reached a database.
const shortRef = () => 'REQ-' + crypto.randomUUID().slice(0, 6).toUpperCase();

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
  // No database bound means no throttle store; the honeypot still applies.
  if (!env.DB) return false;
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

async function contact(request, env, ctx) {
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

  const createdAt = now();

  // Storing is best-effort. D1 is optional: bind it and every request is kept
  // as a record, or leave it off entirely and run on notifications alone.
  let id = null;
  if (env.DB) {
    try {
      const res = await env.DB.prepare(
        `INSERT INTO enquiries (name, email, phone, service, message, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind(f.name, f.email, f.phone, f.service, f.message, createdAt)
        .run();
      id = res.meta.last_row_id;
    } catch (err) {
      // Don't lose the booking over a database problem — fall through and let
      // the notification carry it instead.
      console.error('could not store enquiry:', err && err.stack ? err.stack : err);
    }
  }

  const stored = id !== null;
  const enquiry = {
    ...f,
    id,
    stored,
    ref: stored ? `#${id}` : shortRef(),
    created_at: createdAt,
  };

  if (stored) {
    // Safely on disk — alert the salon in the background so a slow mail
    // provider can't delay the customer's response.
    const notifying = notifyNewEnquiry(enquiry, env).catch((err) =>
      console.error('notification error:', err && err.stack ? err.stack : err)
    );
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(notifying);
  } else {
    // Nothing was written, so the notification is the only copy of this
    // booking. Wait for it, and only claim success if it actually went out.
    const delivered = await notifyNewEnquiry(enquiry, env).catch((err) => {
      console.error('notification error:', err && err.stack ? err.stack : err);
      return false;
    });

    if (!delivered) {
      console.error(`enquiry ${enquiry.ref} LOST — nothing stored and no notification delivered`);
      return json(
        {
          ok: false,
          message:
            "Sorry — we couldn't get your request through just now. Please message us on WhatsApp or give us a call and we'll book you straight in.",
        },
        503
      );
    }
  }

  return json(
    {
      ok: true,
      id,
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
  if (!env.DB) {
    return json(
      {
        ok: false,
        message:
          'No database is bound, so enquiries are not being stored — they are delivered by notification only.',
      },
      501
    );
  }
  const { results } = await env.DB.prepare(
    'SELECT * FROM enquiries ORDER BY id DESC LIMIT 200'
  ).all();
  return json({ count: results.length, enquiries: results });
}

// --- Entry point ------------------------------------------------------------

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const method = request.method.toUpperCase();

    try {
      if (pathname === '/api/health' && method === 'GET') {
        return json({ status: 'ok', service: 'glow-salon-spa', time: now() });
      }
      if (pathname === '/api/contact' && method === 'POST') return contact(request, env, ctx);
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
