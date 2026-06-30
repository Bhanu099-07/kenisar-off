import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'

export function PolicyPage({ page }) {
  return (
    <div className="page">
      <PageHero label={page.label} title={page.title} description={page.description} theme="about" />

      <section className="section section--narrow" data-reveal="section">
        <div className="policy-layout">
          <aside className="section-panel section-panel--dark policy-meta-card" data-reveal="card" data-tilt>
            <SectionLabel>Last Updated</SectionLabel>
            <h2 className="section-heading">{page.lastUpdated}</h2>
            <p className="section-intro">{page.appliesTo}</p>
          </aside>

          <div className="page-stack">
            {page.sections.map((section) => (
              <article
                key={section.title}
                className="section-panel section-panel--light policy-section-card"
                data-reveal="card"
                data-tilt
              >
                <SectionLabel>{page.label}</SectionLabel>
                <h2 className="section-heading">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="section-intro policy-copy">
                    {paragraph}
                  </p>
                ))}
                {section.list?.length ? (
                  <ul className="detail-list policy-list">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
