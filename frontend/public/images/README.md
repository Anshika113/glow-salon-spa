# Images — drop your photos here

Out of the box the site already shows **free Unsplash stock photos** so it looks
finished immediately. The load order for every image is:

> **your local file → stock photo → gradient tile**

So the moment you drop a file at one of the paths below, it **overrides the stock
photo** — no code changes needed. And if a photo ever fails to load, the styled
gradient shows instead, so nothing ever breaks (online or offline).

Save your photos with the **exact filenames** below (JPG, PNG or WebP all work —
if you use a different extension, update the path in `src/data.js`).

## Hero (folder: `hero/`)
| File | Shown as | Suggested size |
|------|----------|----------------|
| `hero/salon.jpg` | Large left panel — salon interior / a hero shot | ~1200 × 1500 (portrait) |
| `hero/spa.jpg`   | Small gold panel — a spa / treatment close-up  | ~800 × 800 (square) |

## Gallery (folder: `gallery/`)
| File | Caption |
|------|---------|
| `gallery/hair-studio.jpg`  | Hair Studio |
| `gallery/colour-bar.jpg`   | Colour Bar |
| `gallery/skin-facials.jpg` | Skin & Facials |
| `gallery/bridal-suite.jpg` | Bridal Suite |
| `gallery/nail-lounge.jpg`  | Nail Lounge |
| `gallery/spa-rooms.jpg`    | Spa Rooms |
| `gallery/reception.jpg`    | Reception |
| `gallery/relaxation.jpg`   | Relaxation |

## Tips
- **Compress before uploading** (e.g. squoosh.app or tinypng.com) — aim for < 300 KB per
  image so the site stays fast. WebP gives the best quality-to-size.
- Landscape or portrait both work; images are cropped to fill (`object-fit: cover`).
- Prefer a **remote URL**? Paste a full `https://…` link into `img` (gallery) or
  `heroImages` (hero) in `src/data.js` instead of a local path.
- To change captions, filenames or add/remove tiles, edit the `gallery` array in
  `src/data.js`.
