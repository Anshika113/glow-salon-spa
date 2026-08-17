# Glow Salon & Spa

A premium, mobile-first **online presence** for a local salon & spa —
built with React, Vite, and Cloudflare Workers.

**Live:** https://glow-salon-spa.anshikami7890.workers.dev/

---

## What this is

| | |
|---|---|
| **Frontend** | React 18 + React Router 6 (Vite 5) |
| **Backend** | Cloudflare Worker (JavaScript) |
| **Database** | Cloudflare D1 (appointment requests) |
| **Hosting** | Cloudflare Workers — static assets and API in a single deploy |
| **Pages (5)** | Home · Services · Gallery · About · Contact |

The frontend and the API are served from the same origin, so there is no CORS
setup and no `VITE_API_URL` to configure. Static files are served straight from
Cloudflare's edge; the Worker only runs for `/api/*`.

### Features

Editorial, art-directed layout · responsive images with `srcset` · appointment
request flow (service, preferred date & time, name, phone) saved to D1 ·
WhatsApp as a first-class booking channel · mobile Call / WhatsApp / Book action
bar · click-to-call · per-category service pages with deep links · filterable
gallery · Google Maps · SEO (title, meta description, Open Graph, canonical,
`BeautySalon` structured data) · accessible forms, focus states and skip link ·
restrained scroll reveals that respect `prefers-reduced-motion`.

### Design system

| | |
|---|---|
| **Palette** | ink `#171717` · sand `#F5F1EA` · secondary `#E7DED2` · clay `#B79B8B` · olive `#89907D` |
| **Display** | Instrument Serif — headlines, 40–100px, tight leading |
| **Body** | Inter — 16–19px |
| **Detailing** | thin rules instead of cards, section numbers, uppercase letter-spaced eyebrows, generous whitespace, 2px corner radius |

No gradients, glassmorphism, glows or heavy shadows — the weight is carried by
typography, photography and spacing.

---

## Honest-data policy

Anything that can't be verified is **left empty rather than invented**, and the
UI hides that section until real data is supplied. In `frontend/src/data.js`:

| Field | State | Turns on |
|---|---|---|
| `rating` | `null` | Star rating + "N reviews" in the trust strip and reviews section |
| `team` | `[]` | The "Meet the experts" section (home + about) |
| `transformations` | `[]` | Before/after comparisons in the gallery |
| `reviewsUrl` | `''` | The "Read all reviews →" link |
| `services[].duration` | `''` | Treatment length beside each service and price |

So there are no fabricated review counts, ratings, years-in-business, awards or
staff anywhere on the site. Testimonials are the three the salon already had.
Prices are the real starting prices. The "Open today · until 8 PM" badge is
computed from the actual opening hours, so it is never wrong.

Because there is no real-time availability system, the form asks for a
**preferred** date and time and is labelled *Request an appointment* — it never
shows a slot as confirmed or available.

---

## Project structure

```
glow-salon-spa/
├─ wrangler.jsonc          Worker name, static-assets config, D1 binding
├─ schema.sql              D1 table (enquiries)
├─ worker/
│  └─ index.js             The API: /api/contact, /api/enquiries, /api/health
├─ backend/                Legacy FastAPI version — kept for reference, not deployed
└─ frontend/               React app (Vite)
   ├─ index.html           SEO meta, fonts, LocalBusiness JSON-LD
   ├─ download-images.js   Fetches the photography set into public/images/photos/
   ├─ public/images/
   │  ├─ README.md         ⭐ Which photo goes where, and how to swap them
   │  └─ photos/           Every image, at 640px and 1280px
   └─ src/
      ├─ main.jsx, App.jsx Entry + router (hash-aware scrolling)
      ├─ styles.css        Design system + all component styles
      ├─ data.js           ⭐ All business info — edit this to rebrand
      ├─ api.js            Contact-form fetch helper
      ├─ components/       Navbar · Footer · FloatingButtons · BookingForm
      │                    BookingSection · FindUs · SmartImage · Reveal
      └─ pages/            Home · Services · Gallery · About · Contact
```

### Key components

- **`SmartImage`** — renders the first candidate that loads, and removes itself
  if none do (so a missing file shows the warm background, never a broken image).
  Accepts `photo()` objects from `data.js` to emit `srcset` + `sizes`.
- **`BookingForm`** — the appointment request form. Folds the preferred date,
  time and notes into the `message` field the Worker already stores, so **no
  backend or schema change was needed**. Falls back to a pre-filled WhatsApp
  message.
- **`Reveal`** — one-shot fade-and-rise via `IntersectionObserver`.

---

## The API

Served by `worker/index.js` at the same origin as the site. **Unchanged** by the
redesign — same routes, same request and response shapes.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/contact` | Validate + store an appointment request / enquiry |
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
cd frontend && npm install && npm run dev
```

Vite proxies `/api` to `http://localhost:5000` by default. Two env vars override
the dev server without editing `vite.config.js`:

```bash
PORT=5174 API_PORT=8787 npm run dev
```

Set `API_PORT=8787` and run `npx wrangler dev` in a second terminal to develop
against the real Worker.

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
  services, prices, gallery, testimonials) → **`frontend/src/data.js`** — one file
- **Colours, fonts & spacing** → the `:root` tokens at the top of
  **`frontend/src/styles.css`**
- **Photography** → **`frontend/public/images/README.md`** lists every image and
  where it appears
- **Opening hours** → `OPENS_AT` / `CLOSES_AT` in `data.js` (the "open now" badge
  and the bookable time list are both derived from them)
- **SEO title/description/social preview & structured data** →
  `frontend/index.html`

> The sample phone, WhatsApp, email, address, map and social links are
> placeholders. Update them in `data.js` **and** the JSON-LD block in
> `index.html` before going live.

---

## Tech notes

- React 18 + React Router 6, built with Vite 5 — no UI framework, no animation
  library, no icon package; three runtime dependencies in total
- Two webfonts, `display=swap`, hero image preloaded with `imagesrcset`
- Cloudflare Workers + D1; no server to run, no Python host required
- D1 is SQLite-compatible, so `schema.sql` matches the original
  `backend/enquiries.db`
- No paid services required to run or deploy (Workers and D1 free tiers)
