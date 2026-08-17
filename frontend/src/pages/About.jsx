import { Link } from 'react-router-dom'
import { aboutImages, business, promises, team } from '../data.js'
import SmartImage from '../components/SmartImage.jsx'
import Reveal from '../components/Reveal.jsx'
import FindUs from '../components/FindUs.jsx'

export default function About() {
  return (
    <>
      <section className="phead">
        <div className="container phead__inner">
          <div>
            <p className="eyebrow">About us</p>
            <h1>
              Where beauty <span className="serif-em">meets calm.</span>
            </h1>
          </div>
          <p className="lede">{business.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about">
          <Reveal className="about__body">
            <h2>Our story</h2>
            <p>
              {business.name} began with a simple idea: make great grooming feel effortless and
              relaxing. What started as a small neighbourhood studio has grown into a favourite
              spot for hair, skin, beauty and spa care in Bandra.
            </p>
            <p>
              Every treatment is delivered by trained professionals using quality products, in a
              spotless, welcoming space. Whether you’re here for a quick trim or a full day of
              pampering, we treat every guest like family.
            </p>

            <h2>How we work</h2>
            <ul className="promises">
              {promises.map((p, i) => (
                <li key={p.title}>
                  <span className="promises__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="promises__t">{p.title}</span>
                  <span className="promises__d">{p.text}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link className="btn btn--primary" to="/contact#book">
                Book an appointment <span className="arw" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn--ghost" to="/services">
                Explore services <span className="arw" aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal className="about__art" delay={80}>
            {aboutImages.map((img) => (
              <div className="ph" key={img.src}>
                <SmartImage src={img} className="ph__img" sizes="(max-width: 960px) 50vw, 520px" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Renders only once real team members are added to data.js */}
      {team.length > 0 && (
        <section className="section section--sand">
          <div className="container">
            <div className="shead">
              <div>
                <p className="shead__no">—</p>
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

      <FindUs no="—" />
    </>
  )
}
