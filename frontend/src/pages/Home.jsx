import { Link } from 'react-router-dom'
import {
  business,
  gallery,
  heroImages,
  openState,
  promises,
  rating,
  reviewsUrl,
  serviceCategories,
  signatureServices,
  spaceImages,
  team,
  testimonials,
  whatsappLink,
} from '../data.js'
import SmartImage from '../components/SmartImage.jsx'
import Reveal from '../components/Reveal.jsx'
import BookingSection from '../components/BookingSection.jsx'
import FindUs from '../components/FindUs.jsx'

export default function Home() {
  const status = openState()
  const [lead, ...rest] = testimonials

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Salon · Spa · Beauty</p>
            <h1 className="hero__title">
              Look good.
              <em>Feel better.</em>
            </h1>
            <p className="lede">{business.lede}</p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#book">
                Book an appointment <span className="arw" aria-hidden="true">→</span>
              </a>
              <Link className="btn btn--ghost" to="/services">
                Explore services <span className="arw" aria-hidden="true">→</span>
              </Link>
            </div>

            <p className="hero__facts">
              <span>{business.area}</span>
              {/* Dot and label stay one unit so the dot never orphans on wrap */}
              <span className="hero__state">
                <span className={`dot ${status.open ? '' : 'is-shut'}`} aria-hidden="true" />
                {status.label}
              </span>
            </p>
          </div>

          <figure className="hero__figure">
            <div className="ph hero__main">
              <SmartImage
                src={heroImages.portrait}
                className="ph__img"
                priority
                sizes="(max-width: 960px) 100vw, 48vw"
              />
            </div>
            <div className="ph hero__inset">
              <SmartImage src={heroImages.detail} className="ph__img" sizes="170px" />
            </div>
          </figure>
        </div>
      </section>

      {/* -------------------------------------------------------- Trust strip */}
      <section className="trust" aria-label="At a glance">
        <div className="container trust__grid">
          {/* Only renders once a verified rating is added to data.js */}
          {rating && (
            <div className="trust__cell">
              <span className="trust__k">
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
              </span>
              <span className="trust__v">
                {rating.value} on {rating.source}
                {rating.count ? ` · ${rating.count} reviews` : ''}
              </span>
            </div>
          )}
          <div className="trust__cell">
            <span className="trust__k">Open all week</span>
            <span className="trust__v">10 AM – 8 PM</span>
          </div>
          <div className="trust__cell">
            <span className="trust__k">Bandra West</span>
            <span className="trust__v">Mumbai 400050</span>
          </div>
          <div className="trust__cell">
            <span className="trust__k">Six service areas</span>
            <span className="trust__v">Hair · Skin · Spa · Makeup · Nails · Bridal</span>
          </div>
          {!rating && (
            <div className="trust__cell">
              <span className="trust__k">Booking in a minute</span>
              <span className="trust__v">Request on WhatsApp</span>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section className="section" id="services">
        <div className="container">
          <div className="shead">
            <div>
              <p className="shead__no">01</p>
              <h2>
                Services, <span className="serif-em">done beautifully.</span>
              </h2>
            </div>
            <div className="shead__aside">
              <p>
                Six things we do, all under one roof — with honest starting prices so you know
                where you stand before you sit down.
              </p>
            </div>
          </div>

          <div className="cats">
            {serviceCategories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 90}>
                <Link className="cat" to={`/services#${c.id}`}>
                  <div className="ph ph--hover">
                    <SmartImage
                      src={c.photo}
                      className="ph__img"
                      sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 620px"
                    />
                  </div>
                  <div className="cat__body">
                    <span className="cat__no">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="cat__name">{c.label}</h3>
                      <p className="cat__blurb">{c.blurb}</p>
                      <span className="cat__foot">
                        <span className="cat__cue">
                          Explore {c.label.toLowerCase()}{' '}
                          <span className="arw" aria-hidden="true">
                            →
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Signature */}
      <section className="section section--ink on-dark">
        <div className="container">
          <div className="shead">
            <div>
              <p className="shead__no">02</p>
              <h2>The treatments our clients come back for.</h2>
            </div>
            <div className="shead__aside">
              <p>Our most-requested services, with starting prices.</p>
            </div>
          </div>

          <div className="sigs">
            {signatureServices.map((s, i) => (
              <Reveal className="sig" key={s.id} delay={i * 80}>
                <div className="ph ph--hover">
                  <SmartImage
                    src={s.photo}
                    className="ph__img"
                    sizes="(max-width: 680px) 100vw, (max-width: 1100px) 40vw, 400px"
                  />
                </div>
                <div className="sig__body">
                  <h3 className="sig__name">{s.title}</h3>
                  <p className="sig__desc">{s.desc}</p>
                  <p className="sig__meta">
                    <span className="price">{s.price}</span>
                    {s.duration && (
                      <>
                        <span className="sep" aria-hidden="true">
                          /
                        </span>
                        <span>{s.duration}</span>
                      </>
                    )}
                  </p>
                  <a
                    className="alink"
                    href={whatsappLink(`Hi Glow Salon & Spa, I'd like to book: ${s.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginRight: 'auto' }}
                  >
                    Book <span className="arw" aria-hidden="true">→</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- The space */}
      <section className="section">
        <div className="container space">
          <Reveal className="space__art">
            {spaceImages.map((img, i) => (
              <div className="ph" key={img.src}>
                <SmartImage
                  src={img}
                  className="ph__img"
                  sizes={i === 0 ? '(max-width: 960px) 100vw, 640px' : '(max-width: 960px) 50vw, 310px'}
                />
              </div>
            ))}
          </Reveal>

          <Reveal delay={80}>
            <p className="shead__no">03</p>
            <h2>A little time for yourself.</h2>
            <p className="lede">
              A calm, modern space in the heart of Bandra — designed so an hour here actually
              feels like an hour off.
            </p>
            <ul className="promises">
              {promises.map((p, i) => (
                <li key={p.title}>
                  <span className="promises__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="promises__t">{p.title}</span>
                  <span className="promises__d">{p.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Gallery */}
      <section className="section section--sand">
        <div className="container">
          <div className="shead">
            <div>
              <p className="shead__no">04</p>
              <h2>A look around.</h2>
            </div>
            <div className="shead__aside">
              <p>The studio, the treatment rooms and the work we do in them.</p>
            </div>
          </div>

          <div className="gal">
            {gallery.slice(0, 6).map((g, i) => (
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

          <div style={{ marginTop: 'clamp(2rem,4vw,3rem)' }}>
            <Link className="alink" to="/gallery">
              View the full gallery <span className="arw" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Team */}
      {/* Renders only once real team members are added to data.js */}
      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="shead">
              <div>
                <p className="shead__no">05</p>
                <h2>Meet the experts.</h2>
              </div>
            </div>
            <div className="gal">
              {team.map((m) => (
                <Reveal as="figure" className="gal__item" key={m.name}>
                  <div className="ph" style={{ '--ratio': '4 / 5' }}>
                    <SmartImage src={m.photo} className="ph__img" sizes="(max-width: 960px) 50vw, 420px" />
                  </div>
                  <figcaption className="gal__cap">
                    <span>{m.name}</span>
                    <span>{m.role}</span>
                  </figcaption>
                  {(m.speciality || m.experience) && (
                    <p className="promises__d" style={{ marginTop: '.5rem' }}>
                      {[m.speciality, m.experience].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- Reviews */}
      <section className="section">
        <div className="container">
          <div className="shead">
            <div>
              <p className="shead__no">06</p>
              <h2>Loved by our clients.</h2>
            </div>
            {reviewsUrl && (
              <div className="shead__aside">
                <a className="alink" href={reviewsUrl} target="_blank" rel="noreferrer">
                  Read all reviews <span className="arw" aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>

          <Reveal className="review-lead">
            <span className="stars" aria-label="Five out of five stars">
              ★★★★★
            </span>
            <blockquote>“{lead.text}”</blockquote>
            <cite className="review-cite">
              <span>{lead.name}</span>
              {lead.service && (
                <>
                  <span className="sep" aria-hidden="true">
                    /
                  </span>
                  <em>{lead.service}</em>
                </>
              )}
            </cite>
          </Reveal>

          <div className="reviews">
            {rest.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <span className="stars" aria-label="Five out of five stars">
                  ★★★★★
                </span>
                <blockquote>“{t.text}”</blockquote>
                <cite className="review-cite">
                  <span>{t.name}</span>
                  {t.service && (
                    <>
                      <span className="sep" aria-hidden="true">
                        /
                      </span>
                      <em>{t.service}</em>
                    </>
                  )}
                </cite>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Booking */}
      <BookingSection no="07" />

      {/* --------------------------------------------------------- Location */}
      <FindUs no="08" />
    </>
  )
}
