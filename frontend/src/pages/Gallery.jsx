import { gallery } from '../data.js'
import SmartImage from '../components/SmartImage.jsx'

export default function Gallery() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">A peek inside</span>
          <h1>Gallery</h1>
          <p>
            A glimpse of our space and work. Swap these for real pictures of your salon,
            treatments and happy clients before going live.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="masonry masonry--full">
            {gallery.map((g, i) => (
              <figure
                className={`shot shot--${(i % 4) + 1}`}
                key={g.label}
                style={{ background: `linear-gradient(150deg, ${g.tone[0]}, ${g.tone[1]})` }}
              >
                <SmartImage src={g.img} alt={g.label} className="shot__img" />
                <figcaption>{g.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
