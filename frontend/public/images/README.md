# Images — drop your photos here

All site photography lives in **`photos/`**, saved at two widths so every image
ships a real `srcset` and phones don't download desktop-sized files:

```
photos/<name>-640.jpg     ← used up to ~640px wide
photos/<name>-1280.jpg    ← used above that
photos/portrait-hair-1600.jpg   ← hero only, for large screens
```

To use the salon's own photography, **overwrite these files keeping the same
names** — no code changes needed. If an image is ever missing, `SmartImage`
removes itself and the warm tone underneath shows through, so the site never
displays a broken image.

To re-fetch the current placeholder set, run from `frontend/`:

```bash
node download-images.js
```

> **Before going live:** the files currently in `photos/` are free-licence
> Unsplash stock, hand-picked per slot. They are captioned by area and service
> and are never presented as the salon's own client results — but they are not
> your salon. Replace them with real photography of your space, team and work.

## What each file is used for

| File (`photos/…`) | Where it appears |
|---|---|
| `portrait-hair` | **Hero** — the main image on the home page |
| `detail-scissors` | Hero — small inset over the lower-left of the hero image |
| `hair-styling` | Services → **Hair** category |
| `skin-facial` | Services → **Skin** category |
| `spa-massage` | Services → **Spa** category |
| `makeup-beauty` | Services → **Makeup** category |
| `nails-hands` | Services → **Nails** category |
| `bridal-portrait` | Services → **Bridal** category |
| `bridal-veil` | Signature services — Bridal & Party Makeup |
| `hair-wash` | Signature services — Hair Colour & Highlights |
| `spa-stones` | Signature services — Spa & Massage |
| `salon-chairs` | "A little time for yourself" — large image |
| `skin-treatment` | "A little time for yourself" — small image |
| `salon-mirrors` | "A little time for yourself" — small image |
| `salon-products` | About page |
| `salon-reception` | About page **and** gallery ("Reception") |
| `hair-salon-floor` | Gallery — "Hair Studio" |
| `hair-colour` | Gallery — "Colour Bar" |
| `skin-glow` | Gallery — "Skin & Facials" |
| `makeup-bridal-eye` | Gallery — "Bridal Suite" |
| `makeup-artist` | Gallery — "Makeup Studio" |
| `nails-technician` | Gallery — "Nail Lounge" |
| `spa-room` | Gallery — "Spa Rooms" |
| `spa-shoulders` | Gallery — "Relaxation" |

Captions, categories and crop ratios for the gallery live in the `gallery`
array in `src/data.js`.

## Tips

- **Compress before uploading** (squoosh.app, tinypng.com) — aim for well under
  300 KB per file. The whole `photos/` folder is currently ~6.6 MB for 49 files.
- Export both widths for each name. If you only supply the `-1280` file the
  `srcset` still works — browsers just won't have a smaller option.
- Images are cropped to fill (`object-fit: cover`), so keep the subject near the
  centre. Portrait crops suit the category and gallery tiles best.
- Prefer a remote URL? Pass a full `https://…` string instead of `photo(…)` in
  `src/data.js` — `SmartImage` accepts plain strings, and an array of candidates
  if you want a fallback chain.
- Adding **team photos** or **before/after pairs**? Drop them in here and fill in
  the `team` / `transformations` arrays in `src/data.js` — those sections are
  built and hidden, and switch on as soon as they have real data.
