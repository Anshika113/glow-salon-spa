/**
 * Fetches the site's photography into public/images/photos/.
 *
 * Unlike the original keyword-based version, every photo below is a specific,
 * hand-picked, free-licence Unsplash image that was reviewed for subject and
 * tone before being added — so the site gets consistent, warm, editorial
 * salon/spa imagery instead of random keyword matches.
 *
 * Each entry is saved at two widths so the markup can ship a proper `srcset`
 * (see SmartImage.jsx): `<name>-640.jpg` and `<name>-1280.jpg`
 * (the hero portrait also gets a 1600px variant).
 *
 * Unsplash serves a WebP copy of every size too, which is ~65% smaller — those
 * are saved alongside as `<name>-<width>.webp` and offered first via <picture>.
 *
 * Run once from the `frontend` folder:
 *     node download-images.js
 *
 * To use the salon's OWN photography instead, just overwrite the files in
 * public/images/photos/ keeping the same names — no code changes needed.
 * See public/images/README.md for the full list and what each one is used for.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'public', 'images', 'photos')

// name → Unsplash reference.
//  "photo-…"  = direct CDN id
//  anything else = photo page slug (resolved through the download endpoint)
const PHOTOS = {
  // Hero
  'portrait-hair': 'photo-1636153279424-cb5d1e00f5a2',
  'detail-scissors': 'photo-1647462741268-e5724e5886c0',

  // Hair
  'hair-styling': 'photo-1634449571017-5fecfd26ad76',
  'hair-colour': 'photo-1707979577466-2d6109c68a45',
  'hair-wash': 'photo-1634449571010-02389ed0f9b0',
  'hair-salon-floor': 'photo-1695527081848-1e46c06e6458',

  // Skin
  'skin-facial': 'photo-1570172619644-dfd03ed5d881',
  'skin-glow': 'photo-1643684391140-c5056cfd3436',
  'skin-treatment': 'photo-1761718210089-ba3bb5ccb54f',

  // Spa
  'spa-massage': '7yeqemd-p90',
  'spa-stones': '_TyrA1RUaiI',
  'spa-shoulders': 'Y1JKxNFwZx4',
  'spa-room': 'photo-1737352777897-e22953991a32',

  // Makeup
  'makeup-beauty': 'photo-1487412947147-5cebf100ffc2',
  'makeup-artist': 'photo-1636023730877-233b9237d4ec',
  'makeup-bridal-eye': 'photo-1638628064365-f08ad0ec8245',

  // Nails
  'nails-hands': 'photo-1643648854897-7b5845b4c04c',
  'nails-technician': 'photo-1632345031435-8727f6897d53',

  // Bridal
  'bridal-portrait': 'KxHcyNOIO_M',
  'bridal-veil': 'T-PUQaJ8YEw',

  // The space
  'salon-chairs': 'photo-1626383137804-ff908d2753a2',
  'salon-mirrors': 'photo-1781450090585-1a511b7066d9',
  'salon-products': 'photo-1626379501846-0df4067b8bb9',
  'salon-reception': 'photo-1746723378067-83a345ff3160',
}

// The hero image is displayed largest, so it gets an extra width.
const WIDTHS = (name) => (name === 'portrait-hair' ? [640, 1280, 1600] : [640, 1280])

const url = (ref, w, fmt) =>
  ref.startsWith('photo-')
    ? `https://images.unsplash.com/${ref}?w=${w}&q=72&fm=${fmt}&fit=max`
    : `https://unsplash.com/photos/${ref}/download?force=true&w=${w}${fmt === 'webp' ? '&fm=webp' : ''}`

async function grab(ref, w, fmt) {
  const res = await fetch(url(ref, w, fmt), {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 3000) throw new Error('suspiciously small (' + buf.length + ' B)')
  return buf
}

fs.mkdirSync(OUT, { recursive: true })
console.log('Downloading photography into public/images/photos/ …\n')

let ok = 0
let failed = 0
for (const [name, ref] of Object.entries(PHOTOS)) {
  for (const w of WIDTHS(name)) {
    for (const fmt of ['jpg', 'webp']) {
      const file = `${name}-${w}.${fmt}`
      try {
        fs.writeFileSync(path.join(OUT, file), await grab(ref, w, fmt))
        ok++
        console.log(`  ✓ ${file}`)
      } catch (e) {
        failed++
        console.log(`  ✗ ${file} — ${e.message}`)
      }
    }
  }
}
console.log(`\nDone: ${ok} saved${failed ? `, ${failed} failed` : ''}.`)
