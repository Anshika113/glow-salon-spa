import { useState } from 'react'

/**
 * Renders the first working image from one or more candidates, and silently
 * removes itself if none load — revealing the warm tone on the parent
 * container underneath, so a missing file never shows as a broken image.
 *
 * A candidate may be:
 *   • a string — plain src
 *   • an object { src, srcSet, alt } — as produced by `photo()` in data.js,
 *     which points at the two widths saved in /public/images/photos/
 *
 * `src` may be a single candidate or an ordered array of them.
 *
 *   <div className="ph">
 *     <SmartImage src={photo('hair-styling', 'A stylist at work')} className="ph__img" />
 *   </div>
 *
 * Images are lazy-loaded by default; pass `priority` for above-the-fold
 * photography (the hero) so it is fetched eagerly and decoded synchronously.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
}) {
  const candidates = (Array.isArray(src) ? src : [src]).filter(Boolean)
  const [idx, setIdx] = useState(0)

  if (idx >= candidates.length) return null

  const current = candidates[idx]
  const isObject = typeof current === 'object'
  const url = isObject ? current.src : current
  const label = alt ?? (isObject ? current.alt : '') ?? ''

  const img = (
    <img
      src={url}
      srcSet={isObject ? current.srcSet : undefined}
      sizes={isObject && current.srcSet ? sizes : undefined}
      alt={label}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : undefined}
      draggable="false"
      onError={() => setIdx((i) => i + 1)}
    />
  )

  // Offer WebP first where the candidate provides it; the <img> above stays as
  // the JPEG fallback, so onError still walks the candidate chain.
  if (isObject && current.webpSrcSet) {
    return (
      <picture>
        <source type="image/webp" srcSet={current.webpSrcSet} sizes={sizes} />
        {img}
      </picture>
    )
  }
  return img
}
