# Glow Salon & Spa

A professional, mobile-friendly **online presence** for a local salon & spa —
built with React, Vite, and Cloudflare Workers.

**Live:** https://glow-salon-spa.anshikami7890.workers.dev/

---

## What this is

| | |
|---|---|
| **Frontend** | React 18 + React Router 6 (Vite 5) |
| **Backend** | Cloudflare Worker (JavaScript) |
| **Database** | Cloudflare D1 (contact enquiries) |
| **Hosting** | Cloudflare Workers — static assets and API in a single deploy |
| **Pages (5)** | Home · About · Services · Gallery · Contact |

The frontend and the API are served from the same origin, so there is no CORS
setup and no `VITE_API_URL` to configure. Static files are served straight from
Cloudflare's edge; the Worker only runs for `/api/*`.

### Features
Responsive design · Professional UI · WhatsApp button · Click-to-call ·
Google Maps · Contact form with server-side validation (saved to D1) ·
Social links · Basic SEO (title, meta description, Open Graph, favicon) ·
Image optimization (lazy-loaded photos with graceful fallback) · SSL by default.

### Not included
Booking/enquiry workflow · service-specific pages · FAQ · blog · CMS/admin ·
Google Analytics/Search Console · advanced SEO · lightbox/advanced gallery.

---

## Project structure

```
glow-salon-spa/
├─ wrangler.jsonc          Worker name, static-assets config, D1 binding
├─ schema.sql              D1 table (enquiries)
├─ worker/
│  └─ index.js             The API: /api/contact, /api/enquiries, /api/health
├─ backend/                Legacy FastAPI version — kept for reference, not deployed
│  ├─ app.py
│  └─ requirements.txt
└─ frontend/               React app (Vite)
   ├─ index.html           SEO meta tags, fonts, favicon
   ├─ package.json, vite.config.js
   ├─ download-images.js   Optional: fetch stock photos into public/images
   ├─ public/
   │  ├─ favicon.svg
   │  └─ images/           Drop your photos here (see images/README.md)
   └─ src/
      ├─ main.jsx, App.jsx Entry + router
      ├─ styles.css        Design system (emerald + gold + ivory)
      ├─ data.js           ⭐ All business info — edit this to rebrand
      ├─ api.js            Contact-form fetch helper
      ├─ components/       Navbar · Footer · FloatingButtons · SmartImage
      └─ pages/            Home · About · Services · Gallery · Contact
```

---

## The API

Served by `worker/index.js` at the same origin as the site.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/contact` | Validate + store a contact/enquiry submission |
| `GET`  | `/api/enquiries` | List captured enquiries (see below) |
| `GET`  | `/api/health` | Health check |

Name, phone and message are required; email is validated if provided. Successful
writes return `201` with `{ ok, id, message }`. Validation failures return `400`
with `{ ok: false, errors: { field: "..." } }`, which the form renders inline
against the offending field.

`GET /api/enquiries` returns every captured enquiry — names and phone numbers —
so it is gated behind a bearer token when one is configured:

```bash
npx wrangler secret put ADMIN_TOKEN
```

With the secret set, the endpoint requires `Authorization: Bearer <token>`.
Without it, the endpoint is public — set it before go-live.

---

## Running locally

**Frontend only (fastest for UI work):**

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Vite proxies `/api` to the backend — update the proxy target in `vite.config.js`
to `http://localhost:8787` and run `npx wrangler dev` in a second terminal.

**Full stack, closest to production:**

```bash
cd frontend && npm install && npm run build && cd ..
npx wrangler dev     # http://localhost:8787 — site + API against a local D1
```

Rebuild the frontend after each change in this mode. To seed the local database:

```bash
npx wrangler d1 execute glow-salon-spa --file=./schema.sql
```

(Omitting `--remote` targets the local dev copy.)

---

## Deploying

First time only — create the database and paste the printed `database_id` into
`wrangler.jsonc`:

```bash
npx wrangler login
npx wrangler d1 create glow-salon-spa
npx wrangler d1 execute glow-salon-spa --remote --file=./schema.sql
```

Every deploy after that:

```bash
cd frontend && npm run build && cd ..
npx wrangler deploy
```

Requires Wrangler 4.20+ — the `run_worker_first` array form in `wrangler.jsonc` is
ignored silently on older versions, which makes `/api/*` fall through to the SPA
and return HTML instead of JSON.

Verify:

```bash
curl https://glow-salon-spa.anshikami7890.workers.dev/api/health
npx wrangler d1 execute glow-salon-spa --remote \
  --command "SELECT id, name, phone, service, created_at FROM enquiries ORDER BY id DESC LIMIT 5"
```

`npx wrangler tail` streams live Worker logs if a form submission doesn't land.

---

## Customising

- **Business details** (name, phone, WhatsApp, email, address, hours, map,
  services, gallery, testimonials) → **`frontend/src/data.js`** — one file
- **Colours & fonts** → the `:root` variables at the top of
  **`frontend/src/styles.css`**
- **Google Maps** → `mapEmbed` / `mapLink` in `data.js`
- **SEO title/description/social preview** → `frontend/index.html`

> The sample phone, WhatsApp, email, address and map point to placeholder values.
> Update them in `data.js` and `index.html` before going live.

### Photos

Every image tries sources in this order:

> **your local file → themed stock photo → generic stock photo → gradient tile**

So the site looks finished immediately, never shows a broken image, and works
offline. To use real pictures, either:

1. Run `node download-images.js` (in `frontend/`) to bundle stock photos locally, **or**
2. Drop your own files into `frontend/public/images/` using the names in
   `frontend/public/images/README.md` — they override everything else.

---

## Tech notes
- React 18 + React Router 6, built with Vite 5
- Cloudflare Workers + D1; no server to run, no Python host required
- D1 is SQLite-compatible, so `schema.sql` matches the original `backend/enquiries.db`
- No paid services required to run or deploy (Workers and D1 free tiers) 
