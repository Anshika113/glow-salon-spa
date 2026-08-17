import { useState } from 'react'
import { Link } from 'react-router-dom'
import { gallery, galleryFilters, transformations } from '../data.js'
import SmartImage from '../components/SmartImage.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? gallery : gallery.filter((g) => g.category === filter)

  return (
    <>
      <section className="phead">
        <div className="container phead__inner">
          <div>
            <p className="eyebrow">A look around</p>
            <h1>
              The <span className="serif-em">gallery.</span>
            </h1>
          </div>
          <p className="lede">
            Our studio, treatment rooms and the services we offer across hair, skin, spa, makeup,
            nails and bridal.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filters" role="group" aria-label="Filter gallery by area">
            {galleryFilters.map((f) => (
              <button
                key={f}
                type="button"
                className={filter === f ? 'is-on' : ''}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="gal">
            {shown.map((g, i) => (
              <Reveal as="figure" className="gal__item" key={g.label} delay={(i % 3) * 70}>
                <div className="ph ph--hover" style={{ '--ratio': g.ratio }}>
                  <SmartImage
                    src={g.photo}
                    className="ph__img"
                    sizes="(max-width: 400px) 100vw, (max-width: 960px) 50vw, 420px"
                  />
                </div>
                <figcaption className="gal__cap">
                  <span>{g.label}</span>
                  <span>{g.category}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>

          {/*
            Before/after comparisons appear here as soon as genuine, consented
            pairs are added to `transformations` in data.js. Until then we show
            photography rather than invent results.
          */}
          {transformations.length > 0 && (
            <div style={{ marginTop: 'clamp(3rem,6vw,5rem)' }}>
              <div className="shead">
                <div>
                  <p className="shead__no">—</p>
                  <h2>The Glow effect.</h2>
                </div>
              </div>
              <div className="gal">
                {transformations.map((t) => (
                  <Reveal as="figure" className="gal__item" key={t.caption}>
                    <div className="ph" style={{ '--ratio': '4 / 5' }}>
                      <SmartImage src={t.after} className="ph__img" sizes="(max-width: 960px) 50vw, 420px" />
                    </div>
                    <figcaption className="gal__cap">
                      <span>{t.caption}</span>
                      <span>{t.category}</span>
                    </figcaption>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'clamp(2.5rem,5vw,4rem)' }}>
            <Link className="btn btn--primary" to="/contact#book">
              Book an appointment <span className="arw" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
