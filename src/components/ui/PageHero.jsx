import { SectionLabel } from './SectionLabel'

export function PageHero({ label, title, description, centered = true, theme = 'default' }) {
  return (
    <section className={`page-hero page-hero--${theme} ${centered ? 'page-hero--centered' : ''}`} data-reveal="hero">
      <div className="page-hero__visual" aria-hidden="true">
        <span className="page-hero__orb page-hero__orb--one" />
        <span className="page-hero__orb page-hero__orb--two" />
        <span className="page-hero__ring page-hero__ring--one" />
        <span className="page-hero__ring page-hero__ring--two" />
        <span className="page-hero__node page-hero__node--one" />
        <span className="page-hero__node page-hero__node--two" />
        <span className="page-hero__line page-hero__line--one" />
      </div>
      <div className="page-hero__content">
        {label ? <SectionLabel>{label}</SectionLabel> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}
