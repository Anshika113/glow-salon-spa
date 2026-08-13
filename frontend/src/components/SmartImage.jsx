import { useState } from 'react'

/**
 * Renders the first working image from one or more sources, and silently
 * removes itself if none load — revealing the gradient on the parent
 * container underneath.
 *
 * `src` may be a single string or an ordered array of candidates. Order of
 * precedence for the demo is: your local file → stock photo → (gradient).
 * So dropping your own photo at the local path always wins, the site looks
 * finished right now with stock imagery, and it still degrades gracefully
 * offline.
 *
 *   <figure style={{ background: gradient }}>
 *     <SmartImage src={['/images/gallery/hair.jpg', 'https://…']} alt="…" className="shot__img" />
 *     <figcaption>…</figcaption>
 *   </figure>
 */
export default function SmartImage({ src, alt = '', className = '' }) {
  const sources = (Array.isArray(src) ? src : [src]).filter(Boolean)
  const [idx, setIdx] = useState(0)
  if (idx >= sources.length) return null
  return (
    <img
      src={sources[idx]}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
    />
  )
}
