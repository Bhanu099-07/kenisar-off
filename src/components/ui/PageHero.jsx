import { SectionLabel } from './SectionLabel'

export function PageHero({ label, title, description, centered = true }) {
  return (
    <section className={`page-hero ${centered ? 'page-hero--centered' : ''}`}>
      {label ? <SectionLabel>{label}</SectionLabel> : null}
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}
