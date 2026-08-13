/**
 * Downloads a set of free-licensed salon/spa photos into public/images/ so the
 * site shows real photography that also works offline. Themed photos come from
 * LoremFlickr; if one isn't available it falls back to a generic Picsum photo.
 *
 * Run once from the `frontend` folder:
 *     node download-images.js
 *
 * Re-run any time to refresh. To use your OWN pictures instead, just drop files
 * with the same names into public/images/ (they take priority automatically).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'public', 'images')

// [outputPath, keywords, lock, picsumSeed, width, height]
const targets = [
  ['hero/salon.jpg', 'hair,salon,interior', 21, 'glow-salon', 900, 1150],
  ['hero/spa.jpg', 'spa,candles,wellness', 22, 'glow-spa', 800, 800],
  ['gallery/hair-studio.jpg', 'hair,salon', 1, 'hair-studio', 800, 1000],
  ['gallery/colour-bar.jpg', 'haircolor,salon', 2, 'colour-bar', 800, 1000],
  ['gallery/skin-facials.jpg', 'facial,skincare', 3, 'skin-facials', 800, 1000],
  ['gallery/bridal-suite.jpg', 'makeup,bride', 4, 'bridal-suite', 800, 1000],
  ['gallery/nail-lounge.jpg', 'manicure,nails', 5, 'nail-lounge', 800, 1000],
  ['gallery/spa-rooms.jpg', 'spa,massage', 6, 'spa-rooms', 800, 1000],
  ['gallery/reception.jpg', 'salon,interior', 7, 'reception', 800, 1000],
  ['gallery/relaxation.jpg', 'spa,wellness', 8, 'relaxation', 800, 1000],
]

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return Buffer.from(await res.arrayBuffer())
}

async function download(out, kw, lock, seed, w, h) {
  const full = path.join(OUT, out)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  let buf
  try {
    buf = await get(`https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`)
    if (buf.length < 3000) throw new Error('too small')
  } catch {
    buf = await get(`https://picsum.photos/seed/${seed}/${w}/${h}`)
  }
  fs.writeFileSync(full, buf)
  console.log(`✓ ${out.padEnd(28)} ${(buf.length / 1024).toFixed(0)} KB`)
}

console.log('Downloading photos into public/images/ …\n')
let ok = 0
for (const t of targets) {
  try {
    await download(...t)
    ok++
  } catch (e) {
    console.log(`✗ ${t[0]} — ${e.message} (gradient will show for this one)`)
  }
}
console.log(`\nDone: ${ok}/${targets.length} images saved. Refresh the site to see them.`)
