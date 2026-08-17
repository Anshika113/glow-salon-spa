import { Link } from 'react-router-dom'
import { serviceCategories, servicesIn, whatsappLink } from '../data.js'
import SmartImage from '../components/SmartImage.jsx'
import Reveal from '../components/Reveal.jsx'
import BookingSection from '../components/BookingSection.jsx'

export default function Services() {
  return (
    <>
      <section className="phead">
        <div className="container phead__inner">
          <div>
            <p className="eyebrow">Our menu</p>
            <h1>
              Services <span className="serif-em">&amp; pricing.</span>
            </h1>
          </div>
          <p className="lede">
            Indicative starting prices. Final pricing depends on hair length, products and the
            treatment chosen — ask us on WhatsApp for a quick, no-obligation quote.
          </p>
        </div>
      </section>

      {/* Jump links */}
      <nav className="section section--tight" aria-label="Service categories">
        <div className="container">
          <ul className="filters" style={{ marginBottom: 0 }}>
            {serviceCategories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="btn btn--sm btn--ghost"
                  style={{ display: 'inline-flex' }}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="container">
        {serviceCategories.map((cat, i) => {
          const items = servicesIn(cat.id)
          return (
            <section className="svc-cat" id={cat.id} key={cat.id}>
              <div className="svc-cat__grid">
                <Reveal className="svc-cat__art">
                  <div className="ph">
                    <SmartImage
                      src={cat.photo}
                      className="ph__img"
                      sizes="(max-width: 1100px) 100vw, 420px"
                    />
                  </div>
                </Reveal>

                <Reveal delay={70}>
                  <p className="shead__no">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="svc-cat__title">{cat.label}</h2>
                  <p className="lede">{cat.blurb}</p>

                  <div style={{ marginTop: 'clamp(1.6rem,3vw,2.4rem)' }}>
                    {items.map((s) => (
                      <article className="svc" key={s.id}>
                        <div className="svc__top">
                          <h3 className="svc__name">{s.title}</h3>
                          <span className="price">{s.price}</span>
                        </div>

                        <p className="svc__desc">{s.desc}</p>

                        {s.includes?.length > 0 && (
                          <>
                            <h4 className="sr-only">What’s included</h4>
                            <ul className="svc__incl">
                              {s.includes.map((inc) => (
                                <li key={inc}>{inc}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        <div className="svc__foot">
                          <Link
                            className="btn btn--sm btn--primary"
                            to={`/contact?service=${encodeURIComponent(s.title)}#book`}
                          >
                            Book this service <span className="arw" aria-hidden="true">→</span>
                          </Link>
                          <a
                            className="alink"
                            href={whatsappLink(
                              `Hi Glow Salon & Spa, I'd like to know more about: ${s.title}.`,
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ask on WhatsApp
                          </a>
                          {/* Shown as soon as real treatment times are added to data.js */}
                          {s.duration && <span className="svc__dur">{s.duration}</span>}
                        </div>
                      </article>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          )
        })}
      </div>

      <div style={{ height: 'clamp(3rem,6vw,5.5rem)' }} />

      <BookingSection
        no="—"
        title="Not sure what to book?"
        lede="Tell us roughly what you’re after and we’ll suggest the right service and a time that works."
      />
    </>
  )
}
